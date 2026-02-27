# 🎯 Action Requise : Configurer le Domaine livepay.tech

## ⚡ Résumé Rapide

Votre application LIVEPAY est déployée sur Firebase App Hosting. Pour utiliser le domaine personnalisé `livepay.tech`, suivez ces étapes :

---

## 📋 3 Étapes Simples

### 1️⃣ Ouvrir la Console Firebase

**Cliquez ici :**
```
https://console.firebase.google.com/project/api-live-pay/apphosting/backends/plateformeapilivepay
```

### 2️⃣ Ajouter le Domaine

1. Onglet **Settings** → **Add custom domain**
2. Entrez : `livepay.tech`
3. Cliquez sur **Continue setup**

### 3️⃣ Configurer DNS chez Votre Registrar

Firebase va vous donner des enregistrements DNS à ajouter. Exemple typique :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: plateformeapilivepay--api-live-pay.us-central1.hosted.app
```

---

## ⏱️ Temps Requis

- **Configuration Firebase :** 5 minutes
- **Configuration DNS :** 10 minutes
- **Propagation DNS :** 1-24 heures (moyenne : 2 heures)
- **Provisionnement SSL :** 15 min - 2 heures

---

## ✅ Vérification

Après configuration, testez :

```bash
# Vérifier la propagation DNS
ping livepay.tech

# Tester l'accès HTTPS
curl -I https://livepay.tech

# Tester l'API
curl https://livepay.tech/api/v1/health
```

---

## 📞 Besoin d'Aide ?

**Documentation complète :** `CUSTOM_DOMAIN_SETUP.md`

**Support Firebase :** https://firebase.google.com/support

---

**Statut :** ⏳ En attente de configuration manuelle dans la console Firebase  
**Dernière mise à jour :** 27 février 2026
