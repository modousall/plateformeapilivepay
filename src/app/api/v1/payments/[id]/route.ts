/**
 * LIVEPAY API v1 - Gestion d'un Paiement Spécifique
 * Endpoint: GET /v1/payments/[id]
 */

import { NextRequest } from 'next/server';
import { Payment } from '@/lib/api/types';
import { generateId, notFoundError } from '@/lib/api/utils';

// Reference to payments array
const payments: Payment[] = [];

// GET /api/v1/payments/[id] - Récupérer un paiement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const payment = payments.find(p => p.id === id);
    
    if (!payment) {
      const { error, status } = notFoundError('Paiement');
      return Response.json({ error }, { status });
    }
    
    return Response.json({ data: payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération du paiement',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
