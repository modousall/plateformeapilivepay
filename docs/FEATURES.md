# 🚀 LIVEPay - Fonctionnalités Avancées

## Vue d'ensemble

LIVEPay est un **générateur de liens de paiement (deep links)** qui redirigent les utilisateurs vers les applications Mobile Money des providers, avec des fonctionnalités avancées de suivi, QR codes, et pages de paiement.

---

## 📋 Table des Matières

1. [API de Transferts](#api-de-transferts)
2. [Génération de QR Codes](#génération-de-qr-codes)
3. [Page de Paiement](#page-de-paiement)
4. [Statistiques et Analytics](#statistiques-et-analytics)
5. [Webhooks](#webhooks)
6. [Exemples d'Utilisation](#exemples-dutilisation)

---

## 🔗 API de Transferts

### POST /v1/transfers - Initier un transfert

Génère un deep link vers l'application du provider.

```bash
curl -X POST https://api.livepay.tech/v1/transfers \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
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
    "description": "Remboursement"
  }'
```

**Réponse :**

```json
{
  "data": {
    "id": "trans_xxx",
    "payment_deep_link": "https://pay.wave.com/m?phone=221775478575&amount=5000",
    "deep_link_expires_at": "2024-01-15T10:45:00Z",
    "status": "pending"
  },
  "meta": {
    "payment_url": "https://pay.wave.com/m?phone=221775478575&amount=5000",
    "expires_in": 900
  }
}
```

### GET /v1/transfers/:id - Récupérer un transfert

```bash
curl https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx"
```

### POST /v1/transfers/:id - Actions

```bash
# Marquer comme payé
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -d '{"action": "mark_paid"}'

# Marquer comme complété
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -d '{"action": "mark_completed"}'

# Annuler
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -d '{"action": "cancel"}'
```

---

## 📱 Génération de QR Codes

### Utilitaire QR Code

LIVEPay inclut un utilitaire de génération de QR codes pour les deep links.

**Utilisation :**

```typescript
import { generateQRCodeURL, generatePaymentCardHTML } from '@/lib/qr-code';

// Générer l'URL du QR code
const qrCodeURL = generateQRCodeURL('https://pay.wave.com/m?phone=221775478575&amount=5000');
// Retourne: https://api.qrserver.com/v1/create-qr-code/?type=qr&data=...

// Générer une carte de paiement HTML
const htmlCard = generatePaymentCardHTML(
  'https://pay.wave.com/m?phone=221775478575&amount=5000',
  5000,
  'XOF',
  'Paiement commande #123',
  'wave'
);
```

### Fonctions Disponibles

| Fonction | Description |
|----------|-------------|
| `generateQRCodeURL(deepLink, options)` | Génère une URL vers un QR code |
| `generateQRCodeSVG(data, size)` | Génère un QR code SVG inline |
| `generatePaymentReceiptHTML(...)` | Génère un reçu HTML avec QR code |
| `generatePaymentCardHTML(...)` | Génère une carte de paiement HTML |
| `generateWhatsAppShareLink(...)` | Génère un lien de partage WhatsApp |
| `generateSMSShareLink(...)` | Génère un lien de partage SMS |
| `generateEmailShareLink(...)` | Génère un lien de partage email |

### Exemple : Carte de Paiement

```typescript
const cardHTML = generatePaymentCardHTML(
  'https://pay.wave.com/m?phone=221775478575&amount=5000',
  5000,
  'XOF',
  'Paiement commande #123',
  'wave'
);
```

**Rendu :**

```html
<div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px;">
  <div style="display: flex; justify-content: space-between;">
    <span>WAVE</span>
    <span style="color: #1a73e8;">5 000 XOF</span>
  </div>
  <p>Paiement commande #123</p>
  <img src="https://api.qrserver.com/v1/create-qr-code/..." alt="QR Code">
  <a href="https://pay.wave.com/m?...">Payer maintenant</a>
</div>
```

---

## 🌐 Page de Paiement

### Page Intermédiaire

LIVEPay génère automatiquement une page de paiement pour chaque transfert.

**URL :** `https://api.livepay.tech/pay/:transferId`

**Exemple :**
```
https://api.livepay.tech/pay/trans_xxx
```

### Fonctionnalités de la Page

- ✅ Affiche le montant et les détails du transfert
- ✅ QR code scannable pour paiement rapide
- ✅ Bouton de redirection vers l'application provider
- ✅ Compte à rebours d'expiration (15 minutes)
- ✅ Statut en temps réel
- ✅ Bouton de copie du lien
- ✅ Design responsive mobile

### Exemple de Rendu

```
┌─────────────────────────────────┐
│         LIVEPay                 │
│         Wave                    │
├─────────────────────────────────┤
│                                 │
│       5 000 XOF                 │
│     [En attente]                │
│                                 │
│  Référence: INT-XXX-123         │
│  Du: Moussa Diop                │
│  Vers: Fatou Sarr               │
│                                 │
│    ┌─────────────┐              │
│    │   QR CODE   │              │
│    │  ████████   │              │
│    │  ████████   │              │
│    │  ████████   │              │
│    └─────────────┘              │
│  📱 Scannez pour payer          │
│                                 │
│  [🚀 Ouvrir l'application Wave] │
│  [📋 Copier le lien]            │
│                                 │
│  ⏱️ Expire dans 14:32           │
│                                 │
├─────────────────────────────────┤
│  © 2024 LIVEPay - Tous droits   │
│  réservés                       │
└─────────────────────────────────┘
```

---

## 📊 Statistiques et Analytics

### GET /v1/stats - Statistiques Complètes

```bash
curl "https://api.livepay.tech/v1/stats?merchant_id=merch_xxx" \
  -H "Authorization: Bearer live_sk_xxx"
```

**Réponse :**

```json
{
  "data": {
    "overview": {
      "total_transfers": 150,
      "successful_transfers": 142,
      "failed_transfers": 5,
      "pending_transfers": 3,
      "success_rate": 94.67
    },
    "volume": {
      "total_amount": 750000,
      "total_fees": 15000,
      "average_transfer_amount": 5000,
      "currency": "XOF"
    },
    "by_provider": {
      "wave": {
        "count": 80,
        "volume": 400000,
        "success_rate": 96.25,
        "avg_amount": 5000
      },
      "orange_money": {
        "count": 70,
        "volume": 350000,
        "success_rate": 92.86,
        "avg_amount": 5000
      }
    },
    "by_status": {
      "success": { "count": 142, "percentage": 94.67 },
      "pending": { "count": 3, "percentage": 2.0 },
      "failed": { "count": 5, "percentage": 3.33 }
    },
    "daily_breakdown": [
      { "date": "2024-01-15", "transfers": 25, "volume": 125000, "successful": 24 },
      { "date": "2024-01-16", "transfers": 30, "volume": 150000, "successful": 29 }
    ],
    "top_merchants": [
      { "merchant_id": "merch_xxx", "count": 50, "volume": 250000 }
    ]
  },
  "meta": {
    "period": { "start": "all_time", "end": "now" },
    "total_transfers": 150
  }
}
```

### Filtres Disponibles

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `merchant_id` | Filtrer par marchand | `?merchant_id=merch_xxx` |
| `start_date` | Date de début | `?start_date=2024-01-01` |
| `end_date` | Date de fin | `?end_date=2024-01-31` |
| `provider` | Filtrer par provider | `?provider=wave` |

---

## 🔔 Webhooks

### POST /v1/webhooks - Recevoir des Notifications

Les webhooks permettent de recevoir des notifications en temps réel.

**Événements supportés :**

- `payment.success` - Paiement réussi
- `payment.failed` - Paiement échoué
- `payment.pending` - Paiement en attente
- `transfer.completed` - Transfert complété
- `transfer.failed` - Transfert échoué

**Exemple de Payload :**

```json
{
  "event": "payment.success",
  "timestamp": "2024-01-15T10:30:05Z",
  "data": {
    "transfer_id": "trans_xxx",
    "amount": 5000,
    "currency": "XOF",
    "status": "success",
    "provider": "wave"
  }
}
```

### Créer un Webhook (pour les marchands)

```typescript
import { createWebhook } from '@/app/api/v1/webhooks/route';

await createWebhook({
  merchant_id: 'merch_xxx',
  url: 'https://marchand.com/webhooks/livepay',
  events: ['payment.success', 'payment.failed'],
});
```

---

## 💡 Exemples d'Utilisation

### 1. Intégration React/Next.js

```tsx
import { useState } from 'react';

export function PaymentButton({ amount, recipientPhone }: Props) {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  async function initiatePayment() {
    const response = await fetch('/api/v1/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: 'merch_xxx',
        payer: { phone: '+221775478575' },
        beneficiary: { phone: recipientPhone },
        amount: amount,
        provider: 'wave',
      }),
    });

    const data = await response.json();
    
    // Option 1 : Redirection automatique
    window.location.href = data.data.payment_deep_link;
    
    // Option 2 : Afficher la page de paiement
    window.location.href = `/pay/${data.data.id}`;
    
    setPaymentUrl(data.data.payment_deep_link);
  }

  return (
    <div>
      <button onClick={initiatePayment}>
        Payer avec Wave
      </button>
      
      {paymentUrl && (
        <a href={paymentUrl} target="_blank">
          Ouvrir le paiement
        </a>
      )}
    </div>
  );
}
```

### 2. Partage WhatsApp avec QR Code

```typescript
import { generateQRCodeURL, generateWhatsAppShareLink } from '@/lib/qr-code';

function sharePayment(payment: Transfer) {
  const qrCodeURL = generateQRCodeURL(payment.payment_deep_link);
  const whatsappLink = generateWhatsAppShareLink(
    payment.payment_deep_link,
    payment.amount,
    payment.currency
  );
  
  // Afficher le QR code et le bouton WhatsApp
  return `
    <img src="${qrCodeURL}" alt="QR Code" />
    <a href="${whatsappLink}">Partager sur WhatsApp</a>
  `;
}
```

### 3. Email de Paiement avec QR Code

```typescript
import { generatePaymentReceiptHTML } from '@/lib/qr-code';

function sendPaymentEmail(transfer: Transfer, recipientEmail: string) {
  const receiptHTML = generatePaymentReceiptHTML(
    transfer.id,
    transfer.payment_deep_link,
    transfer.amount,
    transfer.currency,
    transfer.payer.name,
    transfer.beneficiary.name,
    transfer.provider
  );
  
  // Envoyer l'email avec le HTML
  sendEmail({
    to: recipientEmail,
    subject: `Paiement de ${transfer.amount} ${transfer.currency}`,
    html: receiptHTML,
  });
}
```

### 4. Dashboard de Suivi

```typescript
async function Dashboard({ merchantId }: Props) {
  const stats = await fetch(`/api/v1/stats?merchant_id=${merchantId}`)
    .then(r => r.json());
  
  return (
    <div>
      <h1>Statistiques</h1>
      
      <div>
        <h2>Vue d'ensemble</h2>
        <p>Total: {stats.data.overview.total_transfers}</p>
        <p>Succès: {stats.data.overview.success_rate}%</p>
        <p>Volume: {stats.data.volume.total_amount} XOF</p>
      </div>
      
      <div>
        <h2>Par Provider</h2>
        {Object.entries(stats.data.by_provider).map(([provider, data]) => (
          <div key={provider}>
            <h3>{provider}</h3>
            <p>Transactions: {data.count}</p>
            <p>Volume: {data.volume} XOF</p>
            <p>Succès: {data.success_rate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📁 Structure des Fichiers

```
src/
├── app/
│   ├── api/v1/
│   │   ├── transfers/
│   │   │   ├── route.ts           # API des transferts
│   │   │   └── [id]/route.ts      # API par ID
│   │   ├── webhooks/route.ts      # Webhooks
│   │   └── stats/route.ts         # Statistiques
│   └── pay/[transferId]/route.ts  # Page de paiement
├── lib/
│   ├── api/
│   │   └── types.ts               # Types TypeScript
│   └── qr-code.ts                 # Utilitaire QR codes
└── docs/
    ├── DEEP_LINK_TRANSFERS.md     # Guide des deep links
    └── FEATURES.md                # Ce fichier
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **API Keys** : Utiliser des clés secrètes pour l'authentification
2. **Idempotency** : Clés uniques pour éviter les doublons
3. **Expiration** : Liens de paiement expirent après 15 minutes
4. **HTTPS** : Toujours utiliser HTTPS en production
5. **Webhooks** : Vérifier les signatures HMAC

---

## 📞 Support

**Équipe LIVEPay**
- Email : support@livepay.tech
- Téléphone : +221705000505

**Documentation**
- [Guide des Deep Links](docs/DEEP_LINK_TRANSFERS.md)
- [README Principal](README.md)

---

**Version :** 2.1.0  
**Date :** 27 février 2026  
**Fonctionnalités :** Deep Links + QR Codes + Pages de Paiement + Stats
