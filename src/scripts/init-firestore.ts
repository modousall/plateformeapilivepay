/**
 * Script d'initialisation de Firestore pour LIVEPay
 * 
 * Crée les collections initiales et les données de test
 * 
 * Usage: npx tsx src/scripts/init-firestore.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Configuration Firebase (NOUVEAU PROJET : api-live-pay)
const firebaseConfig = {
  apiKey: "AIzaSyBBXjKwvVNovBFwE92OsThtn0zwCgbmvYI",
  authDomain: "api-live-pay.firebaseapp.com",
  projectId: "api-live-pay",
  storageBucket: "api-live-pay.firebasestorage.app",
  messagingSenderId: "643595999695",
  appId: "1:643595999695:web:4390d63335ce5245c29aba",
  measurementId: "G-ZWNNP3K6FV"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// DONNÉES DE TEST
// ============================================================================

const testMerchants = [
  {
    name: 'Boutique Dakar',
    email: 'contact@boutiquedakar.sn',
    phone: '+221770000000',
    businessType: 'commerce',
    kycStatus: 'verified',
    complianceLevel: 'standard',
    isActive: true,
  },
  {
    name: 'Platform CI',
    email: 'support@platformci.com',
    phone: '+2250700000000',
    businessType: 'platform',
    kycStatus: 'verified',
    complianceLevel: 'enhanced',
    isActive: true,
  },
];

const testTransfers = [
  {
    merchantId: 'MERCHANT_ID_1', // Sera remplacé
    payer: {
      phone: '+221775478575',
      name: 'Moussa Diop',
      email: 'moussa@example.com',
      country: 'SN',
    },
    beneficiary: {
      phone: '+221700000000',
      name: 'Fatou Sarr',
      email: 'fatou@example.com',
      country: 'SN',
    },
    amount: 5000,
    currency: 'XOF',
    provider: 'wave',
    status: 'pending',
    description: 'Remboursement commande #456',
  },
  {
    merchantId: 'MERCHANT_ID_1',
    payer: {
      phone: '+22507547857',
      name: 'Kouamé Jean',
      email: 'kouame@example.ci',
      country: 'CI',
    },
    beneficiary: {
      phone: '+2250500000000',
      name: 'Coulibaly Mariam',
      email: 'mariam@example.ci',
      country: 'CI',
    },
    amount: 10000,
    currency: 'XOF',
    provider: 'orange_money',
    status: 'success',
    description: 'Paiement service',
  },
];

// ============================================================================
// INITIALISATION
// ============================================================================

async function initializeFirestore() {
  console.log('🚀 Initialisation de Firestore pour LIVEPay...\n');

  try {
    // 1. Créer les marchands
    console.log('📦 Création des marchands...');
    const merchantIds: string[] = [];

    for (const merchantData of testMerchants) {
      const merchantsRef = collection(db, 'merchants');
      const docRef = await addDoc(merchantsRef, {
        ...merchantData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      merchantIds.push(docRef.id);
      console.log(`  ✅ Merchant créé : ${docRef.id} - ${merchantData.name}`);
    }

    // 2. Créer les transferts de test
    console.log('\n💸 Création des transferts de test...');
    
    for (let i = 0; i < testTransfers.length; i++) {
      const transferData = testTransfers[i];
      const merchantId = merchantIds[0]; // Utiliser le premier merchant
      
      const cleanPhone = transferData.payer.phone.replace(/^\+/, '');
      const paymentDeepLink = `https://pay.${transferData.provider}.com/m?phone=${cleanPhone}&amount=${transferData.amount}`;
      
      const transfersRef = collection(db, 'transfers');
      const docRef = await addDoc(transfersRef, {
        merchantId,
        payer: transferData.payer,
        beneficiary: transferData.beneficiary,
        amount: transferData.amount,
        currency: transferData.currency,
        provider: transferData.provider,
        status: transferData.status,
        paymentDeepLink,
        deepLinkExpiresAt: Timestamp.fromDate(new Date(Date.now() + 900000)),
        internalReference: `INT-TEST-${i + 1}`,
        feeAmount: Math.round(transferData.amount * 0.02),
        payerDebits: Math.round(transferData.amount * 1.02),
        beneficiaryCredits: transferData.amount,
        description: transferData.description,
        metadata: null,
        idempotencyKey: null,
        paidAt: transferData.status === 'success' ? Timestamp.now() : null,
        completedAt: transferData.status === 'success' ? Timestamp.now() : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✅ Transfert créé : ${docRef.id} - ${transferData.amount} ${transferData.currency}`);
    }

    // 3. Créer un utilisateur super admin
    console.log('\n👤 Création du super admin...');
    const usersRef = collection(db, 'users');
    await addDoc(usersRef, {
      email: 'modousall1@gmail.com',
      displayName: 'Modou SALL',
      role: 'super_admin',
      merchantId: null,
      phone: '+221705000505',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('  ✅ Super admin créé');

    console.log('\n✅ Initialisation terminée avec succès !\n');
    console.log('📊 Résumé:');
    console.log(`  - ${merchantIds.length} marchands créés`);
    console.log(`  - ${testTransfers.length} transferts de test créés`);
    console.log(`  - 1 super admin créé`);
    console.log('\n🔗 Accédez à la console Firebase pour voir les données:');
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Lancer l'initialisation
initializeFirestore();
