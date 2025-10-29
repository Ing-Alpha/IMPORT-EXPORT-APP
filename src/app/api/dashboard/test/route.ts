import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Test API appelée')
    
    // Test de connexion à la base de données
    const clientCount = await prisma.client.count()
    const labelCount = await prisma.label.count()
    
    console.log('Clients trouvés:', clientCount)
    console.log('Étiquettes trouvées:', labelCount)
    
    // Générer des données de test
    const testData = {
      message: 'API de test fonctionnelle',
      database: {
        clients: clientCount,
        labels: labelCount,
        connected: true
      },
      stats: {
        totalClients: clientCount,
        totalLabels: labelCount,
        labelsThisMonth: Math.floor(labelCount * 0.3),
        clientsGrowth: 15,
        labelsGrowth: 25,
        revenue: labelCount * 25,
        revenueGrowth: 12
      },
      chartData: [
        { name: 'Jan', labels: 10, clients: 5, revenue: 500 },
        { name: 'Fév', labels: 15, clients: 8, revenue: 750 },
        { name: 'Mar', labels: 12, clients: 6, revenue: 600 },
        { name: 'Avr', labels: 20, clients: 10, revenue: 1000 },
        { name: 'Mai', labels: 18, clients: 9, revenue: 900 },
        { name: 'Juin', labels: 25, clients: 12, revenue: 1250 }
      ],
      statusData: [
        { name: 'Générée', value: Math.floor(labelCount * 0.4), color: '#0088FE' },
        { name: 'Expédiée', value: Math.floor(labelCount * 0.3), color: '#00C49F' },
        { name: 'Livrée', value: Math.floor(labelCount * 0.2), color: '#82ca9d' },
        { name: 'En attente', value: Math.floor(labelCount * 0.1), color: '#FFBB28' }
      ],
      activities: [
        {
          id: 'test-1',
          type: 'label',
          action: 'created',
          title: 'Étiquette FRA123ABC',
          description: 'Nouvelle étiquette créée',
          timestamp: new Date().toISOString(),
          color: 'bg-green-500'
        },
        {
          id: 'test-2',
          type: 'client',
          action: 'created',
          title: 'Client Test',
          description: 'Nouveau client ajouté',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          color: 'bg-blue-500'
        }
      ]
    }

    return NextResponse.json(testData)

  } catch (error) {
    console.error('Erreur dans l\'API de test:', error)
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
