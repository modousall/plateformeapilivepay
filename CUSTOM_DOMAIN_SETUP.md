# 🌐 Configuration du Domaine Personnalisé - LIVEPAY

## 📋 Vue d'Ensemble

**Domaine cible :** `livepay.tech`  
**Projet Firebase :** `api-live-pay`  
**Service :** Firebase App Hosting  
**Backend actuel :** `plateformeapilivepay`  
**URL actuelle :** https://plateformeapilivepay--api-live-pay.us-central1.hosted.app

---

## 🚀 Étapes de Configuration

### Étape 1 : Accéder à Firebase App Hosting

1. **Ouvrez la console Firebase :**
   ```
   https://console.firebase.google.com/project/api-live-pay/apphosting
   ```

2. **Sélectionnez votre backend** dans la liste

3. **Cliquez sur l'onglet "Settings"** (Paramètres)

4. **Cliquez sur "Add custom domain"**

---

### Étape 2 : Ajouter le Domaine

1. **Entrez le domaine :** `livepay.tech`

2. **Option de redirection (recommandé) :**
   - ✅ Cochez "Redirect all requests to a second domain"
   - Choisissez : `www.livepay.tech` (ou l'inverse)

3. **Cliquez sur "Continue setup"**

---

### Étape 3 : Configurer les Enregistrements DNS

Firebase va générer des enregistrements DNS spécifiques. Voici ce que vous devrez configurer chez votre registrar :

#### 📝 Enregistrements Typiques Requis

| Priorité | Type | Nom/Hôte | Valeur/Cible | TTL |
|----------|------|----------|--------------|-----|
| 1 | **TXT** | `@` | `fah-claim=[UUID-Firebase]` | 3600 |
| 2 | **A** | `@` | `76.76.21.21` | 3600 |
| 3 | **A** | `@` | `76.76.21.22` | 3600 |
| 4 | **CNAME** | `www` | `[backend-id].firebaseapp.com` | 3600 |
| 5 | **CNAME** | `_acme-challenge` | `[SSL-verification-value]` | 3600 |

> ⚠️ **Important :** Les valeurs exactes vous seront fournies par Firebase dans l'assistant de configuration.

---

### Étape 4 : Chez Votre Registrar

Connectez-vous à l'interface de gestion de domaine où vous avez acheté `livepay.tech` :

#### Exemples de Registrars

- **GoDaddy :** https://www.godaddy.com
- **Namecheap :** https://www.namecheap.com
- **Google Domains :** https://domains.google
- **OVH :** https://www.ovh.com
- **Cloudflare :** https://www.cloudflare.com

#### Actions à Effectuer

1. **Accédez à la zone DNS** de `livepay.tech`

2. **Supprimez les anciens enregistrements :**
   - ❌ Supprimez tout enregistrement A pointant vers un autre hébergeur
   - ❌ Supprimez tout enregistrement CNAME conflicting

3. **Ajoutez les nouveaux enregistrements Firebase :**
   - ✅ Copiez exactement les valeurs fournies par Firebase
   - ✅ Respectez le type (A, CNAME, TXT)
   - ✅ Utilisez `@` pour le domaine racine

4. **Sauvegardez les modifications**

---

### Étape 5 : Vérification dans Firebase

1. **Retournez dans Firebase Console**

2. **Cliquez sur "Verify records"**

3. **Attendez la propagation DNS :**
   - ⏳ Minimum : 5-10 minutes
   - ⏳ Maximum : 24 heures
   - 🕐 Moyenne : 1-2 heures

4. **Vérifiez le statut :**
   ```
   Backend Dashboard → Settings → View domains
   ```

---

### Étape 6 : Provisionnement SSL

Après la vérification DNS :

1. **Statut : "Certificate minting"**
   - Firebase demande un certificat SSL à Let's Encrypt
   - Durée : 15 min - 2 heures

2. **Statut : "Connected"** ✅
   - Votre domaine est prêt !
   - HTTPS automatique activé

---

## 🔍 Vérification et Dépannage

### Vérifier la Propagation DNS

Utilisez ces outils en ligne :

```
https://dnschecker.org/
https://www.whatsmydns.net/
https://toolbox.googleapps.com/apps/dig/
```

**Commandes locales :**

```bash
# Vérifier les enregistrements A
dig livepay.tech A

# Vérifier les enregistrements CNAME
dig www.livepay.tech CNAME

# Vérifier les enregistrements TXT
dig livepay.tech TXT
```

---

### Problèmes Courants

#### ❌ "DNS records not found"

**Solution :**
- Attendez la propagation DNS (jusqu'à 24h)
- Vérifiez que vous avez supprimé les anciens enregistrements A/CNAME
- Vérifiez les fautes de frappe dans les valeurs DNS

#### ❌ "SSL Certificate Pending" trop longtemps

**Solution :**
- Vérifiez vos enregistrements CAA (doivent autoriser `letsencrypt.org` et `pki.goog`)
- Supprimez les enregistrements AAAA (IPv6 non supportés)
- Contactez le support Firebase si > 24h

#### ❌ "Domain already claimed"

**Solution :**
- Le domaine est déjà connecté à un autre projet Firebase
- Supprimez-le de l'ancien projet d'abord

---

## 📊 URLs Après Configuration

| Service | URL |
|---------|-----|
| **Domaine principal** | https://livepay.tech |
| **WWW** | https://www.livepay.tech |
| **API** | https://livepay.tech/api/v1 |
| **Dashboard** | https://livepay.tech/dashboard |
| **Firebase (backup)** | https://api-live-pay.web.app |
| **App Hosting (actuel)** | https://plateformeapilivepay--api-live-pay.us-central1.hosted.app |

---

## 🔗 Liens Utiles

### Console Firebase

- **App Hosting Dashboard :** https://console.firebase.google.com/project/api-live-pay/apphosting
- **Ajouter un domaine :** https://console.firebase.google.com/project/api-live-pay/apphosting/settings/domains
- **Backend spécifique :** https://console.firebase.google.com/project/api-live-pay/apphosting/backends/plateformeapilivepay

---

## 🔐 Sécurité

### Enregistrements CAA Recommandés

Ajoutez ces enregistrements CAA pour autoriser Firebase à créer des certificats SSL :

```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"

Type: CAA
Name: @
Value: 0 issue "pki.goog"
```

---

## 📞 Support

### Firebase

- **Documentation :** https://firebase.google.com/docs/app-hosting/custom-domain
- **Support :** https://firebase.google.com/support

### LIVEPay

- **Email :** support@livepay.tech
- **GitHub :** https://github.com/modousall/plateformeapilivepay

---

## ✅ Checklist Finale

- [ ] Accédé à Firebase Console App Hosting
- [ ] Ajouté le domaine `livepay.tech`
- [ ] Récupéré les enregistrements DNS fournis par Firebase
- [ ] Connecté au registrar du domaine
- [ ] Supprimé les anciens enregistrements conflictuels
- [ ] Ajouté les nouveaux enregistrements Firebase
- [ ] Vérifié la propagation DNS
- [ ] Confirmé le statut "Connected" dans Firebase
- [ ] Testé l'accès : https://livepay.tech
- [ ] Testé l'API : https://livepay.tech/api/v1

---

## 🎉 Prêt !

Une fois le statut **"Connected"** affiché dans Firebase, votre domaine `livepay.tech` sera opérationnel avec :

- ✅ HTTPS automatique
- ✅ Renouvellement SSL automatique
- ✅ Redirection WWW configurable
- ✅ Protection DDoS Firebase

---

**Dernière mise à jour :** 27 février 2026  
**Version :** 1.0.0  
**Statut :** 📋 Prêt pour configuration
