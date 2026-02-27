/**
 * LIVEPAY API v1 - Webhooks pour Notifications de Statut
 * Endpoints: POST, GET /v1/webhooks
 * 
 * Permet aux providers de notifier LIVEPay des changements de statut
 * (si webhook configuré côté provider)
 * 
 * Permet aux marchands de recevoir les notifications de leurs transferts
 */

import { NextRequest } from 'next/server';
import { Webhook, WebhookInput, WebhookEventType, PaginatedResponse } from '@/lib/api/types';
import {
  generateId,
  generateWebhookSecret,
  validate,
  paginate,
  generateHmacSignature
} from '@/lib/api/utils';

// Stockage temporaire
const webhooks: Webhook[] = [];

// POST /api/v1/webhooks - Recevoir une notification webhook (des providers ou pour notification marchand)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-livepay-signature');
    const eventType = request.headers.get('x-livepay-event');
    const providerSource = request.headers.get('x-provider-source');

    // Vérification de la signature HMAC (en production)
    // const isValid = verifyHmacSignature(JSON.stringify(body), signature || '', webhookSecret);

    console.log('Webhook received:', {
      event: eventType,
      provider: providerSource,
      signature: signature ? 'present' : 'missing',
      payload: body,
    });

    // Traitement selon le type d'événement
    switch (eventType) {
      case 'payment.success':
      case 'payment.completed':
        await handlePaymentSuccess(body, providerSource);
        break;
      case 'payment.failed':
        await handlePaymentFailed(body, providerSource);
        break;
      case 'payment.pending':
        await handlePaymentPending(body, providerSource);
        break;
      case 'transfer.completed':
        await handleTransferCompleted(body);
        break;
      case 'transfer.failed':
        await handleTransferFailed(body);
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

// GET /api/v1/webhooks - Lister les webhooks configurés (pour les marchands)
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

async function handlePaymentSuccess(payload: any, provider?: string | null) {
  console.log(`[${provider || 'UNKNOWN'}] Payment success:`, payload);
  
  // Dans une implémentation réelle :
  // 1. Trouver le transfert par reference
  // 2. Mettre à jour le statut à 'debited' ou 'success'
  // 3. Notifier le marchand via son webhook
  // 4. Générer un reçu
}

async function handlePaymentFailed(payload: any, provider?: string | null) {
  console.log(`[${provider || 'UNKNOWN'}] Payment failed:`, payload);
  
  // Dans une implémentation réelle :
  // 1. Trouver le transfert par reference
  // 2. Mettre à jour le statut à 'failed'
  // 3. Notifier le marchand et le payeur
  // 4. Proposer une nouvelle tentative
}

async function handlePaymentPending(payload: any, provider?: string | null) {
  console.log(`[${provider || 'UNKNOWN'}] Payment pending:`, payload);
  
  // Le paiement est en attente de confirmation utilisateur
  // Mettre à jour le statut à 'processing'
}

async function handleTransferCompleted(payload: any) {
  console.log('Transfer completed:', payload);
  
  // Transfert complété (débit + crédit)
  // Notifier toutes les parties
}

async function handleTransferFailed(payload: any) {
  console.log('Transfer failed:', payload);
  
  // Transfert échoué
  // Notifier et proposer des actions correctives
}
