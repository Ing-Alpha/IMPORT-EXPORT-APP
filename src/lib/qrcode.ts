import QRCode from 'qrcode'

/**
 * Génère un QR Code à partir d'un texte
 * @param text - Le texte à encoder dans le QR Code
 * @param options - Options pour la génération du QR Code
 * @returns Promise<string> - L'URL de l'image du QR Code (base64)
 */
export async function generateQRCode(
  text: string, 
  options: {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  } = {}
): Promise<string> {
  const defaultOptions = {
    width: options.width || 200,
    margin: options.margin || 2,
    color: {
      dark: options.color?.dark || '#000000',
      light: options.color?.light || '#FFFFFF'
    },
    errorCorrectionLevel: 'M' as const,
    type: 'image/png' as const,
    quality: 0.92,
    rendererOpts: {
      quality: 0.92
    }
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, defaultOptions)
    return qrCodeDataURL
  } catch (error) {
    console.error('Erreur lors de la génération du QR Code:', error)
    throw new Error('Impossible de générer le QR Code')
  }
}

/**
 * Génère un QR Code pour un numéro de suivi d'étiquette
 * @param trackingId - Le numéro de suivi de l'étiquette
 * @param baseUrl - L'URL de base de l'application (optionnel)
 * @returns Promise<string> - L'URL de l'image du QR Code
 */
export async function generateTrackingQRCode(
  trackingId: string, 
  baseUrl: string = 'https://import-export-marseille.com'
): Promise<string> {
  // Créer une URL de suivi pour le QR Code
  const trackingUrl = `${baseUrl}/track/${trackingId}`
  
  return generateQRCode(trackingUrl, {
    width: 150,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })
}

/**
 * Génère un QR Code simple avec juste le numéro de suivi
 * @param trackingId - Le numéro de suivi
 * @returns Promise<string> - L'URL de l'image du QR Code
 */
export async function generateSimpleTrackingQRCode(trackingId: string): Promise<string> {
  return generateQRCode(trackingId, {
    width: 150,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })
}
