#!/bin/bash

# Script de démarrage pour l'application Import-Export
# Usage: ./start.sh [dev|prod|setup]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    if ! command_exists node; then
        error "Node.js n'est pas installé. Veuillez installer Node.js 18+"
        exit 1
    fi
    
    if ! command_exists npm; then
        error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier la version de Node.js
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ requis. Version actuelle: $(node -v)"
        exit 1
    fi
    
    log "Prérequis vérifiés ✓"
}

# Fonction pour installer les dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        log "Dépendances déjà installées"
    fi
}

# Fonction pour configurer l'environnement
setup_environment() {
    log "Configuration de l'environnement..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            warn "Fichier .env.local créé à partir de .env.example"
            warn "Veuillez configurer vos variables d'environnement dans .env.local"
        else
            error "Fichier .env.example non trouvé"
            exit 1
        fi
    else
        log "Fichier .env.local existe déjà"
    fi
}

# Fonction pour configurer la base de données
setup_database() {
    log "Configuration de la base de données..."
    
    # Générer le client Prisma
    npx prisma generate
    
    # Appliquer les migrations
    log "Application des migrations..."
    npx prisma migrate dev --name init
    
    # Peupler la base de données
    log "Peuplement de la base de données..."
    npx prisma db seed
    
    log "Base de données configurée ✓"
}

# Fonction pour démarrer en mode développement
start_dev() {
    log "Démarrage en mode développement..."
    npm run dev
}

# Fonction pour démarrer en mode production
start_prod() {
    log "Build de l'application..."
    npm run build
    
    log "Démarrage en mode production..."
    npm run start
}

# Fonction pour afficher l'aide
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev     Démarrer en mode développement"
    echo "  prod    Démarrer en mode production"
    echo "  setup   Configuration complète de l'application"
    echo "  help    Afficher cette aide"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Configuration complète"
    echo "  $0 dev      # Démarrage développement"
    echo "  $0 prod     # Démarrage production"
}

# Fonction principale
main() {
    case "${1:-dev}" in
        "setup")
            log "Configuration complète de l'application Import-Export"
            check_prerequisites
            install_dependencies
            setup_environment
            setup_database
            log "Configuration terminée ! Vous pouvez maintenant démarrer avec: $0 dev"
            ;;
        "dev")
            log "Démarrage en mode développement"
            check_prerequisites
            install_dependencies
            start_dev
            ;;
        "prod")
            log "Démarrage en mode production"
            check_prerequisites
            install_dependencies
            start_prod
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Commande inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Exécution du script
main "$@"
