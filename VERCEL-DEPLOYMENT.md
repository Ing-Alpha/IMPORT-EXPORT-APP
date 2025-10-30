# Guide de Déploiement sur Vercel

## Problème de connexion résolu ✅

Le problème de connexion sur Vercel était dû à une configuration manquante de NextAuth. Les corrections ont été apportées dans `src/lib/auth.ts`.

## Variables d'environnement requises sur Vercel

Pour que l'application fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 1. DATABASE_URL
```
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
```
- Utilisez une base de données PostgreSQL en production (recommandé: Vercel Postgres, Supabase, ou Neon)
- Assurez-vous que la base de données est accessible depuis Vercel

### 2. NEXTAUTH_SECRET (OBLIGATOIRE)
```
NEXTAUTH_SECRET="votre-secret-genere"
```
**Comment générer un secret sécurisé :**
```bash
# Méthode 1: Avec OpenSSL
openssl rand -base64 32

# Méthode 2: En ligne
# Visitez: https://generate-secret.vercel.app/32
```

### 3. NEXTAUTH_URL
```
NEXTAUTH_URL="https://votre-app.vercel.app"
```
- En production sur Vercel, utilisez votre URL de production
- Exemple: `https://import-export-app.vercel.app`
- **IMPORTANT**: Utilisez `https://` (pas `http://`)

### 4. NODE_ENV (Optionnel)
```
NODE_ENV="production"
```
- Vercel configure automatiquement cette variable
- Vous n'avez généralement pas besoin de la définir manuellement

## Configuration sur Vercel

### Étape 1: Accéder aux variables d'environnement
1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Settings" (Paramètres)
4. Cliquez sur "Environment Variables" (Variables d'environnement)

### Étape 2: Ajouter les variables
Pour chaque variable d'environnement :
1. Cliquez sur "Add New"
2. Entrez le nom de la variable (ex: `NEXTAUTH_SECRET`)
3. Entrez la valeur
4. Sélectionnez les environnements : Production, Preview, Development
5. Cliquez sur "Save"

### Étape 3: Variables essentielles à configurer

| Variable | Environnement | Priorité |
|----------|--------------|----------|
| DATABASE_URL | Production, Preview | 🔴 CRITIQUE |
| NEXTAUTH_SECRET | Production, Preview, Development | 🔴 CRITIQUE |
| NEXTAUTH_URL | Production, Preview | 🟡 IMPORTANT |

### Étape 4: Redéployer l'application
Après avoir ajouté les variables d'environnement :
1. Allez dans l'onglet "Deployments"
2. Cliquez sur les trois points (...) du déploiement le plus récent
3. Sélectionnez "Redeploy"
4. Confirmez le redéploiement

## Configuration de la base de données

### Option 1: Vercel Postgres (Recommandé)
```bash
# Dans votre projet Vercel
1. Allez dans "Storage"
2. Créez une nouvelle base de données Postgres
3. Copiez la DATABASE_URL générée
4. Ajoutez-la aux variables d'environnement
```

### Option 2: Supabase
```bash
1. Créez un projet sur supabase.com
2. Allez dans Settings > Database
3. Copiez l'URL de connexion (Connection string)
4. Utilisez le mode "Connection pooling" pour de meilleures performances
```

### Option 3: Neon
```bash
1. Créez un projet sur neon.tech
2. Copiez la connection string
3. Ajoutez-la comme DATABASE_URL sur Vercel
```

## Migration de la base de données

Une fois la base de données configurée, vous devez exécuter les migrations :

```bash
# En local, avec l'URL de production
DATABASE_URL="votre-url-de-prod" npx prisma migrate deploy

# Ou créez un script de migration dans package.json
"db:migrate:prod": "prisma migrate deploy"
```

## Vérification du déploiement

Après le déploiement, vérifiez que :

1. ✅ L'application se charge sans erreur
2. ✅ La page de connexion s'affiche correctement
3. ✅ Vous pouvez vous connecter avec un compte existant
4. ✅ La session persiste après rafraîchissement
5. ✅ Les cookies sont bien définis (vérifiez dans les DevTools)

## Problèmes courants et solutions

### Erreur: "Invalid `prisma.user.findUnique()` invocation"
**Cause**: La base de données n'est pas accessible ou DATABASE_URL est incorrecte
**Solution**: Vérifiez votre DATABASE_URL et que la base de données autorise les connexions depuis Vercel

### Erreur: "No response from auth endpoint"
**Cause**: NEXTAUTH_SECRET n'est pas défini
**Solution**: Générez et ajoutez NEXTAUTH_SECRET dans les variables d'environnement

### Erreur: "CSRF token mismatch"
**Cause**: NEXTAUTH_URL ne correspond pas à votre domaine Vercel
**Solution**: Mettez à jour NEXTAUTH_URL avec votre URL Vercel exacte

### La connexion fonctionne mais la session se perd après rafraîchissement
**Cause**: Problème de cookies ou de domaine
**Solution**: 
- Vérifiez que NEXTAUTH_URL utilise `https://`
- Vérifiez que les cookies sécurisés sont activés (déjà fait dans la correction)
- Désactivez temporairement les bloqueurs de cookies dans votre navigateur

### Erreur: "Cannot find module 'bcryptjs'"
**Cause**: Dépendances manquantes
**Solution**: Vercel devrait installer automatiquement les dépendances. Si ce n'est pas le cas, vérifiez votre package.json

## Checklist de déploiement

Avant de déployer :
- [ ] DATABASE_URL configurée et base de données accessible
- [ ] NEXTAUTH_SECRET généré et configuré (32+ caractères aléatoires)
- [ ] NEXTAUTH_URL configurée avec votre domaine Vercel (https://)
- [ ] Migrations de base de données exécutées
- [ ] Au moins un utilisateur créé dans la base de données
- [ ] Testé la connexion en local avec les variables de production

Après le déploiement :
- [ ] Application accessible et se charge correctement
- [ ] Page de connexion fonctionnelle
- [ ] Connexion réussie avec les identifiants de test
- [ ] Session persistante après rafraîchissement
- [ ] Pas d'erreurs dans les logs Vercel

## Support

Si vous rencontrez toujours des problèmes après avoir suivi ce guide :

1. Vérifiez les logs dans Vercel Dashboard > Functions
2. Vérifiez les logs en temps réel avec : `vercel logs`
3. Testez la connexion à la base de données séparément
4. Vérifiez que toutes les variables d'environnement sont bien définies

## Ressources utiles

- [NextAuth.js Documentation](https://next-auth.js.org/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma avec Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

