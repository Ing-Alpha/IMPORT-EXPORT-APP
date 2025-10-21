import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        labels: {
          select: {
            id: true,
            trackingId: true,
            createdAt: true
          }
        }
      }
    })

    console.log(`Récupération de ${clients.length} clients par l'utilisateur ${session.user.email}`)

    return NextResponse.json({
      clients,
      count: clients.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la récupération des clients' },
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

    // Vérifier si un client avec le même nom existe déjà
    const existingClient = await prisma.client.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Un client avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Créer le client
    const client = await prisma.client.create({
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

    console.log(`Client créé avec succès: ${client.name} (ID: ${client.id}) par l'utilisateur ${session.user.email}`)

    return NextResponse.json({
      message: 'Client créé avec succès',
      client
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du client:', error)
    
    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Un client avec ces informations existe déjà' },
          { status: 409 }
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
      { error: 'Erreur interne du serveur lors de la création du client' },
      { status: 500 }
    )
  }
}
