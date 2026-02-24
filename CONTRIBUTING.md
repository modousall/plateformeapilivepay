# Contribuer à LIVEPAY

Merci de votre intérêt pour contribuer à LIVEPAY !

## Comment Contribuer

### 1. Fork le Repository

```bash
git fork https://github.com/modousall/plateformeapilivepay
```

### 2. Clonez votre Fork

```bash
git clone https://github.com/votre-username/plateformeapilivepay.git
cd plateformeapilivepay
```

### 3. Créez une Branche

```bash
git checkout -b feature/ma-fonctionnalite
```

### 4. Faites vos Modifications

- Suivez le style de code existant
- Ajoutez des tests si nécessaire
- Mettez à jour la documentation

### 5. Committez

```bash
git add .
git commit -m "feat: ajout de ma fonctionnalité"
```

### 6. Push et Pull Request

```bash
git push origin feature/ma-fonctionnalite
```

Puis créez une Pull Request sur GitHub.

## Standards de Code

### TypeScript

- Utiliser TypeScript strict
- Types explicites pour les fonctions publiques
- Interfaces pour les objets

### Nommage

- CamelCase pour les variables et fonctions
- PascalCase pour les composants et types
- Kebab-case pour les fichiers

### Commits

Suivez [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

## Tests

```bash
npm test
npm run test:unit
npm run test:e2e
```

## Documentation

- Mettre à jour README.md
- Documenter les nouvelles API
- Ajouter des exemples

## Questions ?

Ouvrez une issue ou contactez support@livepay.tech
