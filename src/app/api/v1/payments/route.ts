/**
 * LIVEPAY API v1 - Gestion des Paiements
 * Endpoints: POST, GET /v1/payments
 * Agrégateur Multi-Mobile Money & PI-SPI
 */

import { NextRequest } from 'next/server';
import { Payment, PaymentInitInput, PaymentStatus, PaginatedResponse } from '@/lib/api/types';
import { 
  generateId, 
  generateReference, 
  successResponse, 
  createdResponse, 
  validationError,
  validate,
  paginate,
  calculateFee,
  generateHmacSignature
} from '@/lib/api/utils';

// Stockage temporaire (à remplacer par une base de données)
const payments: Payment[] = [];

// POST /api/v1/payments - Initier un nouveau paiement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vérification Idempotency-Key
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      const existingPayment = payments.find(p => p.idempotency_key === idempotencyKey);
      if (existingPayment) {
        // Retourner la réponse existante pour la même requête
        return Response.json({ data: existingPayment });
      }
    }
    
    // Validation des champs requis
    const validationRules = [
      { field: 'merchant_id', required: true, type: 'string' },
      { field: 'amount', required: true, type: 'number', min: 100 }, // Minimum 100 FCFA
      { field: 'currency', type: 'string', enum: ['XOF', 'XAF', 'GMD', 'GNF'] },
      { field: 'provider', type: 'string', enum: ['wave', 'orange_money', 'mtn_momo', 'moov_money', 'free_money', 'pispi'] },
      { field: 'customer_phone', type: 'string', pattern: /^\+?[0-9\s-]{8,15}$/ },
      { field: 'description', type: 'string', maxLength: 500 },
    ];
    
    const errors = validate(body, validationRules);
    
    if (errors.length > 0) {
      const { error, status } = validationError(errors);
      return Response.json({ error }, { status });
    }
    
    const input: PaymentInitInput = body;
    const now = new Date().toISOString();
    
    // Calcul des frais
    const feeStructure = {
      type: 'percentage' as const,
      percentage: 2.5, // 2.5% par défaut
      min_amount: 50, // Minimum 50 FCFA
      max_amount: 5000, // Maximum 5000 FCFA
    };
    
    const feeAmount = calculateFee(input.amount, feeStructure);
    const netAmount = input.amount - feeAmount;
    
    // Création du paiement
    const payment: Payment = {
      id: generateId('pay'),
      merchant_id: input.merchant_id,
      wallet_id: generateId('wallet'), // Sera lié au wallet du marchand
      amount: input.amount,
      currency: input.currency || 'XOF',
      provider: input.provider || 'wave',
      status: 'pending',
      external_reference: generateReference('EXT'),
      internal_reference: generateReference('INT'),
      fee_amount: feeAmount,
      net_amount: netAmount,
      customer_phone: input.customer_phone,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      description: input.description,
      metadata: input.metadata,
      idempotency_key: idempotencyKey || undefined,
      created_at: now,
      updated_at: now,
    };
    
    payments.push(payment);
    
    // Simulation d'appel au provider (dans la réalité, appel API Wave/Orange/etc.)
    // Ici on simule un traitement asynchrone
    setTimeout(() => {
      processPaymentWithProvider(payment);
    }, 1000);
    
    // Response avec le paiement créé
    return Response.json({
      data: payment,
      meta: {
        deep_link: `https://pay.wave.com/m/M_sn_7kcELqHS_AKN?amount=${payment.amount}&reference=${payment.internal_reference}`,
        expires_in: 900, // 15 minutes
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating payment:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de l\'initialisation du paiement',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// GET /api/v1/payments - Lister les paiements avec pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination cursor-based
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;
    
    // Filtres
    const merchantId = searchParams.get('merchant_id') || undefined;
    const status = searchParams.get('status') || undefined;
    const provider = searchParams.get('provider') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    
    let filteredPayments = [...payments];
    
    if (merchantId) {
      filteredPayments = filteredPayments.filter(p => p.merchant_id === merchantId);
    }
    
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    
    if (provider) {
      filteredPayments = filteredPayments.filter(p => p.provider === provider);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filteredPayments = filteredPayments.filter(p => new Date(p.created_at) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      filteredPayments = filteredPayments.filter(p => new Date(p.created_at) <= end);
    }
    
    // Pagination
    const paginated: PaginatedResponse<Payment> = paginate(filteredPayments, { first, after }, filteredPayments.length);
    
    return Response.json(paginated);
  } catch (error) {
    console.error('Error listing payments:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération des paiements',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// ============================================================================
// MOTEUR DE TRAITEMENT DES PAIEMENTS
// ============================================================================

async function processPaymentWithProvider(payment: Payment) {
  try {
    // Simulation du routage PI-SPI
    const route = await routePaymentViaPISPI(payment);
    
    // Mise à jour du statut
    const paymentIndex = payments.findIndex(p => p.id === payment.id);
    if (paymentIndex !== -1) {
      payments[paymentIndex] = {
        ...payments[paymentIndex],
        status: route.success ? 'success' : 'failed',
        provider_response: route.response,
        error_code: route.success ? undefined : route.errorCode,
        error_message: route.success ? undefined : route.errorMessage,
        updated_at: new Date().toISOString(),
        completed_at: route.success ? new Date().toISOString() : undefined,
      };
      
      // Déclencher webhook si configuré
      await triggerWebhook(payments[paymentIndex]);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

// Routage intelligent via moteur PI-SPI
async function routePaymentViaPISPI(payment: Payment): Promise<{
  success: boolean;
  response?: Record<string, unknown>;
  errorCode?: string;
  errorMessage?: string;
}> {
  // Logique de routage intelligent
  const providerRoutes = [
    { provider: 'wave', priority: 1, successRate: 0.98 },
    { provider: 'orange_money', priority: 2, successRate: 0.95 },
    { provider: 'mtn_momo', priority: 3, successRate: 0.94 },
  ];
  
  // Sélection du provider selon disponibilité et performance
  const selectedRoute = providerRoutes.find(r => r.successRate > 0.9) || providerRoutes[0];
  
  // Simulation d'appel API provider
  const success = Math.random() > 0.05; // 95% de succès
  
  if (success) {
    return {
      success: true,
      response: {
        transaction_id: generateId('txn'),
        provider: selectedRoute.provider,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }
    };
  } else {
    // Fallback vers le provider suivant
    const fallbackRoute = providerRoutes.find(r => r.provider !== selectedRoute.provider);
    if (fallbackRoute) {
      return {
        success: true,
        response: {
          transaction_id: generateId('txn'),
          provider: fallbackRoute.provider,
          status: 'completed',
          fallback_used: true,
          completed_at: new Date().toISOString(),
        }
      };
    }
    
    return {
      success: false,
      errorCode: 'provider-error',
      errorMessage: 'Échec de tous les providers',
    };
  }
}

// Déclenchement des webhooks
async function triggerWebhook(payment: Payment) {
  // Dans la réalité, envoi HTTP POST vers l'URL du webhook
  const webhookPayload = {
    event: payment.status === 'success' ? 'payment.success' : 'payment.failed',
    timestamp: new Date().toISOString(),
    data: {
      id: payment.id,
      merchant_id: payment.merchant_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      provider: payment.provider,
      external_reference: payment.external_reference,
      completed_at: payment.completed_at,
    }
  };
  
  const signature = generateHmacSignature(
    JSON.stringify(webhookPayload),
    'webhook_secret_key'
  );
  
  console.log('Webhook triggered:', {
    payload: webhookPayload,
    signature,
    headers: {
      'x-livepay-signature': signature,
      'x-livepay-event': webhookPayload.event,
    }
  });
}
