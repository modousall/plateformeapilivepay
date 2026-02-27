# 🚀 LIVEPay - Projet Complet

## Statut du Projet

**Version :** 3.0.0 (Firebase + Deep Links)  
**Date :** 27 février 2026  
**Statut :** ✅ **Prêt pour la production**

---

## 📋 Vue d'Ensemble

**LIVEPay** est une plateforme d'initiation de paiements Mobile Money pour la zone UEMOA.

### Modèle : Deep Link Sans Intégration API

LIVEPay génère des **liens de paiement (deep links)** qui redirigent vers les applications Mobile Money des providers.

**Aucune intégration API directe** avec Wave, Orange, MTN, etc.

---

## 🎯 Fonctionnalités Principales

### 1. Transferts par Deep Link ✅

- Génération de liens de paiement vers les apps providers
- Support de 5 providers (Wave, Orange Money, MTN, Moov, Free Money)
- Couverture de 8 pays UEMOA
- Expiration des liens après 15 minutes

### 2. Base de Données Firebase Firestore ✅

- Stockage temps réel des transferts
- Synchronisation automatique
- Règles de sécurité avancées
- Scalabilité automatique

### 3. API REST Complète ✅

- `POST /v1/transfers` - Initier un transfert
- `GET /v1/transfers` - Lister les transferts
- `GET /v1/transfers/:id` - Récupérer un transfert
- `POST /v1/transfers/:id` - Mettre à jour le statut
- `GET /v1/stats` - Statistiques et analytics
- `POST /v1/webhooks` - Recevoir des notifications

### 4. Composants React ✅

- `TransferCard` - Affichage temps réel d'un transfert
- `useTransfer` - Hook React pour Firestore
- Pages de paiement automatiques

### 5. QR Codes et Partage ✅

- Génération de QR codes pour les deep links
- Cartes de paiement HTML
- Partage WhatsApp, SMS, Email
- Reçus de paiement

---

## 🏗️ Architecture Technique

### Stack Technologique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **UI** | Tailwind CSS, shadcn/ui, Radix UI |
| **Backend** | Next.js API Routes |
| **Base de Données** | Firebase Firestore |
| **Auth** | Firebase Authentication (optionnel) |
| **Hosting** | Firebase Hosting / Vercel |

### Structure des Fichiers

```
plateformeapilivepay/
├── src/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── transfers/
│   │   │   │   ├── route.ts           # API transfers
│   │   │   │   └── [id]/route.ts      # API by ID
│   │   │   ├── stats/route.ts         # Statistiques
│   │   │   └── webhooks/route.ts      # Webhooks
│   │   └── pay/[transferId]/route.ts  # Page de paiement
│   ├── components/
│   │   └── transfers/
│   │       └── TransferCard.tsx       # Composant React
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── models.ts              # Types Firestore
│   │   │   └── transfers.ts           # Repository
│   │   ├── api/
│   │   │   └── types.ts               # Types API
│   │   ├── qr-code.ts                 # QR codes
│   │   └── firebase.ts                # Config Firebase
│   └── scripts/
│       └── init-firestore.ts          # Initialisation
├── docs/
│   ├── FIREBASE_SETUP.md              # Guide Firebase
│   ├── FIREBASE_INTEGRATION.md        # Intégration
│   ├── DEEP_LINK_TRANSFERS.md         # Deep links
│   ├── FEATURES.md                    # Fonctionnalités
│   └── PROJECT_SUMMARY.md             # Ce fichier
├── firestore.rules                    # Règles de sécurité
├── .env.local                         # Variables d'env
└── README.md                          # Documentation
```

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner
git clone https://github.com/modousall/plateformeapilivepay.git
cd plateformeapilivepay

# Installer les dépendances
npm install

# Configurer les variables
cp .env.local.example .env.local
```

### 2. Initialiser Firestore

```bash
# Initialiser avec des données de test
npm run firebase:init
```

### 3. Lancer le Serveur

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

### 4. Tester l'API

```bash
# Initier un transfert
curl -X POST http://localhost:3000/api/v1/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "MERCHANT_ID",
    "payer": { "phone": "+221775478575" },
    "beneficiary": { "phone": "+221700000000" },
    "amount": 5000,
    "provider": "wave"
  }'
```

---

## 📊 Providers Supportés

| Provider | Pays | Format Deep Link |
|----------|------|------------------|
| **Wave** | SN, CI | `pay.wave.com/m?phone=xxx&amount=yyy` |
| **Orange Money** | 7 UEMOA | `pay.orange.com/m?msisdn=xxx&amount=yyy` |
| **MTN MoMo** | 5 pays | `pay.mtn.com/m?phone=xxx&amount=yyy` |
| **Moov Money** | 5 pays | `pay.moov.com/m?phone=xxx&amount=yyy` |
| **Free Money** | SN, ML | `pay.freemoney.com/m?phone=xxx&amount=yyy` |

---

## 🔒 Sécurité

### Règles Firestore

- **Lecture** : Authentifié + accès merchant
- **Création** : Authentifié + API key valide
- **Mise à jour** : Champs limités (status, paidAt, completedAt)
- **Suppression** : Super admin uniquement

### Authentification

- API Keys (Publishable & Secret)
- Idempotency-Key pour éviter les doublons
- Signature HMAC pour les webhooks
- Rate limiting (1000 req/min)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [`README.md`](README.md) | Documentation principale |
| [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) | Configuration Firebase |
| [`docs/FIREBASE_INTEGRATION.md`](docs/FIREBASE_INTEGRATION.md) | Intégration Firebase |
| [`docs/DEEP_LINK_TRANSFERS.md`](docs/DEEP_LINK_TRANSFERS.md) | Guide des deep links |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Fonctionnalités avancées |
| [`docs/PROJECT_SUMMARY.md`](docs/PROJECT_SUMMARY.md) | Ce fichier |

---

## 🧪 Données de Test

Après `npm run firebase:init` :

### Marchands Créés

| Nom | Email | Pays |
|-----|-------|------|
| Boutique Dakar | contact@boutiquedakar.sn | SN |
| Platform CI | support@platformci.com | CI |

### Transferts Créés

| Payeur | Bénéficiaire | Montant | Provider | Statut |
|--------|--------------|---------|----------|--------|
| Moussa Diop | Fatou Sarr | 5 000 XOF | Wave | pending |
| Kouamé Jean | Coulibaly Mariam | 10 000 XOF | Orange Money | success |

---

## 🔗 Liens Utiles

### Console Firebase

- **Projet** : https://console.firebase.google.com/project/studio-2004607225-f6a14/overview
- **Firestore** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore
- **Règles** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/rules

### Projet

- **GitHub** : https://github.com/modousall/plateformeapilivepay
- **Site Web** : https://livepay.tech
- **API** : https://api.livepay.tech/v1

---

## 📞 Support

**Équipe LIVEPay**

- **Email** : support@livepay.tech
- **Téléphone** : +221705000505
- **Adresse** : Dakar, Sénégal

---

## 📝 License

Propriétaire - Tous droits réservés LIVEPay © 2024-2026

---

## ✅ Checklist de Production

- [x] Configuration Firebase
- [x] Règles de sécurité Firestore
- [x] API de transferts fonctionnelle
- [x] Composants React temps réel
- [x] Pages de paiement automatiques
- [x] QR codes générés
- [x] Documentation complète
- [x] Données de test
- [ ] Tests unitaires (optionnel)
- [ ] Tests d'intégration (optionnel)
- [ ] Monitoring (optionnel)

---

**Développé avec ❤️ pour les e-commerçants de l'UEMOA**
