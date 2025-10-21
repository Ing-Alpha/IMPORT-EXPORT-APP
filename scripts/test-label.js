// Script de test pour générer une étiquette de démonstration
const { PrismaClient } = require('@prisma/client')
const { generateTrackingId } = require('../src/lib/pdf.ts')

const prisma = new PrismaClient()

async function createTestLabel() {
  try {
    // Trouver un client existant ou créer un client de test
    let client = await prisma.client.findFirst()
    
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: 'Client Test',
          company: 'Société Test',
          address: '123 Rue de Test',
          country: 'France',
          phone: '+33123456789',
          email: 'test@example.com'
        }
      })
    }

    // Trouver un utilisateur existant
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('Aucun utilisateur trouvé. Veuillez créer un utilisateur d\'abord.')
      return
    }

    // Créer une étiquette de test
    const trackingId = generateTrackingId()
    
    const label = await prisma.label.create({
      data: {
        trackingId,
        clientId: client.id,
        userId: user.id,
        senderName: 'Cellou Barry',
        senderCity: 'Marseille',
        senderPhone: '+33753786904',
        recipientName: 'Mawiatou Diallo',
        recipientCity: 'Conakry',
        recipientPhone: '+224610674667',
        destination: 'Guinée - Matoto',
        weight: 1.0,
        length: 30,
        width: 20,
        height: 10,
        serviceCode: '1049.00',
        serviceType: 'Sous 1 semaine | Colisso',
        cost: 25.00,
        paymentStatus: 'Payé'
      }
    })

    console.log('Étiquette de test créée avec succès:')
    console.log(`ID: ${label.id}`)
    console.log(`Numéro de suivi: ${label.trackingId}`)
    console.log(`Client: ${client.name}`)
    console.log(`Expéditeur: ${label.senderName}`)
    console.log(`Destinataire: ${label.recipientName}`)
    console.log(`Destination: ${label.destination}`)
    console.log(`Poids: ${label.weight} kg`)
    console.log(`Dimensions: ${label.length}x${label.width}x${label.height} cm`)
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'étiquette de test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestLabel()
