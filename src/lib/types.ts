export type PaymentLinkStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export type Environment = 'production' | 'sandbox' | 'test';

export type PaymentProvider = 
  | 'wave'
  | 'orange_money'
  | 'mtn_momo'
  | 'moov_money'
  | 'free_money'
  | 'pispi';

export type UEMOACountry = 'SN' | 'CI' | 'ML' | 'BF' | 'NE' | 'TG' | 'BJ' | 'GW';

export interface SuperAdminConfig {
  email: string;
  name: string;
  role: string;
}

export interface MerchantConfig {
  businessName: string;
  accountNumber: string;
  b2bIdentifier: string;
  phoneNumber: string;
  country: UEMOACountry;
}

export interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  provider: PaymentProvider;
  buyerPhone?: string;
  buyerName?: string;
  buyerEmail?: string;
  deepLink: string;
  shortUrl?: string;
  status: PaymentLinkStatus;
  createdAt: Date;
  expiresAt?: Date;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentLinkInput {
  name: string;
  amount: number;
  description: string;
  provider: PaymentProvider;
  buyerPhone?: string;
  buyerName?: string;
  buyerEmail?: string;
  expiresInSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdatePaymentLinkInput {
  name?: string;
  status?: PaymentLinkStatus;
  paymentMethod?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
}
