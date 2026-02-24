import { Transaction, Merchant } from '@/lib/types';

export const CURRENT_MERCHANT: Merchant = {
  id: 'm_1',
  businessName: 'Global Market SN',
  waveAccountNumber: 'SN 38 26 08 81',
  wavePhone: '+221705000505',
  b2bId: 'M_sn_7kcELqHS_AKN',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr_1',
    customerName: 'Awa Diop',
    whatsappNumber: '+221771234567',
    productDescription: 'Robe en soie - Taille M',
    amount: 15000,
    status: 'paid',
    waveLink: 'https://pay.wave.com/m/M_sn_7kcELqHS_AKN/15000/Robe-soie',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
  },
  {
    id: 'tr_2',
    customerName: 'Moussa Gueye',
    whatsappNumber: '+221778901234',
    productDescription: 'Chaussures sportives',
    amount: 25000,
    status: 'pending',
    waveLink: 'https://pay.wave.com/m/M_sn_7kcELqHS_AKN/25000/Chaussures',
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(Date.now() - 3600000 * 5),
  },
];