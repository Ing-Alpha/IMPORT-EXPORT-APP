import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 🔐 IDENTIFIANTS DE CONNEXION DISPONIBLES APRÈS LE SEED :
 * 
 * 1. Compte Admin Principal:
 *    📧 Email: admin@colisso.fr
 *    🔑 Mot de passe: admin123
 *    👤 Rôle: ADMIN
 * 
 * 2. Compte de Test Simple:
 *    📧 Email: test@test.com  
 *    🔑 Mot de passe: admin123
 *    👤 Rôle: ADMIN
 * 
 * 3. Gestionnaire:
 *    📧 Email: sophie.manager@colisso.fr
 *    🔑 Mot de passe: password
 *    👤 Rôle: MANAGER
 * 
 * 4. Utilisateurs normaux:
 *    📧 Email: julien.operateur@colisso.fr
 *    🔑 Mot de passe: admin123
 *    👤 Rôle: USER
 * 
 *    📧 Email: marie.expeditrice@colisso.fr  
 *    🔑 Mot de passe: admin123
 *    👤 Rôle: USER
 */

async function main() {
  console.log('🌱 Début du seeding de la base de données...')

  // =====================
  // UTILISATEURS
  // =====================
  console.log('👥 Création des utilisateurs...')
  console.log('')
  console.log('🔐 Identifiants de test disponibles :')
  console.log('1. admin@colisso.fr / admin123 (ADMIN)')
  console.log('2. test@test.com / admin123 (ADMIN - Simple)')
  console.log('3. sophie.manager@colisso.fr / password (MANAGER)')
  console.log('4. julien.operateur@colisso.fr / admin123 (USER)')
  console.log('5. marie.expeditrice@colisso.fr / admin123 (USER)')
  console.log('')
  
  const users = await Promise.all([
    // Administrateur
    prisma.user.upsert({
      where: { email: 'admin@colisso.fr' },
      update: {
        name: 'Admin Colisso',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'ADMIN'
      },
      create: {
        name: 'Admin Colisso',
        email: 'admin@colisso.fr',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'ADMIN'
      }
    }),
    
    // Compte de test simple
    prisma.user.upsert({
      where: { email: 'test@test.com' },
      update: {
        name: 'Utilisateur Test',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'ADMIN'
      },
    create: {
        name: 'Utilisateur Test',
        email: 'test@test.com',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
      role: 'ADMIN'
    }
    }),
    
    // Gestionnaires
    prisma.user.upsert({
      where: { email: 'sophie.manager@colisso.fr' },
      update: {
        name: 'Sophie Dubois',
        password: '$2b$12$YmPW8iB8Du4mXDA51AEm3edjhFPPqwnnGfrR84PNR.s8j1fyzr7ha', // password: password
        role: 'MANAGER'
      },
      create: {
        name: 'Sophie Dubois',
        email: 'sophie.manager@colisso.fr',
        password: '$2b$12$YmPW8iB8Du4mXDA51AEm3edjhFPPqwnnGfrR84PNR.s8j1fyzr7ha', // password: password
        role: 'MANAGER'
      }
    }),
    
    // Utilisateurs normaux
    prisma.user.upsert({
      where: { email: 'julien.operateur@colisso.fr' },
      update: {
        name: 'Julien Moreau',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'USER'
      },
      create: {
        name: 'Julien Moreau',
        email: 'julien.operateur@colisso.fr',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'USER'
      }
    }),
    
    prisma.user.upsert({
      where: { email: 'marie.expeditrice@colisso.fr' },
      update: {
        name: 'Marie Lefevre',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'USER'
      },
      create: {
        name: 'Marie Lefevre',
        email: 'marie.expeditrice@colisso.fr',
        password: '$2b$12$NNHvgyFWdXW/YUXnqFN2nu88lc6kIyXqgV9lYV5JfmLMyoPhYhAzK', // password: admin123
        role: 'USER'
      }
    })
  ])

  // =====================
  // CLIENTS
  // =====================
  console.log('🏢 Création des clients...')
  
  const clients = await Promise.all([
    // Clients français
    prisma.client.upsert({
      where: { id: 'client-paris-1' },
      update: {},
      create: {
        id: 'client-paris-1',
        name: 'Jean Dupont',
        company: 'Entreprise Import-Export SARL',
        address: '123 Rue de la Paix, 75001 Paris',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        email: 'j.dupont@import-export.fr',
        notes: 'Client VIP - Livraison prioritaire - Demande toujours un accusé de réception'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-lyon-1' },
      update: {},
      create: {
        id: 'client-lyon-1',
        name: 'Marie Martin',
        company: 'Société Distribution ABC',
        address: '456 Avenue des Champs, 69000 Lyon',
        country: 'France',
        phone: '+33 4 56 78 90 12',
        email: 'marie.martin@distribution-abc.fr',
        notes: 'Préfère les livraisons en matinée'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-marseille-1' },
      update: {},
      create: {
        id: 'client-marseille-1',
        name: 'Pierre Durand',
        company: 'Commerce Méditerranéen',
        address: '789 Boulevard Central, 13000 Marseille',
        country: 'France',
        phone: '+33 4 91 23 45 67',
        email: 'p.durand@commerce-med.fr',
        notes: 'Livraison uniquement le matin - Portail automatique code 1234'
      }
    }),
    
    // Clients internationaux
    prisma.client.upsert({
      where: { id: 'client-senegal-1' },
      update: {},
      create: {
        id: 'client-senegal-1',
        name: 'Amadou Ba',
        company: 'Import Dakar',
        address: 'Avenue Léopold Sédar Senghor, Dakar',
        country: 'Sénégal',
        phone: '+221 33 123 45 67',
        email: 'amadou.ba@importdakar.sn',
        notes: 'Client régulier - Paiement toujours à réception'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-maroc-1' },
      update: {},
      create: {
        id: 'client-maroc-1',
        name: 'Fatima Benali',
        company: 'Trading Casablanca',
        address: 'Rue Mohammed V, Casablanca',
        country: 'Maroc',
        phone: '+212 522 12 34 56',
        email: 'f.benali@trading-casa.ma'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-tunisie-1' },
      update: {},
      create: {
        id: 'client-tunisie-1',
        name: 'Ahmed Trabelsi',
        address: 'Avenue Habib Bourguiba, Tunis',
        country: 'Tunisie',
        phone: '+216 71 12 34 56',
        email: 'ahmed.trabelsi@email.tn',
        notes: 'Attention: Vérifier les documents douaniers'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-cote-ivoire-1' },
      update: {},
      create: {
        id: 'client-cote-ivoire-1',
        name: 'Koné Mamadou',
        company: 'Express Abidjan',
        address: 'Boulevard de la République, Abidjan',
        country: 'Côte d\'Ivoire',
        phone: '+225 01 23 45 67 89',
        email: 'kone.mamadou@express-abidjan.ci',
        notes: 'Livraison en zone franche - Prévoir documents spéciaux'
      }
    }),
    
    // Clients particuliers
    prisma.client.upsert({
      where: { id: 'client-particulier-1' },
      update: {},
      create: {
        id: 'client-particulier-1',
        name: 'Lucie Bernard',
        address: '45 Rue des Lilas, 33000 Bordeaux',
        country: 'France',
        phone: '+33 5 56 78 90 12',
        email: 'lucie.bernard@gmail.com',
        notes: 'Particulier - Fragile avec précaution'
      }
    }),
    
    prisma.client.upsert({
      where: { id: 'client-particulier-2' },
      update: {},
      create: {
        id: 'client-particulier-2',
        name: 'David Chen',
        address: '12 Rue de la Liberté, 67000 Strasbourg',
        country: 'France',
        phone: '+33 3 88 12 34 56',
        email: 'david.chen@hotmail.fr',
        notes: 'Sonner à l\'interphone - Appartement 3B'
      }
    })
  ])

  // =====================
  // ÉTIQUETTES ET PACKAGES
  // =====================
  console.log('🏷️ Création des étiquettes et packages...')

  // Étiquette 1 - Envoi vers le Sénégal (GENERATED)
  const label1 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-001' },
    update: {
      clientId: clients[3].id, // Amadou Ba
      userId: users[1].id, // Utilisateur Test
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Amadou Ba',
      recipientCity: 'Dakar',
      recipientPhone: '+221 33 123 45 67',
      destination: 'Sénégal',
      weight: 5.5,
      length: 40,
      width: 30,
      height: 25,
      serviceCode: '1049.00',
      serviceType: 'Sous 1 semaine | Colisso',
      cost: 89.99,
      status: 'GENERATED',
      paymentStatus: 'Payé'
    },
    create: {
      trackingId: 'COL-2024-001',
      clientId: clients[3].id, // Amadou Ba
      userId: users[1].id, // Utilisateur Test
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Amadou Ba',
      recipientCity: 'Dakar',
      recipientPhone: '+221 33 123 45 67',
      destination: 'Sénégal',
      weight: 5.5,
      length: 40,
      width: 30,
      height: 25,
      serviceCode: '1049.00',
      serviceType: 'Sous 1 semaine | Colisso',
      cost: 89.99,
      status: 'GENERATED',
      paymentStatus: 'Payé'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label1.id } })
  await Promise.all([
    prisma.package.create({
      data: {
        labelId: label1.id,
        description: 'Produits cosmétiques',
        weight: 2.5,
        length: 25,
        width: 20,
        height: 15,
        value: 150.00,
        contents: 'Crèmes de beauté, parfums'
      }
    }),
    prisma.package.create({
      data: {
        labelId: label1.id,
        description: 'Vêtements',
        weight: 3.0,
        length: 35,
        width: 25,
        height: 10,
        value: 200.00,
        contents: 'Robes, chemises, accessoires'
      }
    })
  ])

  // Étiquette 2 - Envoi vers le Maroc (SHIPPED)
  const label2 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-002' },
    update: {},
    create: {
      trackingId: 'COL-2024-002',
      clientId: clients[4].id, // Fatima Benali
      userId: users[1].id, // Utilisateur Test
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Fatima Benali',
      recipientCity: 'Casablanca',
      recipientPhone: '+212 522 12 34 56',
      destination: 'Maroc',
      weight: 12.0,
      length: 60,
      width: 40,
      height: 35,
      serviceCode: '1049.00',
      serviceType: 'Sous 1 semaine | Colisso',
      cost: 145.50,
      status: 'SHIPPED',
      paymentStatus: 'Payé'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label2.id } })
  await prisma.package.create({
    data: {
      labelId: label2.id,
      description: 'Équipements électroniques',
      weight: 12.0,
      length: 60,
      width: 40,
      height: 35,
      value: 800.00,
      contents: 'Ordinateur portable, accessoires informatiques'
    }
  })

  // Étiquette 3 - Envoi local France (DELIVERED)
  const label3 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-003' },
    update: {},
    create: {
      trackingId: 'COL-2024-003',
      clientId: clients[0].id, // Jean Dupont
      userId: users[1].id, // Utilisateur Test
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Jean Dupont',
      recipientCity: 'Paris',
      recipientPhone: '+33 1 23 45 67 89',
      destination: 'France',
      weight: 3.2,
      length: 35,
      width: 25,
      height: 15,
      serviceCode: '1048.00',
      serviceType: 'Express 24h | Colisso',
      cost: 45.00,
      status: 'DELIVERED',
      paymentStatus: 'Payé'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label3.id } })
  await prisma.package.create({
    data: {
      labelId: label3.id,
      description: 'Documents importants',
      weight: 3.2,
      length: 35,
      width: 25,
      height: 15,
      value: 0.00,
      contents: 'Contrats, certificats, documents légaux'
    }
  })

  // Étiquette 4 - Envoi vers la Côte d'Ivoire (PENDING)
  const label4 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-004' },
    update: {},
    create: {
      trackingId: 'COL-2024-004',
      clientId: clients[6].id, // Koné Mamadou
      userId: users[3].id, // Marie Lefevre
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Koné Mamadou',
      recipientCity: 'Abidjan',
      recipientPhone: '+225 01 23 45 67 89',
      destination: 'Côte d\'Ivoire',
      weight: 25.8,
      length: 80,
      width: 60,
      height: 45,
      serviceCode: '1049.00',
      serviceType: 'Sous 1 semaine | Colisso',
      cost: 285.75,
      status: 'PENDING',
      paymentStatus: 'En attente'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label4.id } })
  await Promise.all([
    prisma.package.create({
      data: {
        labelId: label4.id,
        description: 'Pièces automobiles',
        weight: 15.0,
        length: 50,
        width: 40,
        height: 30,
        value: 1200.00,
        contents: 'Alternateur, courroies, filtres'
      }
    }),
    prisma.package.create({
      data: {
        labelId: label4.id,
        description: 'Outillage professionnel',
        weight: 10.8,
        length: 60,
        width: 30,
        height: 25,
        value: 650.00,
        contents: 'Clés, tournevis, équipements mécaniques'
      }
    })
  ])

  // Étiquette 5 - Envoi particulier (DRAFT)
  const label5 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-005' },
    update: {},
    create: {
      trackingId: 'COL-2024-005',
      clientId: clients[7].id, // Lucie Bernard
      userId: users[1].id, // Utilisateur Test
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Lucie Bernard',
      recipientCity: 'Bordeaux',
      recipientPhone: '+33 5 56 78 90 12',
      destination: 'France',
      weight: 1.5,
      length: 25,
      width: 20,
      height: 8,
      serviceCode: '1047.00',
      serviceType: 'Standard | Colisso',
      cost: 25.99,
      status: 'DRAFT',
      paymentStatus: 'Non payé'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label5.id } })
  await prisma.package.create({
    data: {
      labelId: label5.id,
      description: 'Cadeau personnel',
      weight: 1.5,
      length: 25,
      width: 20,
      height: 8,
      value: 75.00,
      contents: 'Bijoux, carte personnalisée'
    }
  })

  // Étiquette 6 - Envoi vers la Tunisie (CANCELLED)
  const label6 = await prisma.label.upsert({
    where: { trackingId: 'COL-2024-006' },
    update: {},
    create: {
      trackingId: 'COL-2024-006',
      clientId: clients[5].id, // Ahmed Trabelsi
      userId: users[3].id, // Marie Lefevre
      senderName: 'Colisso France',
      senderCity: 'Marseille',
      senderPhone: '+33760248507',
      recipientName: 'Ahmed Trabelsi',
      recipientCity: 'Tunis',
      recipientPhone: '+216 71 12 34 56',
      destination: 'Tunisie',
      weight: 8.2,
      length: 45,
      width: 35,
      height: 20,
      serviceCode: '1049.00',
      serviceType: 'Sous 1 semaine | Colisso',
      cost: 95.00,
      status: 'CANCELLED',
      paymentStatus: 'Remboursé'
    }
  })

  // Supprimer les packages existants pour cette étiquette et les recréer
  await prisma.package.deleteMany({ where: { labelId: label6.id } })
  await prisma.package.create({
    data: {
      labelId: label6.id,
      description: 'Produits alimentaires',
      weight: 8.2,
      length: 45,
      width: 35,
      height: 20,
      value: 120.00,
      contents: 'Spécialités françaises, conserves'
    }
  })

  console.log('✅ Seed terminé avec succès!')
  console.log(`👥 Utilisateurs créés: ${users.length}`)
  console.log(`🏢 Clients créés: ${clients.length}`)
  console.log('🏷️ Étiquettes créées: 6')
  console.log('📦 Packages créés: 8')
  console.log('\n📊 Répartition des statuts:')
  console.log('- DRAFT: 1')
  console.log('- PENDING: 1') 
  console.log('- GENERATED: 1')
  console.log('- SHIPPED: 1')
  console.log('- DELIVERED: 1')
  console.log('- CANCELLED: 1')
  console.log('\n🔐 POUR TESTER LA CONNEXION:')
  console.log('═══════════════════════════════════════')
  console.log('👤 Compte Admin Simple: test@test.com / admin123')
  console.log('👤 Compte Admin Complet: admin@colisso.fr / admin123') 
  console.log('👤 Gestionnaire: sophie.manager@colisso.fr / password')
  console.log('═══════════════════════════════════════')
  console.log('🌐 Accédez maintenant à: http://localhost:3000/auth/signin')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
