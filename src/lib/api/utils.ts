/**
 * LIVEPAY API - Utilitaires et Fonctions Helpers
 */

import { ApiError, ValidationError, PaginatedResponse, CursorPagination } from './types';

// ============================================================================
// GÉNÉRATION D'ID ET RÉFÉRENCES
// ============================================================================

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
}

export function generateReference(prefix: string = 'REF'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const randomPart = Math.random().toString(36).substring(2, 24) + Math.random().toString(36).substring(2, 24);
  const key = `live_${randomPart}`;
  const prefix = key.substring(0, 12) + '...';
  const hash = btoa(key).split('').reverse().join('');
  return { key, prefix, hash };
}

export function generateWebhookSecret(): string {
  return 'whsec_' + Math.random().toString(36).substring(2, 24) + Math.random().toString(36).substring(2, 24);
}

// ============================================================================
// GESTION DES ERREURS API
// ============================================================================

export function createApiError(
  errorCode: string,
  errorMessage: string,
  errorType: ApiError['error_type'],
  details?: ValidationError[],
  httpStatus: number = 400
): { error: ApiError; status: number } {
  return {
    error: {
      error_code: errorCode,
      error_message: errorMessage,
      error_type: errorType,
      details,
      request_id: generateId('req'),
      timestamp: new Date().toISOString(),
    },
    status: httpStatus,
  };
}

export function validationError(details: ValidationError[]): { error: ApiError; status: number } {
  return createApiError(
    'request-validation-error',
    'La requête contient des champs invalides',
    'validation_error',
    details,
    400
  );
}

export function authenticationError(message: string = 'Non autorisé'): { error: ApiError; status: number } {
  return createApiError(
    'authentication-error',
    message,
    'authentication_error',
    undefined,
    401
  );
}

export function authorizationError(message: string = 'Accès refusé'): { error: ApiError; status: number } {
  return createApiError(
    'authorization-error',
    message,
    'authorization_error',
    undefined,
    403
  );
}

export function notFoundError(resource: string): { error: ApiError; status: number } {
  return createApiError(
    'not-found-error',
    `${resource} non trouvé`,
    'not_found',
    undefined,
    404
  );
}

export function conflictError(message: string): { error: ApiError; status: number } {
  return createApiError(
    'conflict-error',
    message,
    'conflict',
    undefined,
    409
  );
}

export function rateLimitError(retryAfter: number): { error: ApiError; status: number } {
  return createApiError(
    'rate-limit-error',
    'Trop de requêtes. Veuillez réessayer plus tard.',
    'rate_limit',
    undefined,
    429
  );
}

export function internalError(message: string = 'Erreur interne du serveur'): { error: ApiError; status: number } {
  return createApiError(
    'internal-error',
    message,
    'internal_error',
    undefined,
    500
  );
}

export function serviceUnavailableError(message: string = 'Service temporairement indisponible'): { error: ApiError; status: number } {
  return createApiError(
    'service-unavailable-error',
    message,
    'service_unavailable',
    undefined,
    503
  );
}

// ============================================================================
// RÉPONSES API STANDARDISÉES
// ============================================================================

export function successResponse<T>(data: T, status: number = 200): { data: T; status: number } {
  return { data, status };
}

export function createdResponse<T>(data: T): { data: T; status: number } {
  return { data, status: 201 };
}

export function noContentResponse(): { data: null; status: number } {
  return { data: null, status: 204 };
}

// ============================================================================
// PAGINATION CURSOR-BASED
// ============================================================================

export function paginate<T>(
  items: T[],
  pagination: CursorPagination,
  total?: number
): PaginatedResponse<T> {
  const { first = 20, after, last, before } = pagination;
  const limit = first || last || 20;
  
  let startIndex = 0;
  let endIndex = items.length;
  
  if (after) {
    const afterIndex = items.findIndex(item => getId(item) === after);
    startIndex = afterIndex !== -1 ? afterIndex + 1 : 0;
  }
  
  if (before) {
    const beforeIndex = items.findIndex(item => getId(item) === before);
    endIndex = beforeIndex !== -1 ? beforeIndex : items.length;
  }
  
  const paginatedItems = items.slice(startIndex, startIndex + limit);
  const hasNextPage = startIndex + limit < items.length;
  const hasPreviousPage = startIndex > 0;
  
  return {
    data: paginatedItems,
    pagination: {
      has_next_page: hasNextPage,
      has_previous_page: hasPreviousPage,
      start_cursor: paginatedItems.length > 0 ? getId(paginatedItems[0]) : undefined,
      end_cursor: paginatedItems.length > 0 ? getId(paginatedItems[paginatedItems.length - 1]) : undefined,
      total_count: total,
    },
  };
}

