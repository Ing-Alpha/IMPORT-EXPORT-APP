import { z } from 'zod'

// Schéma de validation pour l'utilisateur
export const userSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

// Schéma de validation pour le client
export const clientSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string().optional(),
  address: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  country: z.string().min(2, 'Le pays est requis'),
  phone: z.string().optional(),
  email: z.string().email('Adresse email invalide').optional().or(z.literal('')),
  notes: z.string().optional(),
})

// Schéma de validation pour l'étiquette
export const labelSchema = z.object({
  clientId: z.string().min(1, 'L\'ID du client est requis'),
})

// Schéma de validation pour la recherche
export const searchSchema = z.object({
  query: z.string().min(1, 'La recherche ne peut pas être vide'),
  type: z.enum(['clients', 'labels']).optional(),
})

// Types TypeScript dérivés des schémas
export type UserFormData = z.infer<typeof userSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ClientFormData = z.infer<typeof clientSchema>
export type LabelFormData = z.infer<typeof labelSchema>
export type SearchFormData = z.infer<typeof searchSchema>

// Fonctions de validation
export function validateUser(data: unknown): { success: boolean; data?: UserFormData; errors?: z.ZodError } {
  const result = userSchema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  }
}

export function validateLogin(data: unknown): { success: boolean; data?: LoginFormData; errors?: z.ZodError } {
  const result = loginSchema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  }
}

export function validateClient(data: unknown): { success: boolean; data?: ClientFormData; errors?: z.ZodError } {
  const result = clientSchema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  }
}

export function validateLabel(data: unknown): { success: boolean; data?: LabelFormData; errors?: z.ZodError } {
  const result = labelSchema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  }
}

export function validateSearch(data: unknown): { success: boolean; data?: SearchFormData; errors?: z.ZodError } {
  const result = searchSchema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  }
}
