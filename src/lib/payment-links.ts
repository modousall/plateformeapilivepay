'use client';

import { PaymentLink, CreatePaymentLinkInput } from './types';
import { generateDeepLink, generateReference, MERCHANT_CONFIG } from './config';

const STORAGE_KEY = 'livepay_payment_links';

export function createPaymentLink(input: CreatePaymentLinkInput): PaymentLink {
  const reference = generateReference();
  const deepLink = generateDeepLink(
    input.provider,
    MERCHANT_CONFIG.b2bIdentifier,
    input.amount,
    reference,
    input.buyerPhone
  );

  const expiresAt = input.expiresInSeconds
    ? new Date(Date.now() + input.expiresInSeconds * 1000)
    : undefined;

  const paymentLink: PaymentLink = {
    id: `link_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
    name: input.name,
    amount: input.amount,
    currency: 'FCFA',
    description: input.description,
    provider: input.provider,
    buyerPhone: input.buyerPhone,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    deepLink,
    status: 'pending',
    createdAt: new Date(),
    expiresAt,
    metadata: input.metadata,
  };

  savePaymentLink(paymentLink);
  return paymentLink;
}

export function savePaymentLink(link: PaymentLink): void {
  const links = getPaymentLinks();
  links.push(link);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function getPaymentLinks(): PaymentLink[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    return parsed.map((l: PaymentLink & { createdAt: string; expiresAt?: string; paidAt?: string }) => ({
      ...l,
      createdAt: new Date(l.createdAt),
      expiresAt: l.expiresAt ? new Date(l.expiresAt) : undefined,
      paidAt: l.paidAt ? new Date(l.paidAt) : undefined,
    }));
  } catch {
    return [];
  }
}

export function getPaymentLinkById(id: string): PaymentLink | undefined {
  const links = getPaymentLinks();
  return links.find(l => l.id === id);
}

export function updatePaymentLink(id: string, updates: Partial<PaymentLink>): void {
  const links = getPaymentLinks();
  const index = links.findIndex(l => l.id === id);

  if (index === -1) return;

  links[index] = {
    ...links[index],
    ...updates,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function deletePaymentLink(id: string): void {
  const links = getPaymentLinks();
  const filtered = links.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function markAsPaid(id: string, paymentMethod?: string, transactionId?: string): void {
  updatePaymentLink(id, {
    status: 'paid',
    paidAt: new Date(),
    paymentMethod,
    transactionId,
  });
}

export function getStats() {
  const links = getPaymentLinks();
  const total = links.length;
  const paid = links.filter(l => l.status === 'paid').length;
  const pending = links.filter(l => l.status === 'pending').length;
  const totalVolume = links
    .filter(l => l.status === 'paid')
    .reduce((sum, l) => sum + l.amount, 0);

  // Stats par fournisseur
  const byProvider = links.reduce((acc, link) => {
    if (!acc[link.provider]) {
      acc[link.provider] = { total: 0, paid: 0, volume: 0 };
    }
    acc[link.provider].total++;
    if (link.status === 'paid') {
      acc[link.provider].paid++;
      acc[link.provider].volume += link.amount;
    }
    return acc;
  }, {} as Record<string, { total: number; paid: number; volume: number }>);

  return { total, paid, pending, totalVolume, byProvider };
}
