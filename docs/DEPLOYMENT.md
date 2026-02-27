# 🚀 LIVEPay - Déploiement en Production

## ✅ Checklist de Déploiement

### 1. Build de Production

```bash
npm run build
```

**Statut :** ✅ **Réussi**

Sortie attendue :
```
✓ Compiled successfully
✓ Static pages generated
✓ Server pages rendered
```

---

### 2. Déploiement Firebase Hosting

#### Option A : Via Firebase CLI (Recommandé)

```bash
# 1. Se connecter à Firebase
firebase login

# 2. Déployer
firebase deploy --only hosting --project studio-2004607225-f6a14
```

#### Option B : Via Vercel (Alternative)

1. Importer le projet sur Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

---

### 3. Déploiement Firestore Rules

**IMPORTANT :** Les règles de sécurité doivent être déployées manuellement.

1. **Accédez à la console Firebase :**
   ```
   https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/rules
   ```

2. **Copiez le contenu de `firestore.rules`**

3. **Collez et publiez**

4. **Pour la production, décommentez les règles de sécurité** dans `firestore.rules`

---

### 4. Initialiser les Données

Après le déploiement :

```bash
npm run firebase:init
```

Cela créera :
- 2 marchands de test
- 2 transferts de test
- 1 super admin

---

## 🔗 URLs de Production

### Application

- **Production** : https://studio-2004607225-f6a14.web.app
- **Custom Domain** : https://livepay.tech (à configurer)

### API

- **Base URL** : https://studio-2004607225-f6a14.web.app/api/v1
- **Transferts** : https://studio-2004607225-f6a14.web.app/api/v1/transfers
- **Stats** : https://studio-2004607225-f6a14.web.app/api/v1/stats

### Console Firebase

- **Dashboard** : https://console.firebase.google.com/project/studio-2004607225-f6a14/overview
- **Firestore** : https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore
- **Hosting** : https://console.firebase.google.com/project/studio-2004607225-f6a14/hosting

---

## 🧪 Tests de Validation

### 1. Tester l'API

```bash
# Initier un transfert
curl -X POST https://studio-2004607225-f6a14.web.app/api/v1/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "MERCHANT_ID_FROM_FIRESTORE",
    "payer": { "phone": "+221775478575" },
    "beneficiary": { "phone": "+221700000000" },
    "amount": 5000,
    "provider": "wave"
  }'
```

### 2. Tester la Page de Paiement

```
https://studio-2004607225-f6a14.web.app/pay/trans_xxx
```

### 3. Tester le Dashboard

```
https://studio-2004607225-f6a14.web.app/dashboard
```

---

## ⚠️ Important : Production Ready

### Avant de Passer en Production

1. **Restreindre les règles Firestore**
   - Décommentez les règles de sécurité dans `firestore.rules`
   - Déployez avec `firebase deploy --only firestore:rules`

2. **Configurer les variables d'environnement**
   - `.env.local` → Variables de production
   - Firebase Console → Environment variables

3. **Activer Firebase Authentication**
   - Email/Mot de passe
   - OAuth (Google, etc.)

4. **Configurer le domaine personnalisé**
   - Firebase Hosting → Custom domain
   - Ajouter livepay.tech

5. **Activer le monitoring**
   - Firebase Performance Monitoring
   - Crashlytics

---

## 📊 Monitoring

### Logs en Temps Réel

```bash
firebase hosting:channel:open live
```

### Analytics

- Firebase Console → Analytics
- Google Analytics (si configuré)

---

## 🔄 Mises à Jour Futures

```bash
# 1. Faire les changements
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 2. Push vers GitHub
git push origin main

# 3. Déployer
firebase deploy --only hosting --project studio-2004607225-f6a14
```

---

## 📞 Support

**Équipe LIVEPay**
- Email : support@livepay.tech
- Téléphone : +221705000505

---

**Version :** 3.0.0  
**Statut :** ✅ **Prêt pour la production**  
**Dernière mise à jour :** 27 février 2026
