import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { translateStatus, getStatusColor } from '@/lib/status-translations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les statistiques de base
    const [
      totalClients,
      totalLabels,
      labelsThisMonth,
      clientsThisMonth,
      labelsLastMonth,
      clientsLastMonth
    ] = await Promise.all([
      // Total clients (avec étiquettes créées par cet utilisateur)
      prisma.client.count({
        where: {
          labels: {
            some: {
              userId: userId
            }
          }
        }
      }),
      
      // Total labels
      prisma.label.count({
        where: { userId }
      }),
      
      // Labels ce mois
      prisma.label.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      }),
      
      // Clients ce mois (avec étiquettes créées par cet utilisateur)
      prisma.client.count({
        where: {
          labels: {
            some: {
              userId: userId
            }
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      }),
      
      // Labels mois dernier
      prisma.label.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Clients mois dernier (avec étiquettes créées par cet utilisateur)
      prisma.client.count({
        where: {
          labels: {
            some: {
              userId: userId
            }
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    // Calculer les pourcentages de croissance
    const clientsGrowth = clientsLastMonth > 0 
      ? Math.round(((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100)
      : clientsThisMonth > 0 ? 100 : 0

    const labelsGrowth = labelsLastMonth > 0 
      ? Math.round(((labelsThisMonth - labelsLastMonth) / labelsLastMonth) * 100)
      : labelsThisMonth > 0 ? 100 : 0

    // Calculer le chiffre d'affaires (simulation basée sur les labels)
    const labelsWithCost = await prisma.label.findMany({
      where: { userId },
      select: { cost: true }
    })

    const revenue = labelsWithCost.reduce((sum, label) => sum + (label.cost || 0), 0)
    
    // Calculer la croissance du chiffre d'affaires (simulation)
    const revenueGrowth = Math.floor(Math.random() * 30) - 15 // Simulation pour l'instant

    // Récupérer les statuts des étiquettes
    const labelStatuses = await prisma.label.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    })

    const statusData = labelStatuses.map(item => ({
      name: translateStatus(item.status),
      value: item._count.status,
      color: getStatusColor(item.status)
    }))

    return NextResponse.json({
      stats: {
        totalClients,
        totalLabels,
        labelsThisMonth,
        clientsGrowth,
        labelsGrowth,
        revenue,
        revenueGrowth
      },
      statusData
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

