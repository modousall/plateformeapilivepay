# 🚀 Instructions pour Push vers GitHub

## Étape 1: Vérifiez vos credentials Git

```bash
# Vérifiez votre configuration Git
git config --global user.name
git config --global user.email
```

## Étape 2: Ajoutez vos credentials GitHub

### Option A: HTTPS avec Token (Recommandé)

1. Créez un Personal Access Token sur GitHub :
   - Allez sur : https://github.com/settings/tokens
   - Cliquez sur "Generate new token"
   - Sélectionnez les scopes : `repo`, `workflow`
   - Copiez le token généré

2. Configurez Git pour utiliser le token :

```bash
git config --global credential.helper store
git push -u origin main
# Entrez votre username GitHub
# Entrez votre token comme mot de passe
```

### Option B: SSH (Recommandé pour usage fréquent)

1. Générez une clé SSH :

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Ajoutez la clé à GitHub :
   - Copiez la clé publique : `cat ~/.ssh/id_ed25519.pub`
   - Allez sur : https://github.com/settings/keys
   - Cliquez sur "New SSH key"
   - Collez votre clé

3. Changez l'URL du remote en SSH :

```bash
git remote set-url origin git@github.com:modousall/plateformeapilivepay.git
git push -u origin main
```

## Étape 3: Vérifiez le push

```bash
git status
# Devrait afficher : "Your branch is up to date with 'origin/main'"
```

## URL du Repository

- **HTTPS** : https://github.com/modousall/plateformeapilivepay.git
- **SSH** : git@github.com:modousall/plateformeapilivepay.git

## Commandes Utiles

```bash
# Voir les remotes
git remote -v

# Changer l'URL du remote
git remote set-url origin <nouvelle-url>

# Push vers une autre branche
git push origin develop

# Force push (si nécessaire)
git push -f origin main
```

## En cas de Problème

1. **Erreur d'authentification** :
   ```bash
   # Effacez les credentials stockés
   rm ~/.git-credentials
   # Réessayez le push
   git push -u origin main
   ```

2. **Erreur de permission** :
   - Vérifiez que vous avez accès au repository
   - Vérifiez que votre token a les bons scopes

3. **Repository n'existe pas** :
   - Créez le repository sur GitHub d'abord
   - Ou push avec l'option `--create-upstream`

## Support

Si vous rencontrez des problèmes, consultez :
- https://docs.github.com/en/authentication
- https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git
