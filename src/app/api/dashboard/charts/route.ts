import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Générer les 6 derniers mois
    const months = []
    const currentDate = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1)
      
      months.push({
        name: monthDate.toLocaleDateString('fr-FR', { month: 'short' }),
        startDate: monthDate,
        endDate: nextMonthDate,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth()
      })
    }

    // Récupérer les données pour chaque mois
    const chartData = await Promise.all(
      months.map(async (month) => {
        // Labels pour ce mois
        const labels = await prisma.label.count({
          where: {
            userId,
            createdAt: {
              gte: month.startDate,
              lt: month.endDate
            }
          }
        })

        // Clients pour ce mois (avec étiquettes créées par cet utilisateur)
        const clients = await prisma.client.count({
          where: {
            labels: {
              some: {
                userId: userId
              }
            },
            createdAt: {
              gte: month.startDate,
              lt: month.endDate
            }
          }
        })

        // Chiffre d'affaires pour ce mois
        const labelsWithCost = await prisma.label.findMany({
          where: {
            userId,
            createdAt: {
              gte: month.startDate,
              lt: month.endDate
            }
          },
          select: { cost: true }
        })

        const revenue = labelsWithCost.reduce((sum, label) => sum + (label.cost || 0), 0)

        return {
          name: month.name,
          labels,
          clients,
          revenue
        }
      })
    )

    return NextResponse.json({ chartData })

  } catch (error) {
    console.error('Erreur lors de la récupération des données de graphiques:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
