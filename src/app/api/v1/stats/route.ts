/**
 * LIVEPAY API v1 - Statistiques et Analytics
 * Endpoints: GET /v1/stats
 * 
 * Fournit des statistiques sur les transferts :
 * - Volume total
 * - Nombre de transactions
 * - Taux de succès
 * - Statistiques par provider
 * - Évolution temporelle
 * 
 * Utilise Firebase Firestore
 */

import { NextRequest } from 'next/server';
import { generateId } from '@/lib/api/utils';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/models';

// GET /api/v1/stats - Récupérer les statistiques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtres
    const merchantId = searchParams.get('merchant_id') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const provider = searchParams.get('provider') || undefined;

    // Récupération depuis Firestore
    const transfersRef = collection(db, COLLECTIONS.TRANSFERS);
    let q = query(transfersRef);

    if (merchantId) {
      q = query(transfersRef, where('merchantId', '==', merchantId));
    }

    const snapshot = await getDocs(q);
    const transfers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtrage additionnel (côté client pour les dates et provider)
    let filteredTransfers = transfers;

    if (startDate) {
      const start = new Date(startDate);
      filteredTransfers = filteredTransfers.filter(t => 
        t.createdAt?.toDate() >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredTransfers = filteredTransfers.filter(t => 
        t.createdAt?.toDate() <= end
      );
    }

    if (provider) {
      filteredTransfers = filteredTransfers.filter(t => t.provider === provider);
    }

    // Calcul des statistiques
    const stats = calculateStats(filteredTransfers);

    return Response.json({
      data: stats,
      meta: {
        period: {
          start: startDate || 'all_time',
          end: endDate || 'now',
        },
        filters: {
          merchant_id: merchantId,
          provider: provider,
        },
        total_transfers: filteredTransfers.length,
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return Response.json({
      error: {
        error_code: 'internal-error',
        error_message: 'Erreur lors de la récupération des statistiques',
        error_type: 'internal_error',
        request_id: generateId('req'),
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}

// ============================================================================
// CALCUL DES STATISTIQUES
// ============================================================================

interface TransferStats {
  overview: {
    total_transfers: number;
    successful_transfers: number;
    failed_transfers: number;
    pending_transfers: number;
    success_rate: number;
  };
  volume: {
    total_amount: number;
    total_fees: number;
    average_transfer_amount: number;
    currency: string;
  };
  by_provider: Record<string, {
    count: number;
    volume: number;
    success_rate: number;
    avg_amount: number;
  }>;
  by_status: Record<string, {
    count: number;
    percentage: number;
  }>;
  daily_breakdown: {
    date: string;
    transfers: number;
    volume: number;
    successful: number;
  }[];
  top_merchants: {
    merchant_id: string;
    count: number;
    volume: number;
  }[];
}

function calculateStats(transfers: any[]): TransferStats {
  const now = new Date();
  const currency = transfers.length > 0 ? transfers[0].currency : 'XOF';

  // Overview
  const totalTransfers = transfers.length;
  const successfulTransfers = transfers.filter(t => t.status === 'success').length;
  const failedTransfers = transfers.filter(t => ['failed', 'reversed'].includes(t.status)).length;
  const pendingTransfers = transfers.filter(t => ['pending', 'processing', 'debited'].includes(t.status)).length;
  const successRate = totalTransfers > 0 ? (successfulTransfers / totalTransfers) * 100 : 0;

  // Volume
  const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = transfers.reduce((sum, t) => sum + (t.fee_amount || 0), 0);
  const averageTransferAmount = totalTransfers > 0 ? totalAmount / totalTransfers : 0;

  // Par provider
  const byProvider: Record<string, any> = {};
  const providers = [...new Set(transfers.map(t => t.provider))];
  
  providers.forEach(provider => {
    const providerTransfers = transfers.filter(t => t.provider === provider);
    const providerSuccessful = providerTransfers.filter(t => t.status === 'success').length;
    const providerCount = providerTransfers.length;
    const providerVolume = providerTransfers.reduce((sum, t) => sum + t.amount, 0);
    
    byProvider[provider] = {
      count: providerCount,
      volume: providerVolume,
      success_rate: providerCount > 0 ? (providerSuccessful / providerCount) * 100 : 0,
      avg_amount: providerCount > 0 ? providerVolume / providerCount : 0,
    };
  });

  // Par statut
  const byStatus: Record<string, any> = {};
  const statuses = [...new Set(transfers.map(t => t.status))];
  
  statuses.forEach(status => {
    const statusCount = transfers.filter(t => t.status === status).length;
    byStatus[status] = {
      count: statusCount,
      percentage: totalTransfers > 0 ? (statusCount / totalTransfers) * 100 : 0,
    };
  });

  // Évolution quotidienne (7 derniers jours)
  const dailyBreakdown = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayStart = new Date(dateStr);
    const dayEnd = new Date(dateStr);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayTransfers = transfers.filter(t => {
      const tDate = new Date(t.created_at);
      return tDate >= dayStart && tDate <= dayEnd;
    });
    
    dailyBreakdown.push({
      date: dateStr,
      transfers: dayTransfers.length,
      volume: dayTransfers.reduce((sum, t) => sum + t.amount, 0),
      successful: dayTransfers.filter(t => t.status === 'success').length,
    });
  }

  // Top marchands
  const merchantStats: Record<string, { count: number; volume: number }> = {};
  transfers.forEach(t => {
    if (!merchantStats[t.merchant_id]) {
      merchantStats[t.merchant_id] = { count: 0, volume: 0 };
    }
    merchantStats[t.merchant_id].count++;
    merchantStats[t.merchant_id].volume += t.amount;
  });

  const topMerchants = Object.entries(merchantStats)
    .map(([merchant_id, stats]) => ({
      merchant_id,
      ...stats,
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  return {
    overview: {
      total_transfers: totalTransfers,
      successful_transfers: successfulTransfers,
      failed_transfers: failedTransfers,
      pending_transfers: pendingTransfers,
      success_rate: Math.round(successRate * 100) / 100,
    },
    volume: {
      total_amount: Math.round(totalAmount),
      total_fees: Math.round(totalFees),
      average_transfer_amount: Math.round(averageTransferAmount),
      currency,
    },
    by_provider: byProvider,
    by_status: byStatus,
    daily_breakdown: dailyBreakdown,
    top_merchants: topMerchants,
  };
}
