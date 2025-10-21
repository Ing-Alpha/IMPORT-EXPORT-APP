# Guide de Développement - Application Import-Export

## 🏗️ Architecture

L'application suit une architecture moderne avec Next.js 15 App Router :

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentification NextAuth
│   │   ├── clients/       # CRUD des clients
│   │   └── labels/        # Génération d'étiquettes
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Interface principale
│   └── globals.css        # Styles globaux + thème
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── ProtectedRoute.tsx # Protection des routes
│   ├── SessionProvider.tsx # Provider NextAuth
│   └── ThemeToggle.tsx   # Basculement thème
├── lib/                  # Utilitaires
│   ├── auth.ts          # Configuration NextAuth
│   ├── prisma.ts        # Client Prisma
│   ├── pdf.ts           # Génération PDF
│   └── password.ts      # Hachage des mots de passe
└── types/               # Types TypeScript
    └── next-auth.d.ts   # Extension NextAuth
```

## 🔐 Authentification

L'authentification utilise NextAuth.js avec un provider Credentials :

```typescript
// Configuration dans lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // Configuration du provider
    })
  ],
  // Callbacks pour JWT et session
})
```

### Protection des routes

Utilisez le composant `ProtectedRoute` pour protéger les pages :

```tsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProtectedPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div>Contenu protégé</div>
    </ProtectedRoute>
  )
}
```

## 🗄️ Base de Données

### Modèles Prisma

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("USER")
  labels    Label[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Client {
  id        String   @id @default(cuid())
  name      String
  company   String?
  address   String
  country   String
  phone     String?
  email     String?
  notes     String?
  labels    Label[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Label {
  id         String   @id @default(cuid())
  trackingId String   @unique
  client     Client   @relation(fields: [clientId], references: [id])
  clientId   String
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  pdfUrl     String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Commandes Prisma

```bash
npm run db:generate    # Générer le client Prisma
npm run db:migrate     # Appliquer les migrations
npm run db:push        # Pousser le schéma
npm run db:studio      # Interface graphique
npm run db:seed        # Peupler la base
```

## 📄 Génération PDF

La génération d'étiquettes utilise `pdf-lib` :

```typescript
// lib/pdf.ts
export async function generateLabelPDF(data: LabelData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([400, 300])
  
  // Ajout du contenu
  // ...
  
  return await pdfDoc.save()
}
```

### Structure d'une étiquette

- Logo de l'entreprise
- Informations du client (nom, adresse, pays)
- Numéro de suivi unique
- Date de génération
- Code-barres simulé

## 🎨 Interface Utilisateur

### Composants shadcn/ui

L'application utilise shadcn/ui pour les composants :

```bash
npx shadcn@latest add [component-name]
```

### Thème et Mode Sombre

Le thème est configuré dans `globals.css` avec support du mode sombre :

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... autres variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... variables mode sombre */
}
```

### Basculement de thème

Utilisez le composant `ThemeToggle` :

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

<ThemeToggle />
```

## 🚀 API Routes

### Structure des API Routes

```typescript
// app/api/clients/route.ts
export async function GET() {
  // Récupérer tous les clients
}

export async function POST(request: NextRequest) {
  // Créer un nouveau client
}

// app/api/clients/[id]/route.ts
export async function GET(request: NextRequest, { params }) {
  // Récupérer un client par ID
}

export async function PUT(request: NextRequest, { params }) {
  // Mettre à jour un client
}

export async function DELETE(request: NextRequest, { params }) {
  // Supprimer un client
}
```

### Authentification dans les API

```typescript
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  
  // Logique de l'API
}
```

## 🧪 Tests et Qualité

### Scripts disponibles

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run build         # Build de production
```

### Bonnes pratiques

1. **Types TypeScript** : Toujours typer les props et états
2. **Gestion d'erreurs** : Utiliser try/catch dans les API
3. **Sécurité** : Valider les données d'entrée
4. **Performance** : Utiliser les Server Components quand possible
5. **Accessibilité** : Utiliser les composants shadcn/ui

## 🔧 Développement

### Workflow recommandé

1. **Créer une branche** pour chaque fonctionnalité
2. **Développer** avec `npm run dev`
3. **Tester** les fonctionnalités
4. **Vérifier** avec `npm run lint` et `npm run type-check`
5. **Commit** avec des messages clairs en français
6. **Push** et créer une Pull Request

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📦 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables de production

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## 🐛 Débogage

### Problèmes courants

1. **Erreur Prisma** : Vérifier la connexion à la base de données
2. **Erreur NextAuth** : Vérifier NEXTAUTH_SECRET
3. **Erreur PDF** : Vérifier les données du client
4. **Erreur TypeScript** : Vérifier les types et imports

### Logs utiles

```bash
# Logs de développement
npm run dev

# Logs Prisma
npx prisma studio

# Logs de build
npm run build
```

---

**Ce guide est maintenu à jour avec l'évolution de l'application.**
