import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; packageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { packageId } = await params

    const package_ = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        label: {
          include: {
            client: true,
            user: true
          }
        }
      }
    })

    if (!package_) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(package_)
  } catch (error) {
    console.error('Erreur lors de la récupération du colis:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; packageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { packageId } = await params
    const body = await request.json()

    // Vérifier que le colis existe
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le colis
    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        description: body.description,
        weight: body.weight,
        length: body.length,
        width: body.width,
        height: body.height,
        value: body.value,
        contents: body.contents
      }
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du colis:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; packageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { packageId } = await params

    // Vérifier que le colis existe
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le colis
    await prisma.package.delete({
      where: { id: packageId }
    })

    return NextResponse.json({ message: 'Colis supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du colis:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
