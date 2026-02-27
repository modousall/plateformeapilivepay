# 🚀 LIVEPay - Transferts par Deep Link (Sans Intégration API)

## Vue d'ensemble

**LIVEPay** est un **initiateur de paiement par redirection** qui génère des liens de paiement (deep links) vers les applications Mobile Money des providers.

### Principe Fondamental

**Aucune intégration API directe** avec les providers (Wave, Orange, MTN, etc.).

LIVEPay génère simplement des URL de redirection qui ouvrent l'application du provider pour effectuer le paiement.

---

## 🔄 Flux de Paiement

```
┌─────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   PAYEUR    │         │       LIVEPAY        │         │   APPLICATION   │
│             │         │                      │         │    PROVIDER     │
│             │         │  (Génération lien)   │         │   (Wave, OM,    │
│             │         │                      │         │    MTN, etc.)   │
└──────┬──────┘         └──────────┬───────────┘         └───────┬─────────┘
       │                           │                              │
       │  1. Demande de transfert  │                              │
       │──────────────────────────>│                              │
       │                           │                              │
       │                           │  2. Génération deep link     │
       │                           │     (ex: pay.wave.com/m/...) │
       │                           │                              │
       │  3. Retour du lien        │                              │
       │<──────────────────────────│                              │
       │                           │                              │
       │  4. Clique sur le lien    │                              │
       │─────────────────────────────────────────────────────────>│
       │                           │                              │
       │                           │                              │  5. Ouverture app
       │                           │                              │  6. Confirmation paiement
       │                           │                              │
       │  7. Paiement confirmé     │                              │
       │<─────────────────────────────────────────────────────────│
       │                           │                              │
       │                           │  8. Webhook (optionnel)      │
       │                           │<─────────────────────────────│
       │                           │                              │
```

---

## 📋 API de Transfert

### POST /v1/transfers - Initier un transfert

**Requête :**

```bash
curl -X POST https://api.livepay.tech/v1/transfers \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-transfer-id-123" \
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
    "internal_reference": "INT-XXX-456",
    "fee_amount": 100,
    "payer_debits": 5100,
    "beneficiary_credits": 5000,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "payment_url": "https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123",
    "expires_in": 900,
    "instructions": {
      "step1": "Partagez ce lien de paiement au payeur",
      "step2": "Le payeur clique sur le lien et est redirigé vers l'application",
      "step3": "Le payeur confirme le paiement dans l'application",
      "step4": "Le statut sera mis à jour après confirmation"
    },
    "provider_info": {
      "name": "Wave",
      "fee_notice": "Les frais affichés dans l'application sont ceux du provider"
    }
  }
}
```

### GET /v1/transfers - Lister les transferts

```bash
curl "https://api.livepay.tech/v1/transfers?merchant_id=merch_xxx&status=pending" \
  -H "Authorization: Bearer live_sk_xxx"
```

### GET /v1/transfers/:id - Récupérer un transfert

```bash
curl "https://api.livepay.tech/v1/transfers/trans_xxx" \
  -H "Authorization: Bearer live_sk_xxx"
```

### POST /v1/transfers/:id - Actions

**Marquer comme payé :**
```bash
curl -X POST "https://api.livepay.tech/v1/transfers/trans_xxx" \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "mark_paid"}'
```

**Marquer comme complété :**
```bash
curl -X POST "https://api.livepay.tech/v1/transfers/trans_xxx" \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "mark_completed"}'
```

**Marquer comme échoué :**
```bash
curl -X POST "https://api.livepay.tech/v1/transfers/trans_xxx" \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "mark_failed",
    "error_code": "payment_cancelled",
    "error_message": "L'utilisateur a annulé le paiement"
  }'
```

**Annuler un transfert :**
```bash
curl -X POST "https://api.livepay.tech/v1/transfers/trans_xxx" \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"action": "cancel"}'
```

---

## 🔗 Deep Links par Provider

### Wave (Sénégal, Côte d'Ivoire)

**Format :**
```
https://pay.wave.com/m?phone={PHONE}&amount={AMOUNT}&reference={REFERENCE}
```

**Exemple :**
```
https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-123
```

