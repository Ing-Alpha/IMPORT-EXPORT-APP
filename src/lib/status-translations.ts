/**
 * Traductions des statuts d'étiquettes en français
 */

export const STATUS_TRANSLATIONS: { [key: string]: string } = {
  'DRAFT': 'Brouillon',
  'PENDING': 'En attente', 
  'GENERATED': 'Générée',
  'SHIPPED': 'Expédiée',
  'DELIVERED': 'Livrée',
  'CANCELLED': 'Annulée'
}

export const STATUS_COLORS: { [key: string]: string } = {
  'DRAFT': '#8884d8',
  'PENDING': '#FFBB28',
  'GENERATED': '#0088FE',
  'SHIPPED': '#00C49F',
  'DELIVERED': '#82ca9d',
  'CANCELLED': '#FF8042'
}

/**
 * Traduit un statut anglais vers le français
 */
export function translateStatus(status: string): string {
  return STATUS_TRANSLATIONS[status] || status
}

/**
 * Récupère la couleur associée à un statut
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#8884d8'
}

/**
 * Récupère tous les statuts traduits avec leurs couleurs
 */
export function getAllStatusesWithColors() {
  return Object.keys(STATUS_TRANSLATIONS).map(key => ({
    key,
    label: STATUS_TRANSLATIONS[key],
    color: STATUS_COLORS[key]
  }))
}
