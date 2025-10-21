import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json(label)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étiquette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: labelId } = await params
    const body = await request.json()

    // Vérifier que l'étiquette existe
    const existingLabel = await prisma.label.findUnique({
      where: { id: labelId }
    })

    if (!existingLabel) {
      return NextResponse.json(
        { error: 'Étiquette non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour l'étiquette
    const updatedLabel = await prisma.label.update({
      where: { id: labelId },
      data: {
        senderName: body.senderName,
        senderCity: body.senderCity,
        senderPhone: body.senderPhone,
        recipientName: body.recipientName,
        recipientCity: body.recipientCity,
        recipientPhone: body.recipientPhone,
        destination: body.destination,
        weight: body.weight,
        length: body.length,
        width: body.width,
        height: body.height,
        serviceCode: body.serviceCode,
        serviceType: body.serviceType,
        cost: body.cost,
        paymentStatus: body.paymentStatus,
        status: body.status || existingLabel.status
      },
      include: {
        client: true,
        user: true,
        packages: true
      }
    })

    return NextResponse.json(updatedLabel)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étiquette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: labelId } = await params

    // Vérifier que l'étiquette existe
    const existingLabel = await prisma.label.findUnique({
      where: { id: labelId }
    })

    if (!existingLabel) {
      return NextResponse.json(
        { error: 'Étiquette non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer l'étiquette (les colis seront supprimés automatiquement par cascade)
    await prisma.label.delete({
      where: { id: labelId }
    })

    return NextResponse.json({ message: 'Étiquette supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étiquette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}