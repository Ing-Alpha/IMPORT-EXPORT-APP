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

    const { id } = await params
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        labels: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error)
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

    const { id } = await params
    const body = await request.json()
    const { name, company, address, country, phone, email, notes } = body

    // Validation des champs requis
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom du client est requis et doit être une chaîne non vide' },
        { status: 400 }
      )
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'L\'adresse est requise et doit être une chaîne non vide' },
        { status: 400 }
      )
    }

    if (!country || typeof country !== 'string' || country.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le pays est requis et doit être une chaîne non vide' },
        { status: 400 }
      )
    }

    // Validation optionnelle de l'email
    if (email && typeof email === 'string' && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        )
      }
    }

    // Validation optionnelle du téléphone
    if (phone && typeof phone === 'string' && phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(phone.trim())) {
        return NextResponse.json(
          { error: 'Format de téléphone invalide' },
          { status: 400 }
        )
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: name.trim(),
        company: company?.trim() || null,
        address: address.trim(),
        country: country.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        notes: notes?.trim() || null
      }
    })

    console.log(`Client mis à jour avec succès: ${client.name} (ID: ${client.id}) par l'utilisateur ${session.user.email}`)

    return NextResponse.json({
      message: 'Client mis à jour avec succès',
      client
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error)
    
    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Client non trouvé' },
          { status: 404 }
        )
      }
      
      if (error.message.includes('Invalid input')) {
        return NextResponse.json(
          { error: 'Données invalides fournies' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la mise à jour du client' },
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

    const { id } = await params

    // Vérifier si le client existe avant de le supprimer
    const existingClient = await prisma.client.findUnique({
      where: { id },
      include: {
        labels: true
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des étiquettes associées
    if (existingClient.labels.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer ce client car il a des étiquettes associées' },
        { status: 409 }
      )
    }

    await prisma.client.delete({
      where: { id }
    })

    console.log(`Client supprimé avec succès: ${existingClient.name} (ID: ${id}) par l'utilisateur ${session.user.email}`)

    return NextResponse.json({ 
      message: 'Client supprimé avec succès',
      deletedClient: {
        id: existingClient.id,
        name: existingClient.name
      }
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error)
    
    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: 'Client non trouvé' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la suppression du client' },
      { status: 500 }
    )
  }
}
