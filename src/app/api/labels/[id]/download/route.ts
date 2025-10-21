import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateLabelPDF, LabelData } from '@/lib/pdf'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: labelId } = await params

    // Récupérer l'étiquette avec toutes ses données
    const label = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        client: true,
        user: true,
        packages: true
      }
    })

    if (!label) {
      return NextResponse.json(
        { error: 'Étiquette non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut de l'étiquette
    await prisma.label.update({
      where: { id: labelId },
      data: { status: 'GENERATED' }
    })

    // Préparer les données pour le PDF
    const labelData: LabelData = {
      trackingId: label.trackingId,
      senderName: label.senderName,
      senderCity: label.senderCity,
      senderPhone: label.senderPhone,
      recipientName: label.recipientName,
      recipientCity: label.recipientCity,
      recipientPhone: label.recipientPhone,
      destination: label.destination,
      weight: label.weight,
      length: label.length,
      width: label.width,
      height: label.height,
      serviceCode: label.serviceCode,
      serviceType: label.serviceType,
      cost: label.cost || undefined,
      paymentStatus: label.paymentStatus,
      generatedDate: label.createdAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      packages: label.packages.map(pkg => ({
        description: pkg.description || '',
        weight: pkg.weight,
        length: pkg.length,
        width: pkg.width,
        height: pkg.height,
        value: pkg.value,
        contents: pkg.contents || ''
      }))
    }

    // Générer le PDF
    const pdfBytes = await generateLabelPDF(labelData)

    // Retourner le PDF
    return new Response(pdfBytes as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="etiquette-${label.trackingId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}