/**
 * LIVEPAY API v1 - Gestion des Marchands
 * Endpoints: GET, POST /v1/merchants
 */

import { NextRequest } from 'next/server';
import { Merchant, MerchantOnboardingInput, PaginatedResponse } from '@/lib/api/types';
import { 
  generateId, 
  successResponse, 
  createdResponse, 
  validationError,
  validate,
  paginate 
} from '@/lib/api/utils';

// Stockage temporaire (à remplacer par une base de données)
const merchants: Merchant[] = [];

// GET /api/v1/merchants - Lister les marchands avec pagination cursor-based
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination cursor-based
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;
    const businessType = searchParams.get('business_type') || undefined;
    const kycStatus = searchParams.get('kyc_status') || undefined;
    
    // Filtrage
    let filteredMerchants = [...merchants];
    
    if (businessType) {
      filteredMerchants = filteredMerchants.filter(m => m.business_type === businessType);
    }
    
    if (kycStatus) {
      filteredMerchants = filteredMerchants.filter(m => m.kyc_status === kycStatus);
    }
    
    // Pagination
    const paginated: PaginatedResponse<Merchant> = paginate(filteredMerchants, { first, after }, filteredMerchants.length);
    
    return Response.json(paginated);
  } catch (error) {
    console.error('Error listing merchants:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération des marchands',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// POST /api/v1/merchants - Créer un nouveau marchand (Onboarding)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des champs requis
    const validationRules = [
      { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
      { field: 'email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { field: 'phone', required: true, type: 'string', pattern: /^\+?[0-9\s-]{8,15}$/ },
      { field: 'registration_identifier', required: true, type: 'string' }, // NINEA/RCCM
      { field: 'sector', required: true, type: 'string' },
      { field: 'business_type', required: true, type: 'string', enum: ['fintech', 'commerce', 'platform', 'institution', 'marketplace'] },
    ];
    
    const errors = validate(body, validationRules);
    
    if (errors.length > 0) {
      const { error, status } = validationError(errors);
      return Response.json({ error }, { status });
    }
    
    const input: MerchantOnboardingInput = body;
    
    // Vérifier l'unicité du nom
    if (merchants.some(m => m.name === input.name)) {
      return Response.json({
        error: {
          error_code: 'conflict-error',
          error_message: 'Un marchand avec ce nom existe déjà',
          error_type: 'conflict',
          request_id: generateId('req'),
          timestamp: new Date().toISOString(),
        }
      }, { status: 409 });
    }
    
    // Création du marchand
    const now = new Date().toISOString();
    const merchant: Merchant = {
      id: generateId('merch'),
      name: input.name,
      email: input.email,
      phone: input.phone,
      registration_identifier: input.registration_identifier,
      sector: input.sector,
      business_type: input.business_type,
      fee_structure_checkout: {
        id: generateId('fee'),
        merchant_id: '', // Sera mis à jour
        type: 'percentage',
        percentage: 2.5, // 2.5% par défaut
        currency: 'XOF',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      fee_structure_payout: {
        id: generateId('fee'),
        merchant_id: '',
        type: 'fixed',
        fixed_amount: 500, // 500 FCFA par défaut
        currency: 'XOF',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      kyc_status: 'pending',
      compliance_level: input.compliance_level || 'standard',
      is_locked: false,
      wallet_id: generateId('wallet'),
      metadata: input.metadata,
      created_at: now,
      updated_at: now,
    };
    
    merchants.push(merchant);
    
    // Response avec le merchant créé
    return Response.json({
      data: merchant,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating merchant:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la création du marchand',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