**Paramètres :**
- `phone` : Numéro sans le `+` (ex: `221775478575`)
- `amount` : Montant en FCFA
- `reference` : Référence de paiement (optionnel)

---

### Orange Money (7 pays UEMOA)

**Format :**
```
https://pay.orange.com/m?msisdn={PHONE}&amount={AMOUNT}&ref={REFERENCE}
```

**Exemple :**
```
https://pay.orange.com/m?msisdn=221775478575&amount=5000&ref=PAY-123
```

**Paramètres :**
- `msisdn` : Numéro sans le `+`
- `amount` : Montant en FCFA
- `ref` : Référence (optionnel)

---

### MTN Mobile Money (5 pays)

**Format :**
```
https://pay.mtn.com/m?phone={PHONE}&amount={AMOUNT}&ref={REFERENCE}
```

**Exemple :**
```
https://pay.mtn.com/m?phone=22507547857&amount=5000&ref=PAY-123
```

---

### Moov Money (5 pays)

**Format :**
```
https://pay.moov.com/m?phone={PHONE}&amount={AMOUNT}
```

**Exemple :**
```
https://pay.moov.com/m?phone=22172547857&amount=5000
```

---

### Free Money (Sénégal, Mali)

**Format :**
```
https://pay.freemoney.com/m?phone={PHONE}&amount={AMOUNT}
```

**Exemple :**
```
https://pay.freemoney.com/m?phone=22175547857&amount=5000
```

---

## 📊 Statuts de Transfert

| Statut | Description |
|--------|-------------|
| `pending` | Transfert créé, en attente de paiement |
| `processing` | Paiement en cours dans l'application provider |
| `debited` | Payeur a confirmé le paiement (débit effectué) |
| `credited` | Bénéficiaire crédité |
| `success` | Transfert complété avec succès |
| `failed` | Paiement échoué |
| `reversed` | Paiement inversé (remboursé) |
| `expired` | Lien expiré (15 minutes) |

---

## 💡 Cas d'Usage

### 1. Transfert P2P (Personne à Personne)

```json
{
  "payer": { "phone": "+221775478575", "name": "Moussa Diop" },
  "beneficiary": { "phone": "+221700000000", "name": "Fatou Sarr" },
  "amount": 10000,
  "currency": "XOF",
  "provider": "wave",
  "description": "Envoi d'argent famille"
}
```

**Lien généré :**
```
https://pay.wave.com/m?phone=221775478575&amount=10000&reference=PAY-XXX-123
```

### 2. Paiement Marchand

```json
{
  "payer": { "phone": "+221775478575" },
  "beneficiary": { "phone": "+221700000000" },
  "amount": 25000,
  "provider": "wave",
  "description": "Paiement commande #123"
}
```

### 3. Lien de Paiement à Partager

```json
{
  "payer": { "phone": "+221775478575" },
  "beneficiary": { "phone": "+221700000000" },
  "amount": 5000,
  "provider": "wave"
}
```

**Utilisation :**
1. L'API retourne un deep link
2. Vous partagez le lien au payeur (SMS, email, WhatsApp)
3. Le payeur clique → ouvre l'app Wave
4. Le payeur confirme le paiement

---

## 🔒 Modèle Sans Intégration API

### Ce que LIVEPay fait :

✅ Génère des deep links vers les applications providers  
✅ Stocke les métadonnées de transaction  
✅ Fournit une API unifiée pour tous les providers  
✅ Permet le suivi des statuts de paiement  

### Ce que LIVEPay ne fait PAS :

❌ N'appelle pas les APIs des providers  
❌ Ne détient jamais les fonds  
❌ Ne traite pas les paiements directement  
❌ Ne gère pas les authentifications (OTP, PIN)  

### Rôle de LIVEPay :

```
┌─────────────────────────────────────────────────────────┐
│                    LIVEPAY                              │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ Génération  │    │   Stockage   │    │   Suivi   │ │
│  │ deep links  │───>│  metadata    │───>│  statuts  │ │
│  └─────────────┘    └──────────────┘    └───────────┘ │
│                                                         │
│  ❌ Pas d'intégration API providers                     │
│  ❌ Pas de détention de fonds                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Exemple Complet

### Étape 1 : Initier un transfert

```bash
curl -X POST https://api.livepay.tech/v1/transfers \
  -H "Authorization: Bearer live_sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "merch_xxx",
    "payer": { "phone": "+221775478575", "name": "Moussa" },
    "beneficiary": { "phone": "+221700000000", "name": "Fatou" },
    "amount": 5000,
    "currency": "XOF",
    "provider": "wave",
    "description": "Remboursement"
  }'
