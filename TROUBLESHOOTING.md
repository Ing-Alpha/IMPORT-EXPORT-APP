# 🔧 Guide de Résolution des Problèmes

## ❌ Erreurs actuelles et solutions

### 1. Erreur : "The table `public.User` does not exist"

**Problème** : Les tables de la base de données n'existent pas.

**Solution** :
```bash
# 1. Créer le fichier .env.local avec les variables d'environnement
# (Voir env-setup.md pour le contenu)

# 2. Configurer PostgreSQL
docker run --name postgres-import-export \
  -e POSTGRES_DB=import_export_db \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# 3. Générer le client Prisma
npm run db:generate

# 4. Créer et appliquer les migrations
npm run db:migrate

# 5. Redémarrer l'application
npm run dev
```

### 2. Avertissements NextAuth

**Problème** : Variables d'environnement NextAuth manquantes.

**Solution** :
```bash
# Ajouter dans .env.local :
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-ici"
```

### 3. Erreur de compilation NextAuth

**Problème** : Configuration NextAuth incorrecte.

**Solution** : ✅ **Déjà corrigée** dans `src/lib/auth.ts`

## 🚀 Étapes de résolution complète

### Étape 1 : Configuration de l'environnement
1. Créer `.env.local` avec les variables requises
2. Configurer PostgreSQL (Docker recommandé)

### Étape 2 : Initialisation de la base de données
```bash
npm run db:generate  # Générer le client Prisma
npm run db:migrate   # Créer les tables
npm run db:seed      # Données de test (optionnel)
```

### Étape 3 : Test de l'application
```bash
npm run dev          # Démarrer en mode développement
```

## 🔍 Vérifications

### Vérifier la connexion à la base
```bash
npm run db:studio    # Interface graphique Prisma
```

### Vérifier les variables d'environnement
```bash
# Dans le terminal de l'application, vérifier que les variables sont chargées
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
```

## 📋 Checklist de résolution

- [ ] Fichier `.env.local` créé avec toutes les variables
- [ ] PostgreSQL configuré et accessible
- [ ] `npm run db:generate` exécuté avec succès
- [ ] `npm run db:migrate` exécuté avec succès
- [ ] Application redémarrée (`npm run dev`)
- [ ] Plus d'erreurs dans les logs

## 🆘 En cas de problème persistant

1. **Vérifier les logs** : Regarder les erreurs dans le terminal
2. **Nettoyer le cache** : `rm -rf .next && npm run dev`
3. **Vérifier la base** : `npm run db:studio`
4. **Reset complet** : Supprimer la base et recréer les migrations
