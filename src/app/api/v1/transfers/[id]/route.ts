/**
 * LIVEPAY API v1 - Gestion d'un Transfert Direct (par ID)
 * Endpoints: GET, POST /v1/transfers/:id
 * 
 * Utilise Firebase Firestore pour le stockage
 */

import { NextRequest } from 'next/server';
import { generateId } from '@/lib/api/utils';
import {
  getTransferById,
  markTransferAsPaid,
  markTransferAsCompleted,
  markTransferAsFailed,
  cancelTransfer,
} from '@/lib/firebase/transfers';

// GET /api/v1/transfers/:id - Récupérer un transfert spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await getTransferById(id);

    if (!transfer) {
      return Response.json({
        error: {
          error_code: 'not-found',
          error_message: 'Transfert non trouvé',
          error_type: 'not_found',
          request_id: generateId('req'),
          timestamp: new Date().toISOString(),
        }
      }, { status: 404 });
    }

    return Response.json({ 
      data: firebaseTransferToApi(transfer) 
    });
  } catch (error) {
    console.error('Error getting transfer:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération du transfert',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// POST /api/v1/transfers/:id - Actions sur un transfert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await getTransferById(id);

    if (!transfer) {
      return Response.json({
        error: {
          error_code: 'not-found',
          error_message: 'Transfert non trouvé',
          error_type: 'not_found',
          request_id: generateId('req'),
          timestamp: new Date().toISOString(),
        }
      }, { status: 404 });
    }

    const body = await request.json();
    const action = body.action;

    switch (action) {
      case 'mark_paid':
        await markTransferAsPaid(id);
        break;
      
      case 'mark_completed':
        await markTransferAsCompleted(id);
        break;
      
      case 'mark_failed':
        await markTransferAsFailed(
          id, 
          body.error_code as string, 
          body.error_message as string
        );
        break;
      
      case 'cancel':
        await cancelTransfer(id);
        break;
      
      default:
        return Response.json({
          error: {
            error_code: 'invalid-action',
            error_message: `Action '${action}' non supportée. Actions valides: mark_paid, mark_completed, mark_failed, cancel`,
            error_type: 'validation_error',
            request_id: generateId('req'),
            timestamp: new Date().toISOString(),
          }
        }, { status: 400 });
    }

    // Récupérer le transfert mis à jour
    const updatedTransfer = await getTransferById(id);

    return Response.json({
      data: firebaseTransferToApi(updatedTransfer!),
      meta: {
        message: 'Action effectuée avec succès',
      }
    });

  } catch (error) {
    console.error('Error processing transfer action:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors du traitement de l\'action',
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

function firebaseTransferToApi(transfer: any): any {
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
  };
}