```

### Étape 2 : Récupérer le deep link

**Réponse :**
```json
{
  "data": {
    "payment_deep_link": "https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123"
  },
  "meta": {
    "payment_url": "https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123",
    "expires_in": 900
  }
}
```

### Étape 3 : Partager le lien au payeur

**Par SMS :**
```
Bonjour Moussa, veuillez effectuer le paiement de 5000 FCFA ici :
https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123
```

**Par email :**
```html
<a href="https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123">
  Payer 5000 FCFA
</a>
```

**Par WhatsApp :**
```
🔗 Lien de paiement : https://pay.wave.com/m?phone=221775478575&amount=5000&reference=PAY-XXX-123
```

### Étape 4 : Le payeur clique et paie

1. Le lien s'ouvre dans l'application Wave
2. Le payeur voit le montant (5000 FCFA) et le bénéficiaire
3. Le payeur confirme avec son code secret
4. Wave affiche "Paiement réussi"

### Étape 5 : Mise à jour du statut (optionnel)

Si Wave envoie un webhook :
```bash
POST https://api.livepay.tech/v1/webhooks
{
  "event": "payment.success",
  "data": { "transfer_id": "trans_xxx", "status": "success" }
}
```

Ou mise à jour manuelle :
```bash
curl -X POST https://api.livepay.tech/v1/transfers/trans_xxx \
  -H "Authorization: Bearer live_sk_xxx" \
  -d '{"action": "mark_completed"}'
```

---

## 📱 Intégration Frontend

### Exemple React/Next.js

```tsx
import { useState } from 'react';

export function TransferForm() {
  const [deepLink, setDeepLink] = useState<string | null>(null);

  async function initiateTransfer(e: React.FormEvent) {
    e.preventDefault();
    
    const response = await fetch('/api/v1/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        merchant_id: 'merch_xxx',
        payer: { phone: '+221775478575' },
        beneficiary: { phone: '+221700000000' },
        amount: 5000,
        provider: 'wave',
      }),
    });

    const data = await response.json();
    setDeepLink(data.data.payment_deep_link);
  }

  return (
    <div>
      <button onClick={initiateTransfer}>
        Payer avec Wave
      </button>
      
      {deepLink && (
        <a href={deepLink} target="_blank" rel="noopener noreferrer">
          Ouvrir le paiement Wave
        </a>
      )}
    </div>
  );
}
```

### Exemple avec Redirection Automatique

```tsx
async function payWithWave() {
  const response = await fetch('/api/v1/transfers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: 'merch_xxx',
      payer: { phone: '+221775478575' },
      beneficiary: { phone: '+221700000000' },
      amount: 5000,
      provider: 'wave',
    }),
  });

  const data = await response.json();
  
  // Redirection automatique vers l'app Wave
  window.location.href = data.data.payment_deep_link;
}
```

---

## ⚠️ Limitations et Bonnes Pratiques

### Limitations

| Limitation | Description |
|------------|-------------|
| **Pas de confirmation automatique** | Sans webhook, le statut doit être mis à jour manuellement |
| **Dépend des apps providers** | Si l'app Wave/OM n'est pas installée, le lien peut ne pas fonctionner |
| **Expiration des liens** | Les deep links expirent après 15 minutes |

### Bonnes Pratiques

1. **Toujours vérifier le statut** après un délai raisonnable
2. **Fournir un bouton de secours** si le deep link échoue
3. **Enregistrer la référence** pour le suivi
4. **Notifier l'utilisateur** quand le paiement est confirmé

---

## 📞 Support

**Équipe LIVEPay**
- Email : support@livepay.tech
- Téléphone : +221705000505

**Documentation**
- API Reference : README.md
- Status : https://status.livepay.tech

---

**Version :** 2.0.0 (Deep Link Only)  
**Date :** 27 février 2026  
**Modèle :** Sans intégration API providers
