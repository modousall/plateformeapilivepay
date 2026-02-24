export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Transaction {
  id: string;
  customerName: string;
  whatsappNumber: string;
  productDescription: string;
  amount: number;
  status: PaymentStatus;
  waveLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  businessName: string;
  waveAccountNumber: string;
  wavePhone: string;
  b2bId: string;
}