import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { generateSimpleTrackingQRCode } from './qrcode'

export interface PackageData {
  description: string
  weight: number
  length: number
  width: number
  height: number
  value?: number
  contents: string
}

export interface LabelData {
  trackingId: string
  senderName: string
  senderCity: string
  senderPhone: string
  recipientName: string
  recipientCity: string
  recipientPhone: string
  destination: string
  weight: number
  length: number
  width: number
  height: number
  serviceCode: string
  serviceType: string
  cost?: number
  paymentStatus: string
  generatedDate: string
  packages?: PackageData[]
}

export async function generateLabelPDF(data: LabelData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([400, 600]) // Format plus grand pour accommoder les colis multiples
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const { width, height } = page.getSize()
  
  // Header - Logo et nom de l'entreprise
  page.drawText('colisso.fr', {
    x: 20,
    y: height - 30,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('Colisso Multiservice', {
    x: 80,
    y: height - 30,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('FRA, Marseille, 13001', {
    x: 80,
    y: height - 45,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('Téléphone: +33760248507', {
    x: 80,
    y: height - 58,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // Code-barres simulé
  page.drawRectangle({
    x: 20,
    y: height - 100,
    width: width - 40,
    height: 40,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  })
  
  page.drawText(data.trackingId, {
    x: width/2 - (data.trackingId.length * 3),
    y: height - 88,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.trackingId, {
    x: width/2 - (data.trackingId.length * 6),
    y: height - 115,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // QR Code réel
  try {
    const qrCodeDataURL = await generateSimpleTrackingQRCode(data.trackingId)
    const qrImage = await pdfDoc.embedPng(qrCodeDataURL)
    
    const qrSize = 60
    const qrX = width - qrSize - 20
    const qrY = height - 100 - qrSize

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    })
  } catch (error) {
    console.error('Erreur lors de la génération du QR Code:', error)
    // Fallback vers QR Code simulé en cas d'erreur
    const qrSize = 60
    const qrX = width - qrSize - 20
    const qrY = height - 100 - qrSize

    page.drawRectangle({
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
      color: rgb(0, 0, 0),
    })

    // Grille simulée pour le QR Code
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          page.drawRectangle({
            x: qrX + (i * qrSize / 8),
            y: qrY + (j * qrSize / 8),
            width: qrSize / 8,
            height: qrSize / 8,
            color: rgb(0.9, 0.9, 0.9),
          })
        }
      }
    }
  }
  
  let yPos = height - 140
  
  // Référence du paquet
  page.drawText('RÉFÉRENCE DU PAQUET:', {
    x: 20,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  const packageInfo = `Date: ${data.generatedDate.split(' ')[0]} | Code service: ${data.serviceCode} | Poids: ${data.weight} kg | Coût: ${data.cost || 'N/A'}`
  page.drawText(packageInfo, {
    x: 20,
    y: yPos,
    size: 9,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  page.drawText(`Longueur: ${data.length} Largeur: ${data.width} Hauteur: ${data.height}`, {
    x: 20,
    y: yPos,
    size: 9,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 25
  
  // Référence du service
  page.drawText('RÉFÉRENCE DU SERVICE', {
    x: 20,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  page.drawText(data.serviceType, {
    x: 20,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 30
  
  // Statut paiement
  page.drawText('Statut paiement', {
    x: width/2 - 30,
    y: yPos,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 25
  
  // Boîte verte pour "Payé"
  page.drawRectangle({
    x: width/2 - 25,
    y: yPos - 20,
    width: 50,
    height: 20,
    color: rgb(0, 0.5, 0),
  })
  
  page.drawText(data.paymentStatus, {
    x: width/2 - 8,
    y: yPos - 12,
    size: 10,
    font: boldFont,
    color: rgb(1, 1, 1),
  })
  
  yPos -= 50
  
  // Destination
  page.drawText(data.destination, {
    x: width/2 - (data.destination.length * 3),
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 25
  
  // Numéro de téléphone du destinataire
  page.drawText(data.recipientPhone, {
    x: width/2 - (data.recipientPhone.length * 4),
    y: yPos,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 40
  
  // Section expéditeur/destinataire
  page.drawText('Expéditeur', {
    x: 20,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('Destinataire', {
    x: 160,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  page.drawText(data.senderName, {
    x: 20,
    y: yPos,
    size: 11,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.recipientName, {
    x: 160,
    y: yPos,
    size: 11,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  page.drawText(data.senderCity, {
    x: 20,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.recipientCity, {
    x: 160,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 15
  
  page.drawText(data.senderPhone, {
    x: 20,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.recipientPhone, {
    x: 160,
    y: yPos,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 30
  
  // Section des colis multiples
  if (data.packages && data.packages.length > 0) {
    page.drawText('DÉTAIL DES COLIS:', {
      x: 20,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    
    yPos -= 20
    
    data.packages.forEach((pkg, index) => {
      if (yPos < 50) return // Éviter de dépasser la page
      
      page.drawText(`Colis ${index + 1}:`, {
        x: 20,
        y: yPos,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      
      yPos -= 15
      
      if (pkg.description) {
        page.drawText(`Description: ${pkg.description}`, {
          x: 30,
          y: yPos,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        })
        yPos -= 12
      }
      
      page.drawText(`Poids: ${pkg.weight}kg | Dimensions: ${pkg.length}x${pkg.width}x${pkg.height}cm`, {
        x: 30,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      })
      
      if (pkg.value) {
        yPos -= 12
        page.drawText(`Valeur: ${pkg.value}€`, {
          x: 30,
          y: yPos,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        })
      }
      
      yPos -= 20
    })
  }
  
  // QR Code simulé (rectangle avec texte)
  const qrSize = 60
  const qrX = width - qrSize - 20
  const qrY = 20
  
  page.drawRectangle({
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  })
  
  page.drawText('QR', {
    x: qrX + qrSize/2 - 5,
    y: qrY + qrSize/2 - 5,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('Code', {
    x: qrX + qrSize/2 - 8,
    y: qrY + qrSize/2 - 15,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  return await pdfDoc.save()
}

export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `FRA${random.toUpperCase()}`
}
