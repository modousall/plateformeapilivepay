/**
 * LIVEPAY API - Types et Interfaces
 * Architecture d'agrégateur de paiements Mobile Money & PI-SPI
 * Conforme aux standards PSP zone UEMOA / BCEAO
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type UserRole = 'super_admin' | 'admin' | 'merchant' | 'api_user';
export type MerchantBusinessType = 'fintech' | 'commerce' | 'platform' | 'institution' | 'marketplace';
export type ComplianceLevel = 'basic' | 'standard' | 'enhanced' | 'premium';
export type KYCStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';
export type PaymentProvider = 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money' | 'free_money' | 'pispi';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'reversed' | 'refunded' | 'expired';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type Currency = 'XOF' | 'XAF' | 'GMD' | 'GNF';
export type WebhookEventType = 'payment.success' | 'payment.failed' | 'payment.refunded' | 'payout.completed' | 'payout.failed' | 'merchant.verified' | 'merchant.rejected';

// ============================================================================
// MERCHANT (MARCHAND)
// ============================================================================

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  registration_identifier: string; // NINEA / RCCM
  sector: string;
  business_type: MerchantBusinessType;
  fee_structure_checkout: FeeStructure;
  fee_structure_payout: FeeStructure;
  kyc_status: KYCStatus;
  compliance_level: ComplianceLevel;
  is_locked: boolean;
  lock_reason?: string;
  wallet_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MerchantOnboardingInput {
  name: string;
  email: string;
  phone: string;
  registration_identifier: string;
  sector: string;
  business_type: MerchantBusinessType;
  compliance_level?: ComplianceLevel;
  metadata?: Record<string, unknown>;
}

export interface MerchantUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  sector?: string;
  business_type?: MerchantBusinessType;
  fee_structure_checkout?: Partial<FeeStructure>;
  fee_structure_payout?: Partial<FeeStructure>;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// FEE STRUCTURE (STRUCTURE TARIFAIRE)
// ============================================================================

export interface FeeStructure {
  id: string;
  merchant_id: string;
  type: 'percentage' | 'fixed' | 'tiered' | 'dynamic';
  percentage?: number; // 0-100
  fixed_amount?: number; // en FCFA
  min_amount?: number;
  max_amount?: number;
  tiers?: FeeTier[];
  currency: Currency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeTier {
  min_amount: number;
  max_amount: number;
  percentage: number;
  fixed_amount: number;
}

// ============================================================================
// PAYMENT (PAIEMENT)
// ============================================================================

export interface Payment {
  id: string;
  merchant_id: string;
  wallet_id: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  status: PaymentStatus;
  external_reference: string;
  internal_reference: string;
  fee_amount: number;
  net_amount: number;
  customer_phone?: string;
  customer_name?: string;
  customer_email?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
  error_code?: string;
  error_message?: string;
  provider_response?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface PaymentInitInput {
  merchant_id: string;
  amount: number;
  currency?: Currency;
  provider?: PaymentProvider;
  customer_phone?: string;
  customer_name?: string;
  customer_email?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
  callback_url?: string;
}

export interface PaymentConfirmInput {
  otp?: string;
  pin?: string;
}

// ============================================================================
// PAYOUT (DÉCAISSEMENT)
// ============================================================================

export interface Payout {
  id: string;
  merchant_id: string;
  wallet_id: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  status: PayoutStatus;
  beneficiary_phone: string;
  beneficiary_name: string;
  fee_amount: number;
  net_amount: number;
  external_reference: string;
  internal_reference: string;
  description?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
  error_code?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface PayoutInitInput {
  merchant_id: string;
  amount: number;
  currency?: Currency;
  provider?: PaymentProvider;
  beneficiary_phone: string;
  beneficiary_name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

// ============================================================================
// REFUND (REMBOURSEMENT)
// ============================================================================

export interface Refund {
  id: string;
  payment_id: string;
  merchant_id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  reason: string;
  external_reference: string;
  internal_reference: string;
  fee_refunded: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface RefundInitInput {
  payment_id: string;
  amount?: number; // Partial refund
  reason: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

// ============================================================================
// WALLET (PORTEFEUILLE)
// ============================================================================

export interface Wallet {
  id: string;
  merchant_id: string;
  type: 'operational' | 'escrow' | 'settlement';
  balance: number;
  available_balance: number;
  pending_balance: number;
  currency: Currency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: Currency;
  balance_after: number;
  reference_type: 'payment' | 'payout' | 'refund' | 'adjustment';
  reference_id: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// WEBHOOK
// ============================================================================

export interface Webhook {
  id: string;
  merchant_id: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  is_active: boolean;
  last_triggered_at?: string;
  success_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookInput {
  merchant_id: string;
  url: string;
  events: WebhookEventType[];
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: WebhookEventType;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  http_status?: number;
  response_body?: string;
  attempts: number;
  next_retry_at?: string;
  created_at: string;
  delivered_at?: string;
}

// ============================================================================
// API KEY
// ============================================================================

export interface ApiKey {
  id: string;
  merchant_id: string;
  wallet_id: string;
  name: string;
  key_prefix: string; // Pour affichage partiel
  key_hash: string; // Hash pour vérification
  permissions: string[];
  rate_limit?: number; // requests/minute
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  revoked_at?: string;
}

export interface ApiKeyCreateInput {
  merchant_id: string;
  wallet_id: string;
  name: string;
  permissions?: string[];
  rate_limit?: number;
  expires_in_days?: number;
}

// ============================================================================
// PAGINATION (CURSOR-BASED)
// ============================================================================

export interface CursorPagination {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    has_next_page: boolean;
    has_previous_page: boolean;
    start_cursor?: string;
    end_cursor?: string;
    total_count?: number;
  };
}

// ============================================================================
// ERROR RESPONSE
// ============================================================================

export interface ApiError {
  error_code: string;
  error_message: string;
  error_type: 'validation_error' | 'authentication_error' | 'authorization_error' | 'not_found' | 'conflict' | 'rate_limit' | 'internal_error' | 'service_unavailable';
  details?: ValidationError[];
  request_id: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// PI-SPI TYPES
// ============================================================================

export interface PispiTransaction {
  id: string;
  spi_reference: string;
  originating_wallet: string;
  beneficiary_wallet: string;
  amount: number;
  currency: Currency;
  status: 'initiated' | 'routed' | 'completed' | 'failed' | 'reversed';
  provider_route: string[];
  fallback_used: boolean;
  reconciliation_status: 'pending' | 'matched' | 'discrepancy';
  created_at: string;
  completed_at?: string;
}

export interface ProviderRoute {
  provider: PaymentProvider;
  priority: number;
  is_active: boolean;
  daily_limit?: number;
  transaction_limit?: number;
  success_rate: number;
  avg_response_time_ms: number;
}

// ============================================================================
// COMPLIANCE & AML
// ============================================================================

export interface ComplianceCheck {
  id: string;
  merchant_id: string;
  check_type: 'transaction_monitoring' | 'threshold_alert' | 'frequency_analysis' | 'sanctions_screening';
  status: 'passed' | 'warning' | 'blocked' | 'manual_review';
  risk_score: number; // 0-100
  flags: string[];
  details?: Record<string, unknown>;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface TransactionLimit {
  merchant_id: string;
  daily_limit: number;
  monthly_limit: number;
  per_transaction_limit: number;
  currency: Currency;
  is_active: boolean;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface MerchantAnalytics {
  merchant_id: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    total_transactions: number;
    successful_transactions: number;
    failed_transactions: number;
    total_volume: number;
    successful_volume: number;
    total_fees: number;
    success_rate: number;
    avg_transaction_amount: number;
    refund_count: number;
    refund_volume: number;
  };
  by_provider: Record<string, {
    count: number;
    volume: number;
    success_rate: number;
  }>;
  by_status: Record<string, number>;
  daily_breakdown: {
    date: string;
    transactions: number;
    volume: number;
  }[];
}
