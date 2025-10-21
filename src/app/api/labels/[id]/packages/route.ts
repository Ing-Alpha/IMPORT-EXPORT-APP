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

    const packages = await prisma.package.findMany({
      where: { labelId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error('Erreur lors de la récupération des colis:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const label = await prisma.label.findUnique({
      where: { id: labelId }
    })

    if (!label) {
      return NextResponse.json(
        { error: 'Étiquette non trouvée' },
        { status: 404 }
      )
    }

    // Créer le colis
    const newPackage = await prisma.package.create({
      data: {
        labelId,
        description: body.description,
        weight: body.weight || 1.0,
        length: body.length || 30,
        width: body.width || 20,
        height: body.height || 10,
        value: body.value,
        contents: body.contents
      }
    })

    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du colis:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}