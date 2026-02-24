/**
 * LIVEPAY API v1 - Gestion d'un Marchand Spécifique
 * Endpoints: GET, PUT, DELETE /v1/merchants/:id
 */

import { NextRequest } from 'next/server';
import { Merchant, MerchantUpdateInput } from '@/lib/api/types';
import { generateId, notFoundError, successResponse, validate } from '@/lib/api/utils';

// Reference to merchants array (would be database in production)
const merchants: Merchant[] = [];

// GET /api/v1/merchants/[id] - Récupérer un marchand
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const merchant = merchants.find(m => m.id === id);
    
    if (!merchant) {
      const { error, status } = notFoundError('Marchand');
      return Response.json({ error }, { status });
    }
    
    return Response.json({ data: merchant });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération du marchand',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// PUT /api/v1/merchants/[id] - Mettre à jour un marchand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const merchantIndex = merchants.findIndex(m => m.id === id);
    
    if (merchantIndex === -1) {
      const { error, status } = notFoundError('Marchand');
      return Response.json({ error }, { status });
    }
    
    // Validation
    const validationRules = [
      { field: 'name', type: 'string', minLength: 2, maxLength: 100 },
      { field: 'email', type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { field: 'business_type', type: 'string', enum: ['fintech', 'commerce', 'platform', 'institution', 'marketplace'] },
    ];
    
    const errors = validate(body, validationRules);
    if (errors.length > 0) {
      return Response.json({
        error: {
          error_code: 'request-validation-error',
          error_message: 'La requête contient des champs invalides',
          error_type: 'validation_error',
          details: errors,
          request_id: generateId('req'),
          timestamp: new Date().toISOString(),
        }
      }, { status: 400 });
    }
    
    const input: MerchantUpdateInput = body;
    const merchant = merchants[merchantIndex];
    
    // Mise à jour des champs autorisés
    if (input.name) merchant.name = input.name;
    if (input.email) merchant.email = input.email;
    if (input.phone) merchant.phone = input.phone;
    if (input.sector) merchant.sector = input.sector;
    if (input.business_type) merchant.business_type = input.business_type;
    if (input.fee_structure_checkout) {
      merchant.fee_structure_checkout = { 
        ...merchant.fee_structure_checkout, 
        ...input.fee_structure_checkout 
      };
    }
    if (input.fee_structure_payout) {
      merchant.fee_structure_payout = { 
        ...merchant.fee_structure_payout, 
        ...input.fee_structure_payout 
      };
    }
    if (input.metadata) {
      merchant.metadata = { ...merchant.metadata, ...input.metadata };
    }
    
    merchant.updated_at = new Date().toISOString();
    merchants[merchantIndex] = merchant;
    
    return Response.json({ data: merchant });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la mise à jour du marchand',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// DELETE /api/v1/merchants/[id] - Supprimer un marchand (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const merchantIndex = merchants.findIndex(m => m.id === id);
    
    if (merchantIndex === -1) {
      const { error, status } = notFoundError('Marchand');
      return Response.json({ error }, { status });
    }
    
    // Soft delete - lock the merchant
    merchants[merchantIndex] = {
      ...merchants[merchantIndex],
      is_locked: true,
      lock_reason: 'Merchant deleted via API',
      updated_at: new Date().toISOString(),
    };
    
    return Response.json({ 
      data: { 
        id, 
        deleted: true,
        deleted_at: new Date().toISOString()
      } 
    });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la suppression du marchand',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
