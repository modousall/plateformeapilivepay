import { SuperAdminConfig, MerchantConfig, PaymentProvider, UEMOACountry } from './types';

export const SUPER_ADMIN_CONFIG: SuperAdminConfig = {
  email: 'modousall1@gmail.com',
  name: 'Mr Modou SALL',
  role: 'Super Administrateur',
};

export const PAYMENT_PROVIDERS: Record<PaymentProvider, { name: string; color: string; icon: string; countries: UEMOACountry[] }> = {
  wave: {
    name: 'Wave',
    color: 'bg-blue-500',
    icon: '💙',
    countries: ['SN', 'CI'],
  },
};

export const MERCHANT_CONFIG: MerchantConfig = {
  businessName: 'LIVEPAY',
  accountNumber: 'SN 38 26 08 81',
  b2bIdentifier: 'M_sn_7kcELqHS_AKN',
  phoneNumber: '+221705000505',
  country: 'SN',
};

export const PLATFORM_CONFIG = {
  name: 'LIVEPAY',
  domain: 'livepay.tech',
  apiUrl: 'https://api.livepay.tech/v1',
  supportEmail: 'support@livepay.tech',
  supportPhone: '+221705000505',
};

// Wave uniquement pour le moment
export const WAVE_CONFIG = {
  name: 'Wave',
  color: 'bg-blue-500',
  icon: '💙',
  countries: ['SN', 'CI'] as const,
  deepLinkPrefix: 'https://pay.wave.com/m',
};

export function generateDeepLink(
  merchantId: string,
  amount: number,
  reference: string,
  phoneNumber?: string
): string {
  let url = `${WAVE_CONFIG.deepLinkPrefix}/${merchantId}`;

  const params = new URLSearchParams();
  params.set('amount', amount.toString());
  params.set('reference', reference);

  if (phoneNumber) {
    params.set('phone', phoneNumber.replace(/[^0-9+]/g, ''));
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

export function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LIVEPAY-${timestamp}-${random}`;
}

export function formatAmountFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

export function getProviderColor(): string {
  return WAVE_CONFIG.color;
}

export function getProviderIcon(): string {
  return WAVE_CONFIG.icon;
}

export function getProviderName(): string {
  return WAVE_CONFIG.name;
}

export function isProviderAvailable(country: 'SN' | 'CI'): boolean {
  return WAVE_CONFIG.countries.includes(country);
}
