# 📦 Gestion Complète des Étiquettes d'Expédition

## 🎯 Fonctionnalités Implémentées

### ✅ **Gestion des Étiquettes**
- **Création d'étiquettes** pour des clients existants
- **Modification et mise à jour** des étiquettes
- **Suppression** d'étiquettes
- **Visualisation** des détails d'étiquettes
- **Gestion des statuts** (DRAFT, PENDING, GENERATED, SHIPPED, DELIVERED, CANCELLED)

### ✅ **Gestion des Colis Multiples**
- **Ajout de plusieurs colis** à une même étiquette
- **Modification individuelle** de chaque colis
- **Suppression** de colis spécifiques
- **Détails complets** : description, poids, dimensions, valeur, contenu

### ✅ **Génération PDF avec QR Code**
- **PDF personnalisé** avec toutes les informations
- **Code-barres** et numéro de suivi unique
- **QR Code** pour le suivi
- **Détail des colis multiples** dans le PDF
- **Téléchargement direct** du PDF

## 🗄️ Structure de la Base de Données

### **Modèle Label**
```prisma
model Label {
  id               String    @id @default(cuid())
  trackingId       String    @unique
  clientId         String
  userId           String
  
  // Données d'expédition
  senderName       String
  senderCity       String
  senderPhone      String
  recipientName    String
  recipientCity    String
  recipientPhone   String
  destination      String
  
  // Détails du colis principal
  weight           Float
  length           Int
  width            Int
  height           Int
  serviceCode      String
  serviceType      String
  cost             Float?
  
  // Statut
  status           String    @default("DRAFT")
  paymentStatus    String    @default("Payé")
  
  // Relations
  client           Client    @relation(fields: [clientId], references: [id])
  user             User      @relation(fields: [userId], references: [id])
  packages         Package[] // Un étiquette peut contenir plusieurs colis
}
```

### **Modèle Package**
```prisma
model Package {
  id               String    @id @default(cuid())
  labelId          String
  
  // Détails du colis individuel
  description      String?
  weight           Float
  length           Int
  width            Int
  height           Int
  value            Float?
  contents         String?
  
  // Relation
  label            Label     @relation(fields: [labelId], references: [id])
}
```

## 🚀 API Routes Disponibles

### **Étiquettes**
- `GET /api/labels` - Liste toutes les étiquettes
- `POST /api/labels` - Créer une nouvelle étiquette
- `GET /api/labels/[id]` - Récupérer une étiquette spécifique
- `PUT /api/labels/[id]` - Mettre à jour une étiquette
- `DELETE /api/labels/[id]` - Supprimer une étiquette
- `GET /api/labels/[id]/download` - Télécharger le PDF de l'étiquette

### **Colis**
- `GET /api/labels/[id]/packages` - Liste des colis d'une étiquette
- `POST /api/labels/[id]/packages` - Ajouter un colis à une étiquette
- `GET /api/labels/[labelId]/packages/[packageId]` - Récupérer un colis
- `PUT /api/labels/[labelId]/packages/[packageId]` - Modifier un colis
- `DELETE /api/labels/[labelId]/packages/[packageId]` - Supprimer un colis

## 📋 Processus de Création d'Étiquette

### **1. Sélection du Client**
- Choisir un client existant depuis la liste
- Les informations du client sont pré-remplies

### **2. Saisie des Détails**
- **Informations d'expédition** : expéditeur, destinataire, destination
- **Détails du service** : code service, type, coût
- **Dimensions et poids** du colis principal

### **3. Ajout de Colis Multiples**
- Bouton "Ajouter un colis" pour chaque colis supplémentaire
- Saisie des détails : description, poids, dimensions, valeur, contenu

### **4. Sauvegarde**
- Statut initial : "DRAFT"
- Possibilité de modifier avant génération

### **5. Génération PDF**
- Bouton "Générer PDF" 
- Mise à jour du statut vers "GENERATED"
- Téléchargement du PDF avec QR Code

## 🎨 Contenu du PDF Généré

### **En-tête**
- Logo et nom de l'entreprise
- Informations de contact

### **Code-barres et Suivi**
- Numéro de suivi unique (ex: FRA248094)
- Code-barres visuel
- QR Code pour le suivi

### **Informations du Paquet**
- Date de génération
- Code service et type
- Poids et dimensions
- Coût du service

### **Statut de Paiement**
- Indicateur visuel "Payé" (vert)

### **Destination**
- Pays et ville de destination
- Numéro de téléphone du destinataire

### **Expéditeur/Destinataire**
- Informations complètes des deux parties

### **Détail des Colis Multiples**
- Liste de tous les colis associés
- Description, poids, dimensions, valeur de chaque colis

## 🔧 Utilisation

### **Créer une Étiquette**
```javascript
const response = await fetch('/api/labels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'client-id',
    recipientName: 'Nom Destinataire',
    recipientCity: 'Ville',
    recipientPhone: '+1234567890',
    destination: 'Pays - Ville',
    packages: [
      {
        description: 'Livre',
        weight: 0.5,
        length: 25,
        width: 18,
        height: 3,
        value: 25.99,
        contents: 'Roman de fiction'
      }
    ]
  })
})
```

### **Télécharger le PDF**
```javascript
const response = await fetch(`/api/labels/${labelId}/download`)
const blob = await response.blob()
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `etiquette-${trackingId}.pdf`
a.click()
```

## 🎉 Résultat

L'application permet maintenant une **gestion complète des étiquettes d'expédition** avec :

- ✅ **Interface intuitive** pour créer et gérer les étiquettes
- ✅ **Support des colis multiples** par étiquette
- ✅ **Génération PDF professionnelle** avec QR Code
- ✅ **Suivi des statuts** et historique complet
- ✅ **API REST complète** pour toutes les opérations

---

**Date** : 21 octobre 2025  
**Statut** : ✅ **FONCTIONNEL**  
**Prêt pour** : 🚀 **Production**
