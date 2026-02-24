/**
 * LIVEPAY API v1 - Gestion des Webhooks
 * Endpoints: POST, GET /v1/webhooks
 * Signature HMAC-SHA256
 */

import { NextRequest } from 'next/server';
import { Webhook, WebhookInput, WebhookEventType, PaginatedResponse } from '@/lib/api/types';
import { 
  generateId, 
  generateWebhookSecret,
  validationError,
  validate,
  paginate,
  verifyHmacSignature
} from '@/lib/api/utils';

// Stockage temporaire
const webhooks: Webhook[] = [];

// POST /api/v1/webhooks - Recevoir une notification webhook (pour les providers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-livepay-signature');
    const eventType = request.headers.get('x-livepay-event');
    
    // Vérification de la signature HMAC (en production)
    // const isValid = verifyHmacSignature(JSON.stringify(body), signature || '', webhookSecret);
    
    // Traitement de l'événement
    console.log('Webhook received:', {
      event: eventType,
      signature,
      payload: body,
    });
    
    // Traitement selon le type d'événement
    switch (eventType) {
      case 'payment.success':
        await handlePaymentSuccess(body);
        break;
      case 'payment.failed':
        await handlePaymentFailed(body);
        break;
      case 'payment.refunded':
        await handlePaymentRefunded(body);
        break;
      default:
        console.log('Unknown event type:', eventType);
    }
    
    return Response.json({ 
      received: true,
      event: eventType,
      processed_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return Response.json({
      error: {
        error_code: 'webhook-processing-error',
        error_message: 'Erreur lors du traitement du webhook',
      }
    }, { status: 500 });
  }
}

// GET /api/v1/webhooks - Lister les webhooks configurés
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;
    const merchantId = searchParams.get('merchant_id') || undefined;
    
    let filteredWebhooks = [...webhooks];
    
    if (merchantId) {
      filteredWebhooks = filteredWebhooks.filter(w => w.merchant_id === merchantId);
    }
    
    const paginated: PaginatedResponse<Webhook> = paginate(filteredWebhooks, { first, after }, filteredWebhooks.length);
    
    return Response.json(paginated);
  } catch (error) {
    console.error('Error listing webhooks:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération des webhooks',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// ============================================================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================================================

async function handlePaymentSuccess(payload: any) {
  console.log('Processing payment success:', payload);
  // Mettre à jour le paiement en base de données
  //Notifier le marchand
  // Générer un reçu
}

async function handlePaymentFailed(payload: any) {
  console.log('Processing payment failed:', payload);
  // Mettre à jour le statut du paiement
  // Notifier le marchand et le client
  // Déclencher une tentative de retry si applicable
}

async function handlePaymentRefunded(payload: any) {
  console.log('Processing payment refunded:', payload);
  // Traiter le remboursement
  // Mettre à jour les soldes
  // Notifier les parties
}

// ============================================================================
// CRÉATION DE WEBHOOK (pour les marchands)
// ============================================================================

export async function createWebhook(input: WebhookInput): Promise<Webhook> {
  const validationRules = [
    { field: 'merchant_id', required: true, type: 'string' },
    { field: 'url', required: true, type: 'string', pattern: /^https:\/\// },
    { field: 'events', required: true, type: 'array' },
  ];
  
  const errors = validate(input, validationRules);
  if (errors.length > 0) {
    throw new Error('Invalid webhook input');
  }
  
  const now = new Date().toISOString();
  const webhook: Webhook = {
    id: generateId('whook'),
    merchant_id: input.merchant_id,
    url: input.url,
    events: input.events,
    secret: generateWebhookSecret(),
    is_active: true,
    last_triggered_at: undefined,
    success_count: 0,
    failure_count: 0,
    created_at: now,
    updated_at: now,
  };
  
  webhooks.push(webhook);
  return webhook;
}
