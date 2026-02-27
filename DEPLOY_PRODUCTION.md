# 🚀 LIVEPay - Guide de Déploiement Production

## ✅ Checklist Pré-Déploiement

### 1. Firebase Authentication
- [x] Firebase Auth activé
- [x] Super Admin créé (`modousall1@gmail.com`)
- [x] Email/Password activé dans Firebase Console

### 2. Firestore Database
- [x] Firestore activé
- [x] Règles de sécurité déployées
- [x] Données initialisées

### 3. Configuration
- [x] Variables d'environnement configurées
- [x] Build Next.js réussi
- [x] Code pushé sur GitHub

---

## 🔧 Étape 1 : Mettre à Jour les Règles Firestore pour Production

**Fichier : `firestore.rules`**

Actuellement en mode développement, nous devons sécuriser :

```bash
# Éditez firestore.rules
nano firestore.rules
```

**Règles de Production :**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             request.auth.token.email == 'modousall1@gmail.com';
    }
    
    // TRANSFERS
    match /transfers/{transferId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isSuperAdmin();
    }
    
    // MERCHANTS
    match /merchants/{merchantId} {
      allow read: if isAuthenticated();
      allow create: if isSuperAdmin();
      allow update: if isSuperAdmin();
      allow delete: if isSuperAdmin();
    }
    
    // USERS
    match /users/{userId} {
      allow read: if isAuthenticated() && 
                     (userId == request.auth.uid || isSuperAdmin());
      allow write: if false; // Lecture seule
    }
    
    // WEBHOOKS & LOGS
    match /webhooks/{webhookId} {
      allow read, write: if isAuthenticated();
    }
    
    match /webhook_logs/{logId} {
      allow read: if isAuthenticated();
      allow create: if true; // Système
      allow update, delete: if false;
    }
    
    // API KEYS
    match /api_keys/{keyId} {
      allow read, write: if isAuthenticated();
    }
    
    // STATS
    match /stats_aggregates/{aggregateId} {
      allow read: if isAuthenticated();
      allow write: if false; // Système
    }
  }
}
```

**Déployer les règles :**

```bash
firebase deploy --only firestore:rules --project api-live-pay
```

---

## 🌐 Étape 2 : Configurer Firebase Hosting

### 2.1 : Build de Production

```bash
npm run build
```

### 2.2 : Déployer sur Firebase Hosting

```bash
firebase deploy --only hosting --project api-live-pay
```

**URL de production :**
```
https://api-live-pay.web.app
```

---

## 🔐 Étape 3 : Configurer le Domaine Personnalisé (Optionnel)

### 3.1 : Dans Firebase Console

1. **Allez sur :**
   ```
   https://console.firebase.google.com/project/api-live-pay/hosting
   ```

2. **Cliquez sur "Add custom domain"**

3. **Ajoutez votre domaine :**
   - `livepay.tech`
   - `www.livepay.tech`

4. **Suivez les instructions DNS**

### 3.2 : Configuration DNS

**Chez votre registrar (GoDaddy, Namecheap, etc.) :**

```
Type: A
Name: @
Value: 76.74.245.10
TTL: 3600

Type: A
Name: @
Value: 76.74.245.11
TTL: 3600

Type: CNAME
Name: www
Value: api-live-pay.web.app
TTL: 3600
```

### 3.3 : Vérifier et Déployer

Une fois les DNS propagés (24-48h) :

```bash
firebase hosting:channel:deploy production
```

---

## 📊 Étape 4 : Activer Firebase Analytics (Optionnel)

### 4.1 : Dans Firebase Console

1. **Allez sur :**
   ```
   https://console.firebase.google.com/project/api-live-pay/analytics
   ```

2. **Activez Google Analytics**

3. **Configurez les événements à tracker**

### 4.2 : Dans le Code

Déjà configuré dans `src/lib/firebase.ts` :

```typescript
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
```

---

## 🔒 Étape 5 : Sécurité Renforcée

### 5.1 : Variables d'Environnement de Production

**Dans Firebase Console → Project Settings → Service Accounts :**

1. Générez une nouvelle clé privée
2. Téléchargez le fichier JSON
3. Ajoutez les variables sensibles dans `.env.production.local`

### 5.2 : Rate Limiting

**Dans `src/middleware.ts`, ajoutez :**

```typescript
// Limiter les requêtes API
if (pathname.startsWith('/api')) {
  // Implémenter rate limiting
}
```

### 5.3 : HTTPS Only

Déjà activé par défaut avec Firebase Hosting.

---

## 📱 Étape 6 : Monitoring et Logs

### 6.1 : Firebase Performance Monitoring

```bash
npm install firebase
```

Déjà inclus dans le projet.

### 6.2 : Consulter les Logs

**Firebase Console → Hosting → Activity**

---

## 🧪 Étape 7 : Tests de Validation

### 7.1 : Tester la Connexion

```
https://api-live-pay.web.app/login
```

- Email : `modousall1@gmail.com`
- Mot de passe : (votre mot de passe)

### 7.2 : Tester le Dashboard

```
https://api-live-pay.web.app/dashboard
```

Vérifiez :
- ✅ Stats affichées
- ✅ Transferts listés
- ✅ Marchands visibles
- ✅ Création de transfert fonctionne

### 7.3 : Tester les Transferts

1. Créez un transfert
2. Vérifiez le deep link Wave généré
3. Testez le QR code
4. Vérifiez Firestore

---

## 📈 Étape 8 : Optimisations Production

### 8.1 : Activer la Compression

Dans `next.config.ts` :

```typescript
const nextConfig = {
  compress: true,
  // ...
}
```

### 8.2 : Cache Strategique

Dans `firebase.json` :

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 8.3 : Image Optimization

Déjà géré par Next.js Image.

---

## 🚀 Commandes de Déploiement Rapide

```bash
# 1. Build
npm run build

# 2. Déployer Firestore Rules
firebase deploy --only firestore:rules --project api-live-pay

# 3. Déployer Hosting
firebase deploy --only hosting --project api-live-pay

# 4. Tout déployer
firebase deploy --project api-live-pay
```

---

## 📞 URLs de Production

| Service | URL |
|---------|-----|
| **Application** | https://api-live-pay.web.app |
| **Login** | https://api-live-pay.web.app/login |
| **Dashboard** | https://api-live-pay.web.app/dashboard |
| **API** | https://api-live-pay.web.app/api/v1 |
| **Firebase Console** | https://console.firebase.google.com/project/api-live-pay/ |

---

## ⚠️ Post-Déploiement

### À Faire Immédiatement

1. **Changer le mot de passe Super Admin**
   - Firebase Console → Authentication → Users
   - Reset password

2. **Vérifier les logs**
   - Firebase Console → Hosting → Activity

3. **Tester toutes les fonctionnalités**
   - Login
   - Dashboard
   - Création transfert
   - Export CSV

### À Faire Dans la Semaine

1. **Configurer le domaine personnalisé**
2. **Activer Firebase Analytics**
3. **Mettre en place le monitoring**
4. **Configurer les alertes**

---

## 🎊 Félicitations !

**LIVEPay v3.0.0 est en production !** 🚀

- ✅ Authentification Firebase sécurisée
- ✅ Firestore protégé
- ✅ Hosting déployé
- ✅ Wave uniquement (SN & CI)
- ✅ Dashboard Super Admin fonctionnel

**Projet :** `api-live-pay`  
**URL :** https://api-live-pay.web.app  
**Version :** 3.0.0  

---

**Développé avec ❤️ pour les e-commerçants de l'UEMOA**
