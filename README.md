# LIVEPAY - Plateforme d'Agrégation de Paiements Mobile Money & PI-SPI

![LIVEPAY](https://img.shields.io/badge/LIVEPAY-v2.0.0-blue?logo=livepay)
![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-Proprietary-red)
![UEMOA](https://img.shields.io/badge/Region-UEMOA-green)

## 📱 Vue d'ensemble

**LIVEPAY** (`livepay.tech`) est une plateforme professionnelle d'agrégation de paiements Mobile Money et de services PI-SPI (Paiement Instantané – Switch – Interopérabilité) conçue pour la zone UEMOA.

Conforme aux standards des PSP (Payment Service Providers) et aux réglementations BCEAO.

## 🌐 Domaine Officiel

- **Site Web** : https://livepay.tech
- **API** : https://api.livepay.tech/v1
- **Dashboard** : https://dashboard.livepay.tech

## ✨ Fonctionnalités Principales

### 🔐 Gestion des Rôles et Permissions

| Rôle | Permissions | Accès |
|------|-------------|-------|
| **Super Admin** | Tous les accès | Dashboard complet, gestion marchands, analytics globaux |
| **Merchant** | Paiements, liens, analytics | Dashboard marchand uniquement |
| **API User** | Endpoints API limités | Accès API selon permissions |

### 💳 Moyens de Paiement Supportés

- 💙 **Wave** (Sénégal, Côte d'Ivoire)
- 🧡 **Orange Money** (7 pays UEMOA)
- 💛 **MTN Mobile Money** (4 pays)
- 💠 **Moov Money** (5 pays)
- 💜 **Free Money** (Sénégal, Mali)
- 🏦 **PI-SPI** (Système interopérable - 8 pays)

### 🔄 Transferts Directs (Nouveau - Par Deep Link)

**LIVEPay** génère des **liens de paiement (deep links)** qui redirigent vers les applications Mobile Money.

```
LIVEPay → Génération Deep Link → Application Provider (Wave, OM, MTN, etc.)
         (ex: pay.wave.com/m/phone=xxx&amount=yyy)
```

**Principe :** Aucune intégration API directe avec les providers. LIVEPay ne détient jamais les fonds.

**Cas d'usage :**
- ✅ Transfert P2P (Personne à Personne)
- ✅ Paiement marchand par redirection
- ✅ Partage de lien de paiement (SMS, email, WhatsApp)
- ✅ Transfert sans authentification API provider

**Avantages :**
- 🚀 Aucune intégration API complexe
- ⚡ Mise en place immédiate
- 🔒 LIVEPay ne détient jamais les fonds
- 💰 Frais gérés directement par le provider

### 🏗️ Architecture API REST

```
# Marchands
GET    /v1/merchants           - Lister les marchands
POST   /v1/merchants           - Créer un marchand (Onboarding)
GET    /v1/merchants/:id       - Récupérer un marchand
PUT    /v1/merchants/:id       - Mettre à jour un marchand
DELETE /v1/merchants/:id       - Supprimer un marchand

# Paiements
POST   /v1/payments            - Initier un paiement
GET    /v1/payments            - Lister les paiements
GET    /v1/payments/:id        - Récupérer un paiement

# Transferts Directs (NOUVEAU - Par Deep Link)
POST   /v1/transfers           - Initier un transfert (génère un deep link)
GET    /v1/transfers           - Lister les transferts
GET    /v1/transfers/:id       - Récupérer un transfert
POST   /v1/transfers/:id       - Mettre à jour le statut (mark_paid, mark_completed, etc.)

# Payouts & Remboursements
POST   /v1/payouts             - Initier un décaissement
POST   /v1/refunds             - Initier un remboursement

# Liens de Paiement
POST   /v1/payment-links       - Créer un lien de paiement
GET    /v1/payment-links       - Lister les liens
GET    /v1/payment-links/:id   - Récupérer un lien

# Webhooks
POST   /v1/webhooks            - Recevoir un webhook
GET    /v1/webhooks            - Lister les webhooks

# Stats & Analytics
GET    /v1/stats               - Statistiques
```

### 🔒 Sécurité

- ✅ Authentification par API Keys (Publishable & Secret)
- ✅ Idempotency-Key pour les paiements
- ✅ Signature HMAC-SHA256 pour webhooks
- ✅ Rate limiting (1000 req/min)
- ✅ Validation des requêtes
- ✅ Gestion standardisée des erreurs
- ✅ Journalisation complète (audit trail)

### 📊 Modèle de Données

- **Merchant** : onboarding, KYC, compliance, fee structures
- **Payment** : multi-providers, frais, références
- **Wallet** : operational, escrow, settlement
- **Webhook** : événements, signatures, deliveries
- **ApiKey** : permissions, rate limits, rotation

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm ou yarn
- Compte Firebase (déjà configuré)

### Installation

```bash
# Cloner le repository
git clone https://github.com/modousall/plateformeapilivepay.git
cd plateformeapilivepay

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local

# Initialiser Firebase avec des données de test
npm run firebase:init

# Lancer le serveur de développement
npm run dev
```

### Variables d'Environnement

```env
# Application
NEXT_PUBLIC_APP_NAME=LIVEPAY
NEXT_PUBLIC_DOMAIN=livepay.tech
NEXT_PUBLIC_API_URL=https://api.livepay.tech/v1

# Super Admin
SUPER_ADMIN_EMAIL=modousall1@gmail.com
SUPER_ADMIN_PASSWORD=Passer123@

# Firebase (Déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1rCtbDcbV3slNAw4LSgIGxD1yMfNQ6Lo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-2004607225-f6a14.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-2004607225-f6a14
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-2004607225-f6a14.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=869931588586
NEXT_PUBLIC_FIREBASE_APP_ID=1:869931588586:web:138e7aaff905d5fdf37093

# Sécurité
JWT_SECRET=your-secret-key
API_KEY_SALT=your-salt
```

### Accès

- **URL** : http://localhost:3000
- **Super Admin** : modousall1@gmail.com / Passer123@
- **Dashboard** : http://localhost:3000/dashboard

## 📖 Documentation API

### Authentification

```bash
curl -X GET https://api.livepay.tech/v1/payments \
  -H "Authorization: Bearer live_pk_xxx..."
```

### Créer un Paiement

```bash
curl -X POST https://api.livepay.tech/v1/payments \
  -H "Authorization: Bearer live_pk_xxx..." \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-request-id-123" \
  -d '{
    "merchant_id": "merch_xxx",
    "amount": 10000,
    "currency": "XOF",
    "provider": "wave",
    "customer_phone": "+221700000000",
    "description": "Commande #123"
  }'
```

### Webhooks

```json
{
  "event": "payment.success",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "pay_xxx",
    "merchant_id": "merch_xxx",
    "amount": 10000,
    "status": "success",
    "provider": "wave"
  }
}
```

### Initier un Transfert Direct (NOUVEAU - Par Deep Link)

**Génère un lien de paiement vers l'application du provider (ex: Wave).**

```bash
curl -X POST https://api.livepay.tech/v1/transfers \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: transfer-unique-id-123" \
  -d '{
    "merchant_id": "merch_xxx",
    "payer": {
      "phone": "+221775478575",
      "name": "Moussa Diop",
      "email": "moussa@example.com"
    },
    "beneficiary": {
      "phone": "+221700000000",
      "name": "Fatou Sarr",
      "email": "fatou@example.com"
    },
    "amount": 5000,
    "currency": "XOF",
    "provider": "wave",
    "description": "Remboursement commande #456"
  }'
```

**Réponse :**

```json
{
  "data": {
    "id": "trans_xxx",
    "merchant_id": "merch_xxx",
    "payer": {
      "phone": "+221775478575",
      "name": "Moussa Diop"
    },
    "beneficiary": {
      "phone": "+221700000000",
      "name": "Fatou Sarr"
    },
    "amount": 5000,
    "currency": "XOF",
    "provider": "wave",
    "status": "pending",
    "payment_deep_link": "https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123",
    "deep_link_expires_at": "2024-01-15T10:45:00Z",
    "internal_reference": "INT-XXX-123",
    "fee_amount": 100,
    "payer_debits": 5100,
    "beneficiary_credits": 5000,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "payment_url": "https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123",
    "expires_in": 900,
    "instructions": {
      "step1": "Partagez ce lien de paiement au payeur",
      "step2": "Le payeur clique et est redirigé vers l'application Wave",
      "step3": "Le payeur confirme le paiement dans l'application",
      "step4": "Le statut sera mis à jour après confirmation"
    }
  }
}
```

**Utilisation du lien :**

1. **Partagez le lien** au payeur (SMS, email, WhatsApp)
2. **Le payeur clique** → Ouvre l'application Wave
3. **Le payeur confirme** le paiement dans l'application
4. **Le statut est mis à jour** (via webhook ou manuellement)

**Exemple de lien à partager :**

```
🔗 Paiement de 5000 FCFA :
https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123
```

### Mise à jour du Statut d'un Transfert

**Marquer comme payé :**

```bash
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "mark_paid"}'
```

**Marquer comme complété :**

```bash
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "mark_completed"}'
```

**Annuler un transfert :**

```bash
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "cancel"}'
```

## 🏢 Couverture Géographique

LIVEPAY couvre les 8 pays de l'UEMOA :

- 🇸🇳 Sénégal (SN)
- 🇨🇮 Côte d'Ivoire (CI)
- 🇲🇱 Mali (ML)
- 🇧🇫 Burkina Faso (BF)
- 🇳🇪 Niger (NE)
- 🇹🇬 Togo (TG)
- 🇧🇯 Bénin (BJ)
- 🇬🇼 Guinée-Bissau (GW)

## 👥 Équipe

**Super Administrateur**
- Mr Modou SALL
- Email: modousall1@gmail.com
- Téléphone: +221705000505

**Support**
- Email: support@livepay.tech
- Téléphone: +221705000505

## 📄 Conformité

- ✅ Réglementation BCEAO
- ✅ DSP2-like (Open Banking)
- ✅ AML-CFT (Anti-Money Laundering)
- ✅ KYC (Know Your Customer)
- ✅ PCI DSS (Payment Card Industry)

## 🛠️ Stack Technique

- **Frontend** : Next.js 15, React 19, TypeScript
- **UI** : Tailwind CSS, shadcn/ui, Radix UI
- **API** : Next.js API Routes, REST
- **Base de données** : PostgreSQL (recommandé)
- **Cache** : Redis (recommandé)
- **Queue** : Bull/Redis

## 📊 Monitoring

- Analytics temps réel
- Taux de succès par provider
- Volume de transactions
- Alertes AML (plafonds, fréquence)

## 🤝 Contributing

Les contributions sont les bienvenues. Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.

## 📝 License

Propriétaire - Tous droits réservés LIVEPAY © 2024

## 🔗 Liens Utiles

- **Site Web** : https://livepay.tech
- **Documentation API** : https://docs.livepay.tech
- **Status** : https://status.livepay.tech
- **Support** : https://support.livepay.tech

## 🚀 Déploiement & Infrastructure

### Firebase App Hosting

- **Backend** : `plateformeapilivepay`
- **Projet** : `api-live-pay`
- **URL Actuelle** : https://plateformeapilivepay--api-live-pay.us-central1.hosted.app
- **Console Firebase** : https://console.firebase.google.com/project/api-live-pay/apphosting

### Domaine Personnalisé

**Statut :** ⏳ Configuration en cours

Pour configurer `livepay.tech` comme domaine personnalisé, consultez :
- 📄 [Guide Complet](CUSTOM_DOMAIN_SETUP.md)
- ⚡ [Guide Rapide](QUICK_DOMAIN_SETUP.md)

**URLs de Production (après configuration) :**
- **Site Web** : https://livepay.tech
- **API** : https://livepay.tech/api/v1
- **Dashboard** : https://livepay.tech/dashboard

---

**Développé avec ❤️ pour les e-commerçants de l'UEMOA**
