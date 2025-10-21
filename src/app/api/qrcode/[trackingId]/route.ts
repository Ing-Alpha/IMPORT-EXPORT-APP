import { NextRequest, NextResponse } from 'next/server'
import { generateSimpleTrackingQRCode } from '@/lib/qrcode'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params

    if (!trackingId) {
      return NextResponse.json(
        { error: 'Numéro de suivi requis' },
        { status: 400 }
      )
    }

    // Générer le QR Code
    const qrCodeDataURL = await generateSimpleTrackingQRCode(trackingId)

    // Extraire les données base64 du QR Code
    const base64Data = qrCodeDataURL.split(',')[1]

    // Retourner l'image PNG
    return new Response(Buffer.from(base64Data, 'base64'), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache pendant 1 heure
      },
    })
  } catch (error) {
    console.error('Erreur lors de la génération du QR Code:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
