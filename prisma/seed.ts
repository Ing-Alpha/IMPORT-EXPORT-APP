import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur admin par défaut
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrateur',
      email: 'admin@example.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4Qz8K2K', // password: admin123
      role: 'ADMIN'
    }
  })

  // Créer quelques clients d'exemple
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client-1' },
      update: {},
      create: {
        id: 'client-1',
        name: 'Jean Dupont',
        company: 'Entreprise SARL',
        address: '123 Rue de la Paix, 75001 Paris',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        email: 'jean.dupont@entreprise.com',
        notes: 'Client VIP - Livraison prioritaire'
      }
    }),
    prisma.client.upsert({
      where: { id: 'client-2' },
      update: {},
      create: {
        id: 'client-2',
        name: 'Marie Martin',
        company: 'Société ABC',
        address: '456 Avenue des Champs, 69000 Lyon',
        country: 'France',
        phone: '+33 4 56 78 90 12',
        email: 'marie.martin@societe-abc.fr'
      }
    }),
    prisma.client.upsert({
      where: { id: 'client-3' },
      update: {},
      create: {
        id: 'client-3',
        name: 'Pierre Durand',
        address: '789 Boulevard Central, 13000 Marseille',
        country: 'France',
        phone: '+33 4 91 23 45 67',
        email: 'pierre.durand@email.com',
        notes: 'Livraison uniquement le matin'
      }
    })
  ])

  console.log('Seed terminé avec succès!')
  console.log('Utilisateur admin créé:', adminUser.email)
  console.log('Clients créés:', clients.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
