# Application Import-Export - Gestion des Étiquettes

Une application web full stack moderne pour la gestion des étiquettes d'expédition, développée avec Next.js 15, TypeScript, Tailwind CSS, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec NextAuth.js
- **Gestion complète des clients** (CRUD)
- **Génération d'étiquettes PDF** imprimables
- **Historique des étiquettes** générées
- **Interface moderne** avec shadcn/ui
- **Base de données PostgreSQL** avec Prisma ORM

## 🛠️ Stack Technique

- **Frontend:** Next.js 15 (App Router), React Server Components, TypeScript, TailwindCSS
- **Backend:** API Routes + Server Actions (Next.js)
- **Base de données:** PostgreSQL avec Prisma ORM
- **Authentification:** NextAuth.js avec Credentials Provider
- **UI:** shadcn/ui (composants accessibles et modernes)
- **PDF:** pdf-lib pour la génération d'étiquettes
- **Déploiement:** Vercel + Neon PostgreSQL

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL (local ou Neon)
- npm ou yarn

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd import-export-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/import_export_db?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Configurer la base de données**
   ```bash
   # Générer le client Prisma
   npx prisma generate
   
   # Appliquer les migrations
   npx prisma migrate dev
   
   # (Optionnel) Seeder la base de données
   npx prisma db seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

### 1. Créer un compte
- Accédez à `/auth/signup`
- Remplissez le formulaire d'inscription
- Connectez-vous avec vos identifiants

### 2. Gérer les clients
- Accédez à `/dashboard/clients`
- Cliquez sur "Nouveau client" pour ajouter un client
- Remplissez les informations requises (nom, adresse, pays)
- Sauvegardez le client

### 3. Générer une étiquette
- Ouvrez la fiche d'un client
- Cliquez sur "Générer une étiquette"
- Le PDF sera automatiquement téléchargé
- L'étiquette contient :
  - Logo de l'entreprise
  - Informations du client
  - Numéro de suivi unique
  - Code-barres simulé
  - Date de génération

### 4. Consulter l'historique
- Accédez à `/dashboard/history`
- Consultez toutes les étiquettes générées
- Recherchez par numéro de suivi ou client
- Téléchargez ou réimprimez les étiquettes

## 🗂️ Structure du Projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentification
│   │   ├── clients/       # Gestion des clients
│   │   └── labels/        # Génération d'étiquettes
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Interface principale
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   └── ui/               # Composants shadcn/ui
├── lib/                  # Utilitaires
│   ├── auth.ts          # Configuration NextAuth
│   ├── prisma.ts        # Client Prisma
│   ├── pdf.ts           # Génération PDF
│   └── password.ts      # Hachage des mots de passe
└── types/               # Types TypeScript
```

## 🗄️ Modèle de Données

### User
- `id`: Identifiant unique
- `name`: Nom complet
- `email`: Adresse email (unique)
- `password`: Mot de passe haché
- `role`: Rôle utilisateur (USER/ADMIN)

### Client
- `id`: Identifiant unique
- `name`: Nom du client
- `company`: Société (optionnel)
- `address`: Adresse complète
- `country`: Pays
- `phone`: Téléphone (optionnel)
- `email`: Email (optionnel)
- `notes`: Notes (optionnel)

### Label
- `id`: Identifiant unique
- `trackingId`: Numéro de suivi unique
- `clientId`: Référence vers le client
- `userId`: Référence vers l'utilisateur
- `pdfUrl`: URL du PDF (optionnel)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Lancer en développement
npm run build        # Build de production
npm run start        # Lancer en production
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository à Vercel**
2. **Configurer les variables d'environnement**
3. **Déployer automatiquement**

### Variables d'environnement pour la production

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour simplifier la gestion des étiquettes d'expédition**