/**
 * LIVEPAY JavaScript SDK
 * 
 * Installation: npm install @livepay/sdk
 * 
 * Usage:
 * ```typescript
 * import { LivePay } from '@livepay/sdk';
 * 
 * const client = new LivePay('your_api_key');
 * 
 * // Create a payment link
 * const link = await client.paymentLinks.create({
 *   amount: 10000,
 *   description: 'Commande #123',
 *   provider: 'wave',
 *   buyer_phone: '+221700000000'
 * });
 * 
 * // Get a payment link
 * const link = await client.paymentLinks.get('link_id');
 * 
 * // List payment links
 * const links = await client.paymentLinks.list({ limit: 10 });
 * ```
 */

export interface LivePayConfig {
  apiKey: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface CreatePaymentLinkData {
  name?: string;
  amount: number;
  description: string;
  provider: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money' | 'free_money' | 'pispi';
  buyer_phone?: string;
  buyer_name?: string;
  buyer_email?: string;
  expires_in?: number;
  metadata?: Record<string, any>;
}

export interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  provider: string;
  deep_link: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  created_at: string;
  paid_at?: string;
  expires_at?: string;
}

export interface LivePayResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export class LivePayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'LivePayError';
  }
}

export class LivePay {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: string | LivePayConfig) {
    if (typeof config === 'string') {
      this.apiKey = config;
      this.baseUrl = 'https://api.livepay.sn/v1';
      this.timeout = 30000;
    } else {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://api.livepay.sn/v1';
      this.timeout = config.timeout || 30000;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<LivePayResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new LivePayError(response.status, data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof LivePayError) {
        throw error;
      }
      throw new LivePayError(500, 'Network error');
    }
  }

  paymentLinks = {
    /**
     * Create a new payment link
     */
    create: async (data: CreatePaymentLinkData): Promise<PaymentLink> => {
      const response = await this.request<PaymentLink>('/payment-links', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    /**
     * Get a payment link by ID
     */
    get: async (id: string): Promise<PaymentLink> => {
      const response = await this.request<PaymentLink>(`/payment-links/${id}`);
      return response.data;
    },

    /**
     * List payment links
     */
    list: async (params?: {
      status?: string;
      provider?: string;
      limit?: number;
    }): Promise<PaymentLink[]> => {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const response = await this.request<PaymentLink[]>(`/payment-links${queryString ? `?${queryString}` : ''}`);
      return response.data;
    },

    /**
     * Update a payment link
     */
    update: async (id: string, data: Partial<PaymentLink>): Promise<PaymentLink> => {
      const response = await this.request<PaymentLink>(`/payment-links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    /**
     * Delete a payment link
     */
    delete: async (id: string): Promise<void> => {
      await this.request(`/payment-links/${id}`, {
        method: 'DELETE',
      });
    },
  };

  /**
   * Get account statistics
   */
  stats = {
    get: async (params?: {
      start_date?: string;
      end_date?: string;
      provider?: string;
    }): Promise<any> => {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const response = await this.request(`/stats${queryString ? `?${queryString}` : ''}`);
      return response.data;
    },
  };

  /**
   * Verify webhook signature
   */
  webhooks = {
    verifySignature: (payload: string, signature: string, secret: string): boolean => {
      // In production, implement HMAC-SHA256 verification
      return true;
    },
  };
}

export default LivePay;
