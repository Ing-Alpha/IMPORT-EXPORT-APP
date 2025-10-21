import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTrackingId } from '@/lib/pdf'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const labels = await prisma.label.findMany({
      include: {
        client: true,
        user: true,
        packages: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(labels)
  } catch (error) {
    console.error('Erreur lors de la récupération des étiquettes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      clientId,
      senderName,
      senderCity,
      senderPhone,
      recipientName,
      recipientCity,
      recipientPhone,
      destination,
      weight,
      length,
      width,
      height,
      serviceCode,
      serviceType,
      cost,
      paymentStatus,
      packages = []
    } = body

    // Validation des données requises
    if (!clientId || !recipientName || !recipientCity || !destination) {
      return NextResponse.json(
        { error: 'Client, destinataire et destination sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que le client existe
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }

    // Générer un numéro de suivi unique
    const trackingId = generateTrackingId()

    // Créer l'étiquette
    const label = await prisma.label.create({
      data: {
        trackingId,
        clientId,
        userId: session.user.id,
        senderName: senderName || '',
        senderCity: senderCity || 'Marseille',
        senderPhone: senderPhone || '+33760248507',
        recipientName,
        recipientCity,
        recipientPhone: recipientPhone || '',
        destination,
        weight: weight || 1.0,
        length: length || 30,
        width: width || 20,
        height: height || 10,
        serviceCode: serviceCode || '1049.00',
        serviceType: serviceType || 'Sous 1 semaine | Colisso',
        cost,
        paymentStatus: paymentStatus || 'Payé',
        status: 'DRAFT'
      },
      include: {
        client: true,
        user: true,
        packages: true
      }
    })

    // Créer les colis associés si fournis
    if (packages.length > 0) {
      await prisma.package.createMany({
        data: packages.map((pkg: any) => ({
          labelId: label.id,
          description: pkg.description,
          weight: pkg.weight || 1.0,
          length: pkg.length || 30,
          width: pkg.width || 20,
          height: pkg.height || 10,
          value: pkg.value,
          contents: pkg.contents
        }))
      })

      // Recharger l'étiquette avec les colis
      const updatedLabel = await prisma.label.findUnique({
        where: { id: label.id },
        include: {
          client: true,
          user: true,
          packages: true
        }
      })

      return NextResponse.json(updatedLabel, { status: 201 })
    }

    return NextResponse.json(label, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'étiquette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}