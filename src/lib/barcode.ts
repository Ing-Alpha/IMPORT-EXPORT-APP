/**
 * Fonction utilitaire pour générer des codes-barres
 * Note: JSBarcode est principalement conçu pour le frontend
 * Pour le backend, nous utiliserons une approche alternative
 */

export interface BarcodeOptions {
  width?: number
  height?: number
  format?: string
  displayValue?: boolean
  fontSize?: number
  textAlign?: string
  textPosition?: string
  textMargin?: number
  background?: string
  lineColor?: string
}

/**
 * Génère un code-barres simple en ASCII art (pour le backend)
 * @param data - Les données à encoder
 * @param options - Options de formatage
 * @returns Représentation ASCII du code-barres
 */
export function generateSimpleBarcode(data: string, options: BarcodeOptions = {}): string {
  const width = options.width || 100
  const height = options.height || 20
  
  // Génération d'un motif simple basé sur les données
  let pattern = ''
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    pattern += char % 2 === 0 ? '█' : '▓'
  }
  
  // Répétition pour créer la largeur désirée
  const fullPattern = pattern.repeat(Math.ceil(width / pattern.length))
  
  return fullPattern.substring(0, width)
}

/**
 * Génère un code-barres en base64 pour l'intégration dans les PDFs
 * @param data - Les données à encoder
 * @param options - Options de formatage
 * @returns Data URL du code-barres
 */
export async function generateBarcodeBase64(data: string, options: BarcodeOptions = {}): Promise<string> {
  // Pour le moment, nous retournons une image simple
  // Dans une vraie implémentation, vous utiliseriez une bibliothèque comme bwip-js
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Impossible de créer le contexte canvas')
  }
  
  const width = options.width || 200
  const height = options.height || 50
  
  canvas.width = width
  canvas.height = height
  
  // Fond blanc
  ctx.fillStyle = options.background || '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  
  // Génération du motif de code-barres
  ctx.fillStyle = options.lineColor || '#000000'
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    const barWidth = Math.max(1, width / (data.length * 3))
    const x = (i * width) / data.length
    
    if (char % 2 === 0) {
      ctx.fillRect(x, 0, barWidth, height * 0.7)
    }
  }
  
  // Ajout du texte en bas
  if (options.displayValue !== false) {
    ctx.fillStyle = '#000000'
    ctx.font = `${options.fontSize || 12}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(data, width / 2, height - 5)
  }
  
  return canvas.toDataURL('image/png')
}

/**
 * Génère un code-barres pour le numéro de suivi
 * @param trackingId - Le numéro de suivi
 * @returns Data URL du code-barres
 */
export async function generateTrackingBarcode(trackingId: string): Promise<string> {
  return generateBarcodeBase64(trackingId, {
    width: 200,
    height: 50,
    displayValue: true,
    fontSize: 12,
    background: '#FFFFFF',
    lineColor: '#000000'
  })
}
