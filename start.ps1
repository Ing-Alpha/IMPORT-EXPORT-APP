# Script de démarrage PowerShell pour l'application Import-Export
# Usage: .\start.ps1 [dev|prod|setup]

param(
    [string]$Command = "dev"
)

# Fonction pour afficher les messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    switch ($Level) {
        "INFO" { Write-Host "[$timestamp] [INFO] $Message" -ForegroundColor Green }
        "WARN" { Write-Host "[$timestamp] [WARN] $Message" -ForegroundColor Yellow }
        "ERROR" { Write-Host "[$timestamp] [ERROR] $Message" -ForegroundColor Red }
    }
}

# Fonction pour vérifier les prérequis
function Test-Prerequisites {
    Write-Log "Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node -v
        Write-Log "Node.js version: $nodeVersion"
        
        $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($majorVersion -lt 18) {
            Write-Log "Node.js version 18+ requis. Version actuelle: $nodeVersion" "ERROR"
            exit 1
        }
    }
    catch {
        Write-Log "Node.js n'est pas installé. Veuillez installer Node.js 18+" "ERROR"
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm -v
        Write-Log "npm version: $npmVersion"
    }
    catch {
        Write-Log "npm n'est pas installé" "ERROR"
        exit 1
    }
    
    Write-Log "Prérequis vérifiés ✓"
}

# Fonction pour installer les dépendances
function Install-Dependencies {
    Write-Log "Installation des dépendances..."
    
    if (-not (Test-Path "node_modules")) {
        npm install
    }
    else {
        Write-Log "Dépendances déjà installées"
    }
}

# Fonction pour configurer l'environnement
function Set-Environment {
    Write-Log "Configuration de l'environnement..."
    
    if (-not (Test-Path ".env.local")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env.local"
            Write-Log "Fichier .env.local créé à partir de .env.example" "WARN"
            Write-Log "Veuillez configurer vos variables d'environnement dans .env.local" "WARN"
        }
        else {
            Write-Log "Fichier .env.example non trouvé" "ERROR"
            exit 1
        }
    }
    else {
        Write-Log "Fichier .env.local existe déjà"
    }
}

# Fonction pour configurer la base de données
function Set-Database {
    Write-Log "Configuration de la base de données..."
    
    # Générer le client Prisma
    npx prisma generate
    
    # Appliquer les migrations
    Write-Log "Application des migrations..."
    npx prisma migrate dev --name init
    
    # Peupler la base de données
    Write-Log "Peuplement de la base de données..."
    npx prisma db seed
    
    Write-Log "Base de données configurée ✓"
}

# Fonction pour démarrer en mode développement
function Start-Dev {
    Write-Log "Démarrage en mode développement..."
    npm run dev
}

# Fonction pour démarrer en mode production
function Start-Prod {
    Write-Log "Build de l'application..."
    npm run build
    
    Write-Log "Démarrage en mode production..."
    npm run start
}

# Fonction pour afficher l'aide
function Show-Help {
    Write-Host "Usage: .\start.ps1 [COMMAND]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "  dev     Démarrer en mode développement"
    Write-Host "  prod    Démarrer en mode production"
    Write-Host "  setup   Configuration complète de l'application"
    Write-Host "  help    Afficher cette aide"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\start.ps1 setup    # Configuration complète"
    Write-Host "  .\start.ps1 dev       # Démarrage développement"
    Write-Host "  .\start.ps1 prod      # Démarrage production"
}

# Fonction principale
function Main {
    switch ($Command.ToLower()) {
        "setup" {
            Write-Log "Configuration complète de l'application Import-Export"
            Test-Prerequisites
            Install-Dependencies
            Set-Environment
            Set-Database
            Write-Log "Configuration terminée ! Vous pouvez maintenant démarrer avec: .\start.ps1 dev"
        }
        "dev" {
            Write-Log "Démarrage en mode développement"
            Test-Prerequisites
            Install-Dependencies
            Start-Dev
        }
        "prod" {
            Write-Log "Démarrage en mode production"
            Test-Prerequisites
            Install-Dependencies
            Start-Prod
        }
        "help" {
            Show-Help
        }
        default {
            Write-Log "Commande inconnue: $Command" "ERROR"
            Show-Help
            exit 1
        }
    }
}

# Exécution du script
Main
