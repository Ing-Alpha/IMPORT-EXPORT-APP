# Script de configuration de la base de données
# Exécutez ce script après avoir configuré .env

Write-Host "🔧 Configuration de la base de données..." -ForegroundColor Cyan

# Vérifier si .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Fichier .env non trouvé!" -ForegroundColor Red
    Write-Host "📋 Créez le fichier .env avec le contenu suivant:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "DATABASE_URL=`"postgresql://neondb_owner:npg_UZA4Nqbvw9ko@ep-tiny-tree-ad4orbp8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`""
    Write-Host "NEXTAUTH_URL=`"http://localhost:3000`""
    Write-Host "NEXTAUTH_SECRET=`"your-super-secret-key-here`""
    Write-Host "NEXT_PUBLIC_APP_URL=`"http://localhost:3000`""
    Write-Host ""
    Write-Host "Voir env-setup.md pour plus de détails."
    exit 1
}

Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green

# Générer le client Prisma
Write-Host "🔨 Génération du client Prisma..." -ForegroundColor Cyan
npm run db:generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Client Prisma généré avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Appliquer les migrations
Write-Host "🗄️ Application des migrations..." -ForegroundColor Cyan
npm run db:migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations appliquées avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'application des migrations" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que PostgreSQL est démarré et accessible" -ForegroundColor Yellow
    exit 1
}

# Optionnel : Peupler la base de données
Write-Host "🌱 Peuplement de la base de données (optionnel)..." -ForegroundColor Cyan
$response = Read-Host "Voulez-vous peupler la base avec des données de test? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    npm run db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données peuplée avec succès" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Erreur lors du peuplement (non critique)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Configuration terminée!" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant démarrer l'application avec: npm run dev" -ForegroundColor Cyan
