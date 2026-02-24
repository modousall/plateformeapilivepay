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

### 🏗️ Architecture API REST

```
GET    /v1/merchants           - Lister les marchands
POST   /v1/merchants           - Créer un marchand (Onboarding)
GET    /v1/merchants/:id       - Récupérer un marchand
PUT    /v1/merchants/:id       - Mettre à jour un marchand
DELETE /v1/merchants/:id       - Supprimer un marchand

POST   /v1/payments            - Initier un paiement
GET    /v1/payments            - Lister les paiements
GET    /v1/payments/:id        - Récupérer un paiement
POST   /v1/payouts             - Initier un décaissement
POST   /v1/refunds             - Initier un remboursement

POST   /v1/payment-links       - Créer un lien de paiement
GET    /v1/payment-links       - Lister les liens
GET    /v1/payment-links/:id   - Récupérer un lien

POST   /v1/webhooks            - Recevoir un webhook
GET    /v1/webhooks            - Lister les webhooks

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
- Base de données (PostgreSQL recommandé)

### Installation

```bash
# Cloner le repository
git clone https://github.com/modousall/plateformeapilivepay.git
cd plateformeapilivepay

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

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

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/livepay

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

---

**Développé avec ❤️ pour les e-commerçants de l'UEMOA**
