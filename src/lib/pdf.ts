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
  const page = pdfDoc.addPage([400, 600]) // Format A5 adapté pour l'étiquette
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const { width, height } = page.getSize()
  
  // ========================================
  // 1. EN-TÊTE DE L'ENTREPRISE
  // ========================================
  // page.drawText('colisso.fr', {
  //   x: 20,
  //   y: height - 30,
  //   size: 12,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })
  
  page.drawText(data.senderName, {
    x: 80,
    y: height - 30,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.senderCity, {
    x: 80,
    y: height - 45,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.senderPhone, {
    x: 80,
    y: height - 58,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // ========================================
  // 2. CODE-BARRES ET NUMÉRO DE SUIVI
  // ========================================
  const barcodeHeight = 50
  const barcodeY = height - 130
  
  // Fond du code-barres
  page.drawRectangle({
    x: 20,
    y: barcodeY,
    width: width - 140, // Réduit pour laisser place au QR Code
    height: barcodeHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  })
  
  // Génération du motif de code-barres
  const barWidth = (width - 164) / 40 // 40 barres au lieu de 50
  for (let i = 0; i < 40; i++) {
    const x = 22 + (i * barWidth)
    if (i % 2 === 0) {
      page.drawRectangle({
        x: x,
        y: barcodeY + 5,
        width: barWidth,
        height: barcodeHeight - 10,
        color: rgb(0, 0, 0),
      })
    }
  }
  
  // Numéro de suivi en petit sous le code-barres
  page.drawText(data.trackingId, {
    x: 20,
    y: barcodeY - 15,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // Numéro de suivi en grand en dessous
  page.drawText(data.trackingId, {
    x: 20,
    y: barcodeY - 35,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // ========================================
  // 3. QR CODE
  // ========================================
  try {
    const qrCodeDataURL = await generateSimpleTrackingQRCode(data.trackingId)
    const qrImage = await pdfDoc.embedPng(qrCodeDataURL)
    
    const qrSize = 60
    const qrX = width - qrSize - 20
    const qrY = barcodeY

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
    const qrY = barcodeY

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
  
  // ========================================
  // 4. INFORMATIONS DU PAQUET (CONDENSÉES)
  // ========================================
  let yPos = barcodeY - 65
  
  // Informations condensées sur 2 colonnes
  // Colonne gauche
  page.drawText(`Date: ${data.generatedDate.split(' ')[0]}`, {
    x: 20,
    y: yPos,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(`Service: ${data.serviceCode}`, {
    x: 20,
    y: yPos - 10,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(`Poids: ${data.weight}kg`, {
    x: 20,
    y: yPos - 20,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // Colonne droite
  page.drawText(`${data.length}x${data.width}x${data.height}cm`, {
    x: 150,
    y: yPos,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(`Coût: ${data.cost || 'N/A'}€`, {
    x: 150,
    y: yPos - 10,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.serviceType, {
    x: 150,
    y: yPos - 20,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // ========================================
  // 5. STATUT DE PAIEMENT
  // ========================================
  yPos -= 35
  
  page.drawText('Statut paiement', {
    x: width/2 - 30,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 20
  
  // Badge vert "Payé"
  page.drawRectangle({
    x: width/2 - 20,
    y: yPos - 15,
    width: 40,
    height: 15,
    color: rgb(0, 0.6, 0), // Vert foncé
  })
  
  page.drawText('Payé', {
    x: width/2 - 8,
    y: yPos - 8,
    size: 8,
    font: boldFont,
    color: rgb(1, 1, 1), // Texte blanc
  })
  
  // ========================================
  // 6. DESTINATION ET CONTACT
  // ========================================
  yPos -= 40
  
  // Destination principale
  page.drawText(data.destination, {
    x: width/2 - (data.destination.length * 2),
    y: yPos,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 20
  
  // Téléphone destinataire
  page.drawText(data.recipientPhone, {
    x: width/2 - (data.recipientPhone.length * 3),
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  // ========================================
  // 7. INFORMATIONS EXPÉDITEUR/DESTINATAIRE (COMPACT)
  // ========================================
  yPos -= 35
  
  // En-têtes des colonnes
  page.drawText('Expéditeur', {
    x: 20,
    y: yPos,
    size: 8,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  page.drawText('Destinataire', {
    x: 180,
    y: yPos,
    size: 8,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 12
  
  // Noms
  page.drawText(data.senderName, {
    x: 20,
    y: yPos,
    size: 9,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(data.recipientName, {
    x: 180,
    y: yPos,
    size: 9,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPos -= 10
  
  // Villes et téléphones sur une ligne
  page.drawText(`${data.senderCity} - ${data.senderPhone}`, {
    x: 20,
    y: yPos,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  page.drawText(`${data.recipientCity} - ${data.recipientPhone}`, {
    x: 180,
    y: yPos,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  })
  
  // ========================================
  // 8. COLIS MULTIPLES (OPTIONNEL - COMPACT)
  // ========================================
  yPos -= 25
  
  if (data.packages && data.packages.length > 0) {
    page.drawText('COLIS:', {
      x: 20,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    
    yPos -= 15
    
    data.packages.forEach((pkg, index) => {
      if (yPos < 30) return // Éviter de dépasser la page
      
      // Informations condensées sur une ligne
      const packageInfo = `${index + 1}. ${pkg.weight}kg ${pkg.length}x${pkg.width}x${pkg.height}cm ${pkg.value ? `${pkg.value}€` : ''}`
      
      page.drawText(packageInfo, {
        x: 20,
        y: yPos,
        size: 8,
        font: font,
        color: rgb(0, 0, 0),
      })
      
      yPos -= 12
    })
  }
  
  return await pdfDoc.save()
}

export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `FRA${random.toUpperCase()}`
}
