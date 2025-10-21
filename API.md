# API Documentation - Application Import-Export

## 🔐 Authentification

### POST /api/auth/register
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123",
  "role": "USER"
}
```

**Response:**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "clx...",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/signin
Se connecter avec email et mot de passe.

**Body:**
```json
{
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

**Response:** Redirection vers le dashboard ou erreur.

## 👥 Clients

### GET /api/clients
Récupérer tous les clients.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Jean Dupont",
    "company": "Entreprise SARL",
    "address": "123 Rue de la Paix, 75001 Paris",
    "country": "France",
    "phone": "+33 1 23 45 67 89",
    "email": "jean@entreprise.com",
    "notes": "Client VIP",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/clients
Créer un nouveau client.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Marie Martin",
  "company": "Société ABC",
  "address": "456 Avenue des Champs, 69000 Lyon",
  "country": "France",
  "phone": "+33 4 56 78 90 12",
  "email": "marie@societe-abc.fr",
  "notes": "Livraison prioritaire"
}
```

**Response:**
```json
{
  "id": "clx...",
  "name": "Marie Martin",
  "company": "Société ABC",
  "address": "456 Avenue des Champs, 69000 Lyon",
  "country": "France",
  "phone": "+33 4 56 78 90 12",
  "email": "marie@societe-abc.fr",
  "notes": "Livraison prioritaire",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/clients/[id]
Récupérer un client par ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "clx...",
  "name": "Jean Dupont",
  "company": "Entreprise SARL",
  "address": "123 Rue de la Paix, 75001 Paris",
  "country": "France",
  "phone": "+33 1 23 45 67 89",
  "email": "jean@entreprise.com",
  "notes": "Client VIP",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "labels": [
    {
      "id": "clx...",
      "trackingId": "EXP-ABC123",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### PUT /api/clients/[id]
Mettre à jour un client.

**Headers:** `Authorization: Bearer <token>`

**Body:** Même structure que POST /api/clients

**Response:** Client mis à jour

### DELETE /api/clients/[id]
Supprimer un client.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Client supprimé avec succès"
}
```

## 🏷️ Étiquettes

### GET /api/labels
Récupérer toutes les étiquettes générées.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "clx...",
    "trackingId": "EXP-ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "client": {
      "id": "clx...",
      "name": "Jean Dupont",
      "company": "Entreprise SARL"
    },
    "user": {
      "name": "Admin User"
    }
  }
]
```

### POST /api/labels
Générer une nouvelle étiquette PDF.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "clientId": "clx..."
}
```

**Response:** Fichier PDF en binaire avec headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="etiquette-Jean-Dupont-EXP-ABC123.pdf"
```

## 📊 Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non autorisé
- `404` - Ressource non trouvée
- `500` - Erreur interne du serveur

## 🔒 Authentification

L'application utilise NextAuth.js avec des sessions JWT. Toutes les routes API (sauf `/api/auth/*`) nécessitent une authentification.

### Headers requis
```
Authorization: Bearer <jwt-token>
```

### Rôles utilisateur
- `USER` - Utilisateur standard
- `ADMIN` - Administrateur (accès complet)

## 📝 Validation des données

### Clients
- `name` : Requis, minimum 2 caractères
- `address` : Requis, minimum 10 caractères
- `country` : Requis, minimum 2 caractères
- `email` : Optionnel, format email valide
- `phone` : Optionnel
- `company` : Optionnel
- `notes` : Optionnel

### Utilisateurs
- `name` : Requis, minimum 2 caractères
- `email` : Requis, format email valide, unique
- `password` : Requis, minimum 8 caractères
- `role` : Requis, 'USER' ou 'ADMIN'

## 🚨 Gestion des erreurs

Toutes les erreurs suivent le format standard :

```json
{
  "error": "Message d'erreur descriptif",
  "code": "ERROR_CODE",
  "details": "Détails supplémentaires (optionnel)"
}
```

### Codes d'erreur courants
- `VALIDATION_ERROR` - Données de validation invalides
- `UNAUTHORIZED` - Non autorisé
- `NOT_FOUND` - Ressource non trouvée
- `DUPLICATE_EMAIL` - Email déjà utilisé
- `INVALID_CREDENTIALS` - Identifiants invalides
- `SERVER_ERROR` - Erreur interne du serveur

## 🔄 Rate Limiting

Les endpoints sont protégés contre les abus :
- Maximum 100 requêtes par minute par IP
- Maximum 10 tentatives de connexion par minute par IP

## 📱 Support des formats

### Formats acceptés
- `application/json` pour les données
- `application/pdf` pour les étiquettes
- `multipart/form-data` pour les fichiers (futur)

### Encodage
- UTF-8 pour tous les textes
- Base64 pour les données binaires (si nécessaire)

---

**Cette documentation est maintenue à jour avec l'évolution de l'API.**
