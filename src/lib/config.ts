export const APP_CONFIG = {
  // Configuration de l'application
  name: 'Import Export',
  description: 'Application de gestion des étiquettes d\'expédition',
  version: '1.0.0',
  
  // Configuration de l'authentification
  auth: {
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
    passwordMinLength: 8,
  },
  
  // Configuration des étiquettes
  labels: {
    pdfSize: {
      width: 400,
      height: 300,
    },
    trackingIdPrefix: 'EXP',
    barcodeHeight: 30,
  },
  
  // Configuration de la pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  
  // Configuration des notifications
  notifications: {
    defaultDuration: 5000, // 5 secondes
    maxNotifications: 5,
  },
  
  // Configuration des fichiers
  files: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    allowedDocumentTypes: ['application/pdf'],
  },
  
  // Configuration des rôles
  roles: {
    USER: 'USER',
    ADMIN: 'ADMIN',
  },
  
  // Configuration des pays (liste simplifiée)
  countries: [
    'France',
    'Allemagne',
    'Espagne',
    'Italie',
    'Royaume-Uni',
    'Belgique',
    'Suisse',
    'Canada',
    'États-Unis',
    'Chine',
    'Japon',
    'Brésil',
    'Australie',
    'Autre',
  ],
  
  // Configuration des devises
  currencies: [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar américain' },
    { code: 'GBP', symbol: '£', name: 'Livre sterling' },
    { code: 'CHF', symbol: 'CHF', name: 'Franc suisse' },
    { code: 'CAD', symbol: 'C$', name: 'Dollar canadien' },
    { code: 'GNF', symbol: 'FG', name: 'Franc guinéen' },
  ],
  
  // Configuration des thèmes
  themes: {
    light: 'light',
    dark: 'dark',
    system: 'system',
  },
  
  // Configuration des API
  api: {
    timeout: 30000, // 30 secondes
    retryAttempts: 3,
  },
} as const

export type AppConfig = typeof APP_CONFIG
export type Role = keyof typeof APP_CONFIG.roles
export type Theme = keyof typeof APP_CONFIG.themes
export type Country = typeof APP_CONFIG.countries[number]
export type Currency = typeof APP_CONFIG.currencies[number]
