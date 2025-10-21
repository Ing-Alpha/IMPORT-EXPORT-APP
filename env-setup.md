# Configuration de l'environnement

## 🔧 Variables d'environnement requises

Créez un fichier `.env.local` dans la racine du projet avec le contenu suivant :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/import_export_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📋 Étapes de configuration

### 1. Créer le fichier .env.local
```bash
# Copiez le contenu ci-dessus dans un nouveau fichier .env.local
```

### 2. Configurer la base de données PostgreSQL

**Option A : Docker (Recommandé)**
```bash
# Créer un conteneur PostgreSQL
docker run --name postgres-import-export \
  -e POSTGRES_DB=import_export_db \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

**Option B : Installation locale**
- Installez PostgreSQL sur votre machine
- Créez une base de données nommée `import_export_db`

### 3. Mettre à jour la DATABASE_URL
Remplacez `username`, `password` et `localhost` par vos valeurs réelles dans le fichier `.env.local`.

### 4. Générer et appliquer les migrations Prisma
```bash
npm run db:generate
npm run db:migrate
```

### 5. Peupler la base de données (optionnel)
```bash
npm run db:seed
```

## 🔑 Génération d'une clé secrète

Pour générer une clé secrète NextAuth sécurisée :
```bash
openssl rand -base64 32
```

Ou utilisez un générateur en ligne : https://generate-secret.vercel.app/32
