/**
 * LIVEPAY API v1 - Transferts Directs (Par Deep Link)
 * Endpoints: POST, GET /v1/transfers
 * 
 * Utilise Firebase Firestore pour le stockage
 */

import { NextRequest } from 'next/server';
import {
  TransferStatus,
  PaginatedResponse,
  PaymentProvider
} from '@/lib/api/types';
import {
  generateId,
  validate,
  paginate
} from '@/lib/api/utils';
import {
  createTransfer,
  listTransfers,
  getTransferById,
  getTransferByIdempotencyKey,
} from '@/lib/firebase/transfers';
import { Timestamp } from 'firebase/firestore';

// Configuration Wave uniquement
const WAVE_CONFIG = {
  baseUrl: 'https://pay.wave.com/m',
  phoneParam: 'phone',
  amountParam: 'amount',
  referenceParam: 'reference',
  formatPhone: (phone: string) => phone.replace(/^\+/, ''),
};

// POST /api/v1/transfers - Initier un transfert par deep link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérification Idempotency-Key
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      const existingTransfer = await getTransferByIdempotencyKey(idempotencyKey);
      if (existingTransfer) {
        return Response.json({ 
          data: firebaseTransferToApi(existingTransfer),
          meta: {
            idempotent: true,
            message: 'Transfert récupéré depuis la clé d\'idempotence',
          }
        });
      }
    }

    // Validation des champs requis
    const errors = validate(body, [
      { field: 'merchant_id', required: true, type: 'string' },
      { field: 'payer.phone', required: true, type: 'string', pattern: /^\+?[0-9\s-]{8,15}$/ },
      { field: 'beneficiary.phone', required: true, type: 'string', pattern: /^\+?[0-9\s-]{8,15}$/ },
      { field: 'amount', required: true, type: 'number', min: 100 },
      { field: 'currency', type: 'string', enum: ['XOF', 'XAF', 'GMD', 'GNF'] },
      { field: 'provider', type: 'string', enum: ['wave'] }, // Wave uniquement pour le moment
      { field: 'description', type: 'string', maxLength: 500 },
    ]);

    if (errors.length > 0) {
      return Response.json({
        error: {
          error_code: 'validation-error',
          error_message: 'Champs invalides ou manquants',
          error_type: 'validation_error',
          details: errors,
          request_id: generateId('req'),
          timestamp: new Date().toISOString(),
        }
      }, { status: 400 });
    }

    // Préparation des données pour Firestore
    const input: TransferCreateInput = {
      merchantId: body.merchant_id,
      payer: {
        phone: body.payer.phone,
        name: body.payer.name || null,
        email: body.payer.email || null,
        country: body.payer.country || null,
      },
      beneficiary: {
        phone: body.beneficiary.phone,
        name: body.beneficiary.name || null,
        email: body.beneficiary.email || null,
        country: body.beneficiary.country || null,
      },
      amount: body.amount,
      currency: body.currency || 'XOF',
      provider: body.provider,
      description: body.description || null,
      metadata: body.metadata || null,
      idempotencyKey: idempotencyKey || null,
    };

    // Création dans Firestore
    const transfer = await createTransfer(input);

    // Response avec le transfert créé et le deep link
    return Response.json({
      data: firebaseTransferToApi(transfer),
      meta: {
        payment_url: transfer.paymentDeepLink,
        expires_in: 900, // 15 minutes
        instructions: {
          step1: 'Partagez ce lien de paiement au payeur',
          step2: 'Le payeur clique sur le lien et est redirigé vers l\'application',
          step3: 'Le payeur confirme le paiement dans l\'application',
          step4: 'Le statut sera mis à jour après confirmation',
        },
        provider_info: {
          name: getProviderName(input.provider),
          fee_notice: 'Les frais affichés dans l\'application sont ceux du provider',
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating transfer:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de l\'initialisation du transfert',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// GET /api/v1/transfers - Lister les transferts avec pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;

    // Filtres
    const merchantId = searchParams.get('merchant_id') || undefined;
    const status = searchParams.get('status') as TransferStatus | undefined;
    const provider = searchParams.get('provider') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const payerPhone = searchParams.get('payer_phone') || undefined;
    const beneficiaryPhone = searchParams.get('beneficiary_phone') || undefined;

    // Récupération depuis Firestore
    const result = await listTransfers({
      merchantId,
      status,
      provider,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      payerPhone: payerPhone || undefined,
      beneficiaryPhone: beneficiaryPhone || undefined,
      limit: first,
    });

    // Conversion des transferts
    const transfers = result.transfers.map(firebaseTransferToApi);

    // Pagination
    const paginated: PaginatedResponse<Transfer> = {
      data: transfers,
      pagination: {
        has_next_page: result.hasMore,
        has_previous_page: !!after,
        start_cursor: transfers[0]?.id,
        end_cursor: transfers[transfers.length - 1]?.id,
        total_count: undefined, // Non disponible avec Firestore sans count supplémentaire
      }
    };

    return Response.json(paginated);
  } catch (error) {
    console.error('Error listing transfers:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération des transferts',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Convertit un transfert Firestore en format API
 */
function firebaseTransferToApi(transfer: any): Transfer {
  return {
    id: transfer.id,
    merchant_id: transfer.merchantId,
    payer: transfer.payer,
    beneficiary: transfer.beneficiary,
    amount: transfer.amount,
    currency: transfer.currency,
    provider: transfer.provider,
    status: transfer.status,
    payment_deep_link: transfer.paymentDeepLink,
    deep_link_expires_at: transfer.deepLinkExpiresAt?.toDate().toISOString(),
    internal_reference: transfer.internalReference,
    fee_amount: transfer.feeAmount,
    payer_debits: transfer.payerDebits,
    beneficiary_credits: transfer.beneficiaryCredits,
    description: transfer.description,
    metadata: transfer.metadata,
    idempotency_key: transfer.idempotencyKey,
    paid_at: transfer.paidAt?.toDate().toISOString(),
    completed_at: transfer.completedAt?.toDate().toISOString(),
    created_at: transfer.createdAt?.toDate().toISOString(),
    updated_at: transfer.updatedAt?.toDate().toISOString(),
  } as Transfer;
}

function getProviderName(_provider: PaymentProvider): string {
  return 'Wave';
}
