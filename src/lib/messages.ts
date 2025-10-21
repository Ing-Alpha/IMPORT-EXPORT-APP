export const messages = {
  // Messages de succès
  success: {
    clientCreated: 'Client créé avec succès',
    clientUpdated: 'Client mis à jour avec succès',
    clientDeleted: 'Client supprimé avec succès',
    labelGenerated: 'Étiquette générée avec succès',
    profileUpdated: 'Profil mis à jour avec succès',
    userCreated: 'Compte créé avec succès',
  },
  
  // Messages d'erreur
  error: {
    clientNotFound: 'Client non trouvé',
    clientCreateFailed: 'Erreur lors de la création du client',
    clientUpdateFailed: 'Erreur lors de la mise à jour du client',
    clientDeleteFailed: 'Erreur lors de la suppression du client',
    labelGenerateFailed: 'Erreur lors de la génération de l\'étiquette',
    invalidCredentials: 'Email ou mot de passe incorrect',
    userExists: 'Un utilisateur avec cet email existe déjà',
    unauthorized: 'Non autorisé',
    serverError: 'Erreur interne du serveur',
    validationError: 'Données invalides',
  },
  
  // Messages de validation
  validation: {
    required: 'Ce champ est requis',
    emailInvalid: 'Adresse email invalide',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  
  // Messages informatifs
  info: {
    noClients: 'Aucun client enregistré',
    noLabels: 'Aucune étiquette générée',
    noResults: 'Aucun résultat trouvé',
    loading: 'Chargement...',
    saving: 'Sauvegarde...',
    generating: 'Génération...',
  }
} as const

export type MessageKey = keyof typeof messages
export type SuccessMessageKey = keyof typeof messages.success
export type ErrorMessageKey = keyof typeof messages.error
export type ValidationMessageKey = keyof typeof messages.validation
export type InfoMessageKey = keyof typeof messages.info
