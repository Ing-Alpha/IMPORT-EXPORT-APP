# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-01-21

### Ajouté
- 🚀 Application complète de gestion des étiquettes d'expédition
- 🔐 Système d'authentification avec NextAuth.js
- 👥 Gestion complète des clients (CRUD)
- 🏷️ Génération d'étiquettes PDF imprimables
- 📊 Historique des étiquettes générées
- 🎨 Interface moderne avec shadcn/ui
- 🌙 Support du mode sombre
- 📱 Design responsive
- 🗄️ Base de données PostgreSQL avec Prisma
- 🔒 Protection des routes
- 📄 Documentation complète
- 🧪 Scripts de démarrage automatisés

### Fonctionnalités principales
- **Authentification** : Inscription, connexion, gestion des rôles
- **Gestion des clients** : Création, modification, suppression, recherche
- **Génération d'étiquettes** : PDF avec informations client, numéro de suivi, code-barres
- **Historique** : Consultation et réimpression des étiquettes
- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Paramètres** : Gestion du profil utilisateur

### Stack technique
- **Frontend** : Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend** : API Routes Next.js, Server Actions
- **Base de données** : PostgreSQL, Prisma ORM
- **Authentification** : NextAuth.js avec Credentials Provider
- **UI** : shadcn/ui, Lucide React
- **PDF** : pdf-lib pour la génération d'étiquettes
- **Validation** : Zod pour la validation des formulaires

### Configuration
- Variables d'environnement pour la base de données et l'authentification
- Scripts npm pour le développement et la production
- Configuration Prisma avec migrations et seed
- Support des environnements de développement et production

### Documentation
- README complet avec instructions d'installation
- Guide de développement pour les contributeurs
- Documentation API avec exemples
- Changelog pour le suivi des versions

---

## [Unreleased]

### À venir
- 📧 Notifications par email
- 📊 Tableaux de bord avancés
- 🔍 Recherche avancée avec filtres
- 📱 Application mobile
- 🌐 Support multilingue
- 📈 Analytics et rapports
- 🔄 Synchronisation en temps réel
- 📁 Gestion des fichiers joints
- 🏢 Gestion multi-entreprises
- 🔐 Authentification 2FA

### Améliorations prévues
- Performance optimisée
- Tests automatisés
- CI/CD pipeline
- Monitoring et logging
- Cache intelligent
- Compression des images
- PWA (Progressive Web App)
- Offline support

---

## Notes de version

### Version 1.0.0
- Version initiale stable
- Toutes les fonctionnalités de base implémentées
- Prête pour la production
- Documentation complète

### Prochaines versions
- Version 1.1.0 : Améliorations UX/UI
- Version 1.2.0 : Nouvelles fonctionnalités
- Version 2.0.0 : Refactoring majeur

---

**Format des versions :** `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles avec l'API
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles
