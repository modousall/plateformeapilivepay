# 📋 Instructions pour Déployer les Règles Firestore

## Problème

L'erreur `PERMISSION_DENIED` indique que les règles de sécurité Firestore ne sont pas encore déployées.

---

## Solution : 2 Options

### Option 1 : Console Firebase (Recommandé)

1. **Accédez à la console Firebase**
   ```
   https://console.firebase.google.com/project/studio-2004607225-f6a14/firestore/rules
   ```

2. **Copiez le contenu de `firestore.rules`**
   ```bash
   cat firestore.rules
   ```

3. **Collez dans l'éditeur de règles**

4. **Cliquez sur "Publier"**

5. **Testez l'initialisation**
   ```bash
   npm run firebase:init
   ```

---

### Option 2 : Firebase CLI (Si authentifié)

1. **Se connecter à Firebase**
   ```bash
   firebase login
   ```

2. **Déployer les règles**
   ```bash
   firebase deploy --only firestore:rules --project studio-2004607225-f6a14
   ```

3. **Tester l'initialisation**
   ```bash
   npm run firebase:init
   ```

---

## Règles de Développement

Les règles actuelles (`firestore.rules`) sont configurées en **mode développement** :

```javascript
match /{document=**} {
  allow read, write: if true;
}
```

Cela permet toutes les opérations sans authentification.

**⚠️ Important :** En production, décommentez les règles de sécurité dans `firestore.rules`.

---

## Vérification

Après avoir déployé les règles, testez :

```bash
npm run firebase:init
```

Vous devriez voir :
```
✅ Initialisation terminée avec succès !
```

---

## En Cas de Problème

1. **Vérifiez que les règles sont publiées**
   - Console Firebase → Firestore → Rules
   - Devrait afficher `allow read, write: if true;`

2. **Redémarrez le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Videz le cache Firestore** (si nécessaire)
   - Console Firebase → Firestore → Data
   - Supprimez les collections existantes

---

## Support

Si le problème persiste :
- Email : support@livepay.tech
- Documentation : docs/FIREBASE_SETUP.md
