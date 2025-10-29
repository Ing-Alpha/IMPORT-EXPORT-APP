import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { translateStatus } from '@/lib/status-translations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les 10 dernières activités
    const [recentLabels, recentClients] = await Promise.all([
      // Dernières étiquettes créées/modifiées
      prisma.label.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          trackingId: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              name: true
            }
          }
        }
      }),
      
      // Derniers clients créés (avec étiquettes créées par cet utilisateur)
      prisma.client.findMany({
        where: {
          labels: {
            some: {
              userId: userId
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      })
    ])

    // Combiner et formater les activités
    const activities: Array<{
      id: string
      type: string
      action: string
      title: string
      description: string
      timestamp: Date
      status?: string
      color: string
    }> = []

    // Ajouter les étiquettes
    recentLabels.forEach((label) => {
      activities.push({
        id: `label-${label.id}`,
        type: 'label',
        action: label.createdAt.getTime() === label.updatedAt.getTime() ? 'created' : 'updated',
        title: `Étiquette ${label.trackingId}`,
        description: label.createdAt.getTime() === label.updatedAt.getTime() 
          ? `Nouvelle étiquette pour ${label.client?.name || 'Client inconnu'}`
          : `Étiquette mise à jour pour ${label.client?.name || 'Client inconnu'}`,
        timestamp: label.updatedAt,
        status: translateStatus(label.status),
        color: getActivityColor('label', label.createdAt.getTime() === label.updatedAt.getTime() ? 'created' : 'updated')
      })
    })

    // Ajouter les clients
    recentClients.forEach((client) => {
      activities.push({
        id: `client-${client.id}`,
        type: 'client',
        action: 'created',
        title: `Client ${client.name}`,
        description: `Nouveau client ajouté`,
        timestamp: client.createdAt,
        color: getActivityColor('client', 'created')
      })
    })

    // Trier par timestamp et prendre les 10 plus récents
    const sortedActivities = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return NextResponse.json({ activities: sortedActivities })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité récente:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

function getActivityColor(type: string, action: string): string {
  if (type === 'label') {
    return action === 'created' ? 'bg-green-500' : 'bg-blue-500'
  }
  if (type === 'client') {
    return 'bg-purple-500'
  }
  return 'bg-gray-500'
}
