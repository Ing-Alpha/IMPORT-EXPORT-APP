# Système d'Étiquettes Colisso

## Vue d'ensemble

Le système d'étiquettes a été mis à jour pour générer des étiquettes au format Colisso Multiservice, basées sur l'image fournie. Le système stocke maintenant les données des étiquettes plutôt que les fichiers PDF, permettant une génération à la demande.

## Fonctionnalités

### 🏷️ Génération d'étiquettes
- Format vertical (300x450px) comme l'étiquette Colisso
- Informations complètes : expéditeur, destinataire, détails du colis
- Code-barres simulé avec numéro de suivi
- Statut de paiement avec badge vert "Payé"

### 📊 Stockage des données
- Données structurées en base de données
- Pas de stockage de fichiers PDF
- Génération PDF à la demande
- Historique complet des étiquettes

### 🔍 Gestion et recherche
- Interface d'historique mise à jour
- Recherche par numéro de suivi, noms, destinations
- Affichage des détails complets
- Téléchargement et visualisation des PDF

## Structure des données

### Modèle Label
```typescript
interface Label {
  id: string
  trackingId: string
  createdAt: string
  
  // Expéditeur
  senderName: string
  senderCity: string
  senderPhone: string
  
  // Destinataire
  recipientName: string
  recipientCity: string
  recipientPhone: string
  destination: string
  
  // Détails du colis
  weight: number      // en kg
  length: number      // en cm
  width: number       // en cm
  height: number      // en cm
  serviceCode: string
  serviceType: string
  cost?: number
  
  // Statut
  paymentStatus: string
  
  // Relations
  client: Client
  user: User
}
```

## API Endpoints

### POST /api/labels
Créer une nouvelle étiquette
```json
{
  "clientId": "string",
  "senderName": "string",
  "senderCity": "string",
  "senderPhone": "string",
  "recipientName": "string",
  "recipientCity": "string",
  "recipientPhone": "string",
  "destination": "string",
  "weight": number,
  "length": number,
  "width": number,
  "height": number,
  "serviceCode": "string",
  "serviceType": "string",
  "cost": number
}
```

### GET /api/labels
Récupérer toutes les étiquettes

### GET /api/labels/[id]
Récupérer les détails d'une étiquette

### GET /api/labels/[id]/download
Télécharger le PDF d'une étiquette

## Interface utilisateur

### Pages disponibles
- `/dashboard/labels` - Vue d'ensemble des étiquettes
- `/dashboard/labels/new` - Créer une nouvelle étiquette
- `/dashboard/labels/[id]` - Détails d'une étiquette
- `/dashboard/history` - Historique complet

### Fonctionnalités de l'interface
- Formulaire de création avec validation
- Tableau d'historique avec recherche
- Boutons de téléchargement PDF
- Visualisation des détails complets

## Migration de la base de données

La migration a été appliquée avec des valeurs par défaut pour éviter les erreurs :

```sql
-- Nouvelles colonnes ajoutées avec valeurs par défaut
senderName       String   @default("")
senderCity       String   @default("Marseille")
senderPhone      String   @default("+33760248507")
recipientName    String   @default("")
recipientCity    String   @default("")
recipientPhone   String   @default("")
destination      String   @default("")
weight           Float    @default(1.0)
length           Int      @default(30)
width            Int      @default(20)
height           Int      @default(10)
serviceCode      String   @default("1049.00")
serviceType      String   @default("Sous 1 semaine | Colisso")
paymentStatus    String   @default("Payé")
```

## Test du système

Un script de test est disponible dans `scripts/test-label.js` pour créer une étiquette de démonstration.

```bash
node scripts/test-label.js
```

## Format PDF généré

L'étiquette PDF générée inclut :
- En-tête avec logo Colisso Multiservice
- Code-barres avec numéro de suivi
- Référence du paquet (date, code service, poids, coût)
- Référence du service
- Statut de paiement avec badge vert
- Destination mise en évidence
- Numéro de téléphone du destinataire
- Section expéditeur/destinataire

## Utilisation

1. **Créer une étiquette** : Aller sur `/dashboard/labels/new`
2. **Remplir le formulaire** avec toutes les informations requises
3. **Soumettre** pour créer l'étiquette
4. **Consulter l'historique** sur `/dashboard/history`
5. **Télécharger le PDF** via les boutons d'action

Le système est maintenant prêt à générer des étiquettes au format Colisso Multiservice !
