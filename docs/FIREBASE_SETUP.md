# 🚀 LIVEPay - Intégration Firebase

## Vue d'ensemble

LIVEPay utilise **Firebase Firestore** comme base de données principale pour stocker les transferts, marchands, webhooks, et autres données.

---

## 📋 Table des Matières

1. [Configuration](#configuration)
2. [Structure des Données](#structure-des-données)
3. [Initialisation](#initialisation)
4. [Utilisation](#utilisation)
5. [Règles de Sécurité](#règles-de-sécurité)

---

## 🔧 Configuration

### 1. Variables d'Environnement

Copiez `.env.local.example` vers `.env.local` :

```bash
cp .env.local.example .env.local
```

Les variables Firebase sont déjà configurées :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1rCtbDcbV3slNAw4LSgIGxD1yMfNQ6Lo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-2004607225-f6a14.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-2004607225-f6a14
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-2004607225-f6a14.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=869931588586
NEXT_PUBLIC_FIREBASE_APP_ID=1:869931588586:web:138e7aaff905d5fdf37093
```

### 2. Installation des Dépendances

Firebase est déjà installé dans `package.json` :

```json
{
  "dependencies": {
    "firebase": "^11.9.1"
  }
}
```

---

## 📊 Structure des Données

### Collections Firestore

| Collection | Description | Documents |
|------------|-------------|-----------|
| `transfers` | Transferts de paiement | Transfer |
| `merchants` | Marchands | Merchant |
| `users` | Utilisateurs | User |
| `webhooks` | Webhooks configurés | Webhook |
| `webhook_logs` | Logs des webhooks | WebhookLog |
| `api_keys` | Clés API | ApiKey |
| `stats_aggregates` | Statistiques agrégées | MerchantStatsAggregate |

### Schéma Transfer

```typescript
interface Transfer {
  id: string;
  merchantId: string;
  
  // Parties
  payer: {
    phone: string;
    name?: string;
    email?: string;
    country?: 'SN' | 'CI' | 'ML' | 'BF' | 'NE' | 'TG' | 'BJ' | 'GW';
  };
  
  beneficiary: {
    phone: string;
    name?: string;
    email?: string;
    country?: 'SN' | 'CI' | 'ML' | 'BF' | 'NE' | 'TG' | 'BJ' | 'GW';
  };
  
  // Détails
  amount: number;
  currency: 'XOF' | 'XAF' | 'GMD' | 'GNF';
  provider: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money' | 'free_money';
  status: 'pending' | 'processing' | 'debited' | 'credited' | 'success' | 'failed' | 'reversed' | 'expired';
  
  // Deep Link
  paymentDeepLink: string;
  deepLinkExpiresAt: Timestamp;
  
  // Références
  internalReference: string;
  
  // Frais
  feeAmount: number;
  payerDebits: number;
  beneficiaryCredits: number;
  
  // Timestamps
  paidAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 🎯 Initialisation

### Initialiser Firestore avec des données de test

```bash
npm run firebase:init
```

Ce script crée :
- ✅ 2 marchands de test
- ✅ 2 transferts de test
- ✅ 1 utilisateur super admin

### Console Firebase

Après l'initialisation, consultez vos données :

```
https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore
```

---

## 💻 Utilisation

### Importer les modules Firebase

```typescript
// Configuration Firebase
import { db, auth, functions } from '@/lib/firebase';

// Modèles de données
import { Transfer, Merchant, User } from '@/lib/firebase/models';

// Repository Transferts
import {
  createTransfer,
  getTransferById,
  listTransfers,
  markTransferAsPaid,
  markTransferAsCompleted,
} from '@/lib/firebase/transfers';
```

### Créer un Transfert

```typescript
import { createTransfer } from '@/lib/firebase/transfers';

const transfer = await createTransfer({
  merchantId: 'merch_xxx',
  payer: {
    phone: '+221775478575',
    name: 'Moussa Diop',
    country: 'SN',
  },
  beneficiary: {
    phone: '+221700000000',
    name: 'Fatou Sarr',
    country: 'SN',
  },
  amount: 5000,
  currency: 'XOF',
  provider: 'wave',
  description: 'Remboursement commande #456',
});

console.log('Transfert créé:', transfer.id);
console.log('Deep Link:', transfer.paymentDeepLink);
```

### Récupérer un Transfert

```typescript
import { getTransferById } from '@/lib/firebase/transfers';

const transfer = await getTransferById('trans_xxx');

if (transfer) {
  console.log('Statut:', transfer.status);
  console.log('Montant:', transfer.amount);
}
```

### Lister les Transferts

```typescript
import { listTransfers } from '@/lib/firebase/transfers';

const result = await listTransfers({
  merchantId: 'merch_xxx',
  status: 'success',
  limit: 20,
});

console.log('Transferts:', result.transfers);
console.log('Page suivante disponible:', result.hasMore);
```

### Mettre à jour le Statut

```typescript
import { 
  markTransferAsPaid, 
  markTransferAsCompleted 
} from '@/lib/firebase/transfers';

// Marquer comme payé
await markTransferAsPaid('trans_xxx');

// Marquer comme complété
await markTransferAsCompleted('trans_xxx');
```

---

## 🔒 Règles de Sécurité

### Déployer les règles

```bash
firebase deploy --only firestore:rules
```

### Règles Principales

**Transferts :**
- Lecture : Authentifié + accès merchant
- Création : Authentifié + API key valide
- Mise à jour : Champs limités (status, paidAt, completedAt)
- Suppression : Super admin uniquement

**Merchants :**
- Lecture : Propriétaire ou super admin
- Écriture : Propriétaire ou super admin

**Webhooks :**
- Lecture/Écriture : Authentifié + accès merchant

### Fichier de Règles

Les règles sont définies dans `firestore.rules` :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transfers/{transferId} {
      allow read: if isAuthenticated() && 
                     hasMerchantAccess(resource.data.merchantId);
      allow create: if isAuthenticated() && 
                       isValidApiKey();
      // ...
    }
  }
}
```

---

## 📊 Indexes Firestore

### Indexes Requis

Créez ces indexes dans la console Firebase :

**Collection : transfers**

| Champ 1 | Champ 2 | Champ 3 |
|---------|---------|---------|
| merchantId (ASC) | createdAt (DESC) | - |
| merchantId (ASC) | status (ASC) | createdAt (DESC) |
| merchantId (ASC) | provider (ASC) | createdAt (DESC) |
| status (ASC) | createdAt (DESC) | - |

### URL de Création d'Index

```
https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/indexes
```

---

## 🧪 Données de Test

### Marchands Créés

| Nom | Email | Pays | Business Type |
|-----|-------|------|---------------|
| Boutique Dakar | contact@boutiquedakar.sn | SN | commerce |
| Platform CI | support@platformci.com | CI | platform |

### Transferts Créés

| Payeur | Bénéficiaire | Montant | Provider | Statut |
|--------|--------------|---------|----------|--------|
| Moussa Diop | Fatou Sarr | 5 000 XOF | Wave | pending |
| Kouamé Jean | Coulibaly Mariam | 10 000 XOF | Orange Money | success |

---

## 🔗 Liens Utiles

### Console Firebase

- **Dashboard** : https://console.firebase.google.com/project/studio-2004607225-f6a14/overview
- **Firestore** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore
- **Authentication** : https://console.firebase.google.com/project/studio-2004607225-f6a14/authentication
- **Rules** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/rules
- **Indexes** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/indexes

### Documentation Officielle

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## 📞 Support

**Équipe LIVEPay**
- Email : support@livepay.tech
- Téléphone : +221705000505

---

**Version :** 3.0.0 (Firebase)  
**Date :** 27 février 2026  
**Projet Firebase :** studio-2004607225-f6a14