function getId(item: any): string {
  return item.id || item._id || '';
}

// ============================================================================
// VALIDATION DE DONNÉES
// ============================================================================

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | string;
}

export function validate(data: Record<string, any>, rules: ValidationRule[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const rule of rules) {
    const value = data[rule.field];
    
    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: rule.field,
        message: `Le champ '${rule.field}' est requis`,
        code: 'required',
      });
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    // Type check
    if (rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' doit être de type ${rule.type}`,
          code: 'invalid_type',
        });
        continue;
      }
    }
    
    // String validations
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' doit contenir au moins ${rule.minLength} caractères`,
          code: 'too_short',
        });
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' ne peut pas dépasser ${rule.maxLength} caractères`,
          code: 'too_long',
        });
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' a un format invalide`,
          code: 'invalid_format',
        });
      }
    }
    
    // Number validations
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' doit être supérieur ou égal à ${rule.min}`,
          code: 'too_small',
        });
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' doit être inférieur ou égal à ${rule.max}`,
          code: 'too_big',
        });
      }
    }
    
    // Enum check
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push({
        field: rule.field,
        message: `Le champ '${rule.field}' doit être l'une des valeurs: ${rule.enum.join(', ')}`,
        code: 'invalid_enum',
      });
    }
    
    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value);
      if (typeof result === 'string') {
        errors.push({
          field: rule.field,
          message: result,
          code: 'custom',
        });
      } else if (result === false) {
        errors.push({
          field: rule.field,
          message: `Le champ '${rule.field}' est invalide`,
          code: 'custom',
        });
      }
    }
  }
  
  return errors;
}

// ============================================================================
// UTILITAIRES DATES
// ============================================================================

export function parseDate(dateString?: string): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function isDateWithinRange(date: Date, start?: Date, end?: Date): boolean {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

// ============================================================================
// CRYPTAGE ET SÉCURITÉ
// ============================================================================

export function hashApiKey(key: string): string {
  return btoa(key).split('').reverse().join('');
}

export function verifyApiKey(inputKey: string, storedHash: string): boolean {
  return hashApiKey(inputKey) === storedHash;
}

export function generateHmacSignature(payload: string, secret: string): string {
  // Simple HMAC-like signature (in production, use crypto library)
  const combined = payload + secret;
  return btoa(combined).replace(/=/g, '');
}

export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHmacSignature(payload, secret);
  return signature === expectedSignature;
}

// ============================================================================
// FORMATAGE MONÉTAIRE
// ============================================================================

export function formatAmount(amount: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseAmount(amount: string | number): number {
  if (typeof amount === 'number') return amount;
  return parseInt(amount.replace(/[^0-9]/g, ''), 10);
}

export function calculateFee(amount: number, feeStructure: { type: string; percentage?: number; fixed_amount?: number; min_amount?: number; max_amount?: number }): number {
  let fee = 0;
  
  if (feeStructure.type === 'percentage' && feeStructure.percentage) {
    fee = (amount * feeStructure.percentage) / 100;
  } else if (feeStructure.type === 'fixed' && feeStructure.fixed_amount) {
    fee = feeStructure.fixed_amount;
  } else if (feeStructure.type === 'tiered') {
    // Logic for tiered fees
    fee = amount * 0.02; // Default 2%
  }
  
  if (feeStructure.min_amount && fee < feeStructure.min_amount) {
    fee = feeStructure.min_amount;
  }
  if (feeStructure.max_amount && fee > feeStructure.max_amount) {
    fee = feeStructure.max_amount;
  }
  
  return Math.round(fee);
}
