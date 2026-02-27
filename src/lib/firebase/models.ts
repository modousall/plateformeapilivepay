/**
 * Modèles de Données Firestore pour LIVEPay
 * 
 * Structures des collections Firestore
 */

import { Timestamp, DocumentReference } from 'firebase/firestore';

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type TransferStatus = 
  | 'pending' 
  | 'processing' 
  | 'debited' 
  | 'credited' 
  | 'success' 
  | 'failed' 
  | 'reversed' 
  | 'expired';

export type PaymentProvider = 
  | 'wave' 
  | 'orange_money' 
  | 'mtn_momo' 
  | 'moov_money' 
  | 'free_money';

export type Currency = 'XOF' | 'XAF' | 'GMD' | 'GNF';

export type UEMOACountry = 'SN' | 'CI' | 'ML' | 'BF' | 'NE' | 'TG' | 'BJ' | 'GW';

export type WebhookEventType = 
  | 'payment.success' 
  | 'payment.failed' 
  | 'payment.pending'
  | 'transfer.completed' 
  | 'transfer.failed';

// ============================================================================
// TRANSFER (Collection: transfers)
// ============================================================================

export interface TransferParty {
  phone: string;
  name?: string | null;
  email?: string | null;
  country?: UEMOACountry | null;
}

export interface Transfer {
  id: string;
  merchantId: string;
  
  // Parties
  payer: TransferParty;
  beneficiary: TransferParty;
  
  // Détails
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  status: TransferStatus;
  
  // Deep Link
  paymentDeepLink: string;
  deepLinkExpiresAt: Timestamp;
  
  // Références
  internalReference: string;
  
  // Frais
  feeAmount: number;
  payerDebits: number;
  beneficiaryCredits: number;
  
  // Métadonnées
  description?: string | null;
  metadata?: Record<string, any> | null;
  idempotencyKey?: string | null;
  
  // Timestamps
  paidAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TransferCreateInput {
  merchantId: string;
  payer: TransferParty;
  beneficiary: TransferParty;
  amount: number;
  currency?: Currency;
  provider: PaymentProvider;
  description?: string | null;
  metadata?: Record<string, any> | null;
  idempotencyKey?: string | null;
}

// ============================================================================
// MERCHANT (Collection: merchants)
// ============================================================================

export type MerchantBusinessType = 'fintech' | 'commerce' | 'platform' | 'institution' | 'marketplace';
export type ComplianceLevel = 'basic' | 'standard' | 'enhanced' | 'premium';
export type KYCStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationIdentifier?: string | null;
  sector?: string | null;
  businessType: MerchantBusinessType;
  kycStatus: KYCStatus;
  complianceLevel: ComplianceLevel;
  isActive: boolean;
  metadata?: Record<string, any> | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MerchantCreateInput {
  name: string;
  email: string;
  phone: string;
  registrationIdentifier?: string | null;
  sector?: string | null;
  businessType?: MerchantBusinessType;
  metadata?: Record<string, any> | null;
}

// ============================================================================
// WEBHOOK (Collection: webhooks)
// ============================================================================

export interface Webhook {
  id: string;
  merchantId: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  isActive: boolean;
  lastTriggeredAt?: Timestamp | null;
  successCount: number;
  failureCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WebhookCreateInput {
  merchantId: string;
  url: string;
  events: WebhookEventType[];
}

// ============================================================================
// WEBHOOK LOG (Collection: webhook_logs)
// ============================================================================

export interface WebhookLog {
  id: string;
  webhookId: string;
  eventType: WebhookEventType;
  payload: Record<string, any>;
  responseStatus?: number | null;
  responseBody?: string | null;
  isSuccess: boolean;
  attempts: number;
  createdAt: Timestamp;
  deliveredAt?: Timestamp | null;
}

// ============================================================================
// API KEY (Collection: api_keys)
// ============================================================================

export interface ApiKey {
  id: string;
  merchantId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permissions: string[];
  rateLimit?: number | null;
  isActive: boolean;
  expiresAt?: Timestamp | null;
  lastUsedAt?: Timestamp | null;
  createdAt: Timestamp;
  revokedAt?: Timestamp | null;
}

export interface ApiKeyCreateInput {
  merchantId: string;
  name: string;
  permissions?: string[];
  rateLimit?: number | null;
  expiresAt?: Timestamp | null;
}

// ============================================================================
// USER (Collection: users)
// ============================================================================

export type UserRole = 'super_admin' | 'admin' | 'merchant' | 'api_user';

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role: UserRole;
  merchantId?: string | null;
  phone?: string | null;
  isActive: boolean;
  lastLoginAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// STATS AGGREGATES (Collection: stats_aggregates)
// ============================================================================

export interface MerchantStatsAggregate {
  merchantId: string;
  period: 'daily' | 'monthly' | 'yearly';
  periodStart: Timestamp;
  periodEnd: Timestamp;
  
  // Compteurs
  totalTransfers: number;
  successfulTransfers: number;
  failedTransfers: number;
  pendingTransfers: number;
  
  // Volumes
  totalAmount: number;
  totalFees: number;
  
  // Par provider
  byProvider: Record<string, {
    count: number;
    volume: number;
    successCount: number;
  }>;
  
  updatedAt: Timestamp;
}

// ============================================================================
// COLLECTIONS FIREBASE
// ============================================================================

export const COLLECTIONS = {
  TRANSFERS: 'transfers',
  MERCHANTS: 'merchants',
  WEBHOOKS: 'webhooks',
  WEBHOOK_LOGS: 'webhook_logs',
  API_KEYS: 'api_keys',
  USERS: 'users',
  STATS_AGGREGATES: 'stats_aggregates',
} as const;

// ============================================================================
// INDEXES RECOMMANDÉS
// ============================================================================

/**
 * Indexes Firestore à créer dans la console Firebase :
 * 
 * Collection: transfers
 * - merchantId (ASC), createdAt (DESC)
 * - merchantId (ASC), status (ASC), createdAt (DESC)
 * - merchantId (ASC), provider (ASC), createdAt (DESC)
 * - status (ASC), createdAt (DESC)
 * - payer.phone (ASC), createdAt (DESC)
 * - beneficiary.phone (ASC), createdAt (DESC)
 * 
 * Collection: webhooks
 * - merchantId (ASC), isActive (ASC)
 * 
 * Collection: webhook_logs
 * - webhookId (ASC), createdAt (DESC)
 * - createdAt (DESC)
 * 
 * Collection: api_keys
 * - merchantId (ASC), isActive (ASC)
 * - keyHash (ASC)
 */
