import { PaymentLink } from './types';

export function exportToCSV(links: PaymentLink[], filename: string = 'transactions') {
  const headers = [
    'ID',
    'Nom',
    'Description',
    'Montant (FCFA)',
    'Devise',
    'Moyen de paiement',
    'Statut',
    'Client',
    'Téléphone',
    'Email',
    'Date de création',
    'Date de paiement',
    'Lien de paiement',
  ];

  const rows = links.map((link) => [
    link.id,
    `"${link.name.replace(/"/g, '""')}"`,
    `"${link.description.replace(/"/g, '""')}"`,
    link.amount,
    link.currency,
    link.provider,
    link.status,
    `"${(link.buyerName || '').replace(/"/g, '""')}"`,
    link.buyerPhone || '',
    link.buyerEmail || '',
    link.createdAt.toISOString(),
    link.paidAt?.toISOString() || '',
    link.deepLink,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(links: PaymentLink[], filename: string = 'transactions') {
  const jsonContent = JSON.stringify(links, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateReportSummary(links: PaymentLink[]) {
  const total = links.length;
  const paid = links.filter((l) => l.status === 'paid').length;
  const pending = links.filter((l) => l.status === 'pending').length;
  const expired = links.filter((l) => l.status === 'expired').length;
  const totalVolume = links
    .filter((l) => l.status === 'paid')
    .reduce((sum, l) => sum + l.amount, 0);

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

  return {
    summary: {
      total,
      paid,
      pending,
      expired,
      totalVolume,
      conversionRate: total > 0 ? Math.round((paid / total) * 100) : 0,
      averageTransaction: paid > 0 ? Math.round(totalVolume / paid) : 0,
    },
    byProvider,
    generatedAt: new Date().toISOString(),
  };
}
