/**
 * Repository Firestore pour les transferts
 * 
 * Opérations CRUD sur la collection transfers
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Transfer,
  TransferCreateInput,
  TransferStatus,
  TransferParty,
  COLLECTIONS,
} from './models';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convertit un document Firestore en objet Transfer
 */
function transferFromDoc(doc: QueryDocumentSnapshot): Transfer & { id: string } {
  const data = doc.data();
  return {
    id: doc.id,
    merchantId: data.merchantId,
    payer: data.payer as TransferParty,
    beneficiary: data.beneficiary as TransferParty,
    amount: data.amount,
    currency: data.currency,
    provider: data.provider,
    status: data.status,
    paymentDeepLink: data.paymentDeepLink,
    deepLinkExpiresAt: data.deepLinkExpiresAt,
    internalReference: data.internalReference,
    feeAmount: data.feeAmount,
    payerDebits: data.payerDebits,
    beneficiaryCredits: data.beneficiaryCredits,
    description: data.description,
    metadata: data.metadata,
    idempotencyKey: data.idempotencyKey,
    paidAt: data.paidAt,
    completedAt: data.completedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// ============================================================================
// CRÉATION
// ============================================================================

/**
 * Crée un nouveau transfert dans Firestore
 */
export async function createTransfer(
  input: TransferCreateInput
): Promise<Transfer & { id: string }> {
  const now = Timestamp.now();
  const transfersRef = collection(db, COLLECTIONS.TRANSFERS);

  const transferData: Omit<Transfer, 'id'> = {
    merchantId: input.merchantId,
    payer: input.payer,
    beneficiary: input.beneficiary,
    amount: input.amount,
    currency: input.currency || 'XOF',
    provider: input.provider,
    status: 'pending',
    paymentDeepLink: generateDeepLink(input.payer.phone, input.amount),
    deepLinkExpiresAt: Timestamp.fromDate(new Date(Date.now() + 900000)),
    internalReference: generateReference('INT'),
    feeAmount: Math.round(input.amount * 0.02),
    payerDebits: Math.round(input.amount * 1.02),
    beneficiaryCredits: input.amount,
    description: input.description || null,
    metadata: input.metadata || null,
    idempotencyKey: input.idempotencyKey || null,
    paidAt: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(transfersRef, transferData);

  return {
    id: docRef.id,
    ...transferData,
  };
}

// ============================================================================
// LECTURE
// ============================================================================

/**
 * Récupère un transfert par son ID
 */
export async function getTransferById(
  id: string
): Promise<(Transfer & { id: string }) | null> {
  const transferRef = doc(db, COLLECTIONS.TRANSFERS, id);
  const transferDoc = await getDoc(transferRef);

  if (!transferDoc.exists()) {
    return null;
  }

  return transferFromDoc(transferDoc);
}

/**
 * Récupère un transfert par sa clé d'idempotence
 */
export async function getTransferByIdempotencyKey(
  idempotencyKey: string
): Promise<(Transfer & { id: string }) | null> {
  const transfersRef = collection(db, COLLECTIONS.TRANSFERS);
  const q = query(
    transfersRef,
    where('idempotencyKey', '==', idempotencyKey),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return transferFromDoc(snapshot.docs[0]);
}

/**
 * Liste les transferts avec pagination et filtres
 */
export async function listTransfers(options?: {
  merchantId?: string;
  status?: TransferStatus;
  provider?: string;
  startDate?: Date;
  endDate?: Date;
  payerPhone?: string;
  beneficiaryPhone?: string;
  limit?: number;
  startAfterDoc?: QueryDocumentSnapshot;
}): Promise<{
  transfers: (Transfer & { id: string })[];
  lastVisible: QueryDocumentSnapshot | null;
  hasMore: boolean;
}> {
  const transfersRef = collection(db, COLLECTIONS.TRANSFERS);
  const constraints: QueryConstraint[] = [];

  // Filtres
  if (options?.merchantId) {
    constraints.push(where('merchantId', '==', options.merchantId));
  }

  if (options?.status) {
    constraints.push(where('status', '==', options.status));
  }

  if (options?.provider) {
    constraints.push(where('provider', '==', options.provider));
  }

  if (options?.startDate) {
    constraints.push(where('createdAt', '>=', Timestamp.fromDate(options.startDate)));
  }

  if (options?.endDate) {
    constraints.push(where('createdAt', '<=', Timestamp.fromDate(options.endDate)));
  }

  // Tri et pagination
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(options?.limit || 20));

  if (options?.startAfterDoc) {
    constraints.push(startAfter(options.startAfterDoc));
  }

  const q = query(transfersRef, ...constraints);
  const snapshot = await getDocs(q);

  const transfers = snapshot.docs.map(doc => transferFromDoc(doc));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  const hasMore = snapshot.docs.length === (options?.limit || 20);

  return {
    transfers,
    lastVisible,
    hasMore,
  };
}

// ============================================================================
// MISE À JOUR
// ============================================================================

/**
 * Met à jour le statut d'un transfert
 */
export async function updateTransferStatus(
  id: string,
  status: TransferStatus,
  updates?: Partial<Transfer>
): Promise<void> {
  const transferRef = doc(db, COLLECTIONS.TRANSFERS, id);
  
  const updateData: any = {
    status,
    updatedAt: Timestamp.now(),
    ...updates,
  };

  // Convertir les timestamps
  if (updates?.paidAt instanceof Date) {
    updateData.paidAt = Timestamp.fromDate(updates.paidAt);
  }
  if (updates?.completedAt instanceof Date) {
    updateData.completedAt = Timestamp.fromDate(updates.completedAt);
  }

  await updateDoc(transferRef, updateData);
}

/**
 * Marque un transfert comme payé
 */
export async function markTransferAsPaid(id: string): Promise<void> {
  await updateTransferStatus(id, 'debited', {
    paidAt: new Date(),
  });
}

/**
 * Marque un transfert comme complété
 */
export async function markTransferAsCompleted(id: string): Promise<void> {
  await updateTransferStatus(id, 'success', {
    completedAt: new Date(),
  });
}

/**
 * Marque un transfert comme échoué
 */
export async function markTransferAsFailed(
  id: string,
  errorCode?: string,
  errorMessage?: string
): Promise<void> {
  const transferRef = doc(db, COLLECTIONS.TRANSFERS, id);
  
  await updateDoc(transferRef, {
    status: 'failed',
    errorCode: errorCode || null,
    errorMessage: errorMessage || null,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Annule un transfert (seulement si pending)
 */
export async function cancelTransfer(id: string): Promise<void> {
  const transfer = await getTransferById(id);
  
  if (!transfer) {
    throw new Error('Transfer not found');
  }

  if (transfer.status !== 'pending') {
    throw new Error('Only pending transfers can be cancelled');
  }

  await updateTransferStatus(id, 'expired');
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Génère un deep link Wave
 */
function generateDeepLink(phone: string, amount: number): string {
  const cleanPhone = phone.replace(/^\+/, '');
  const params = new URLSearchParams();
  params.set('phone', cleanPhone);
  params.set('amount', amount.toString());
  params.set('reference', generateReference('PAY'));
  
  return `https://pay.wave.com/m?${params.toString()}`;
}

/**
 * Génère une référence unique
 */
function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}-${timestamp}`;
}

/**
 * Compte le nombre de transferts pour un merchant
 */
export async function countTransfers(merchantId: string): Promise<number> {
  const transfersRef = collection(db, COLLECTIONS.TRANSFERS);
  const q = query(
    transfersRef,
    where('merchantId', '==', merchantId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.size;
}
