'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface ApiErrorHandlerProps {
  error?: any
  onRetry?: () => void
}

export function useApiErrorHandler() {
  const router = useRouter()

  const handleApiError = (error: any) => {
    console.error('API Error:', error)

    // Vérifier si l'erreur est liée à l'authentification
    if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
      console.log('API Error: Token invalide ou expiré, déconnexion automatique')
      signOut({ callbackUrl: '/auth/signin' })
      return true
    }

    // Vérifier si l'erreur est liée à l'accès interdit
    if (error?.status === 403 || error?.message?.includes('Forbidden')) {
      console.log('API Error: Accès interdit, redirection vers le dashboard')
      router.push('/dashboard')
      return true
    }

    // Vérifier si l'erreur est liée à un token expiré
    if (error?.message?.includes('Token expired') || error?.message?.includes('JWT expired')) {
      console.log('API Error: Token expiré, déconnexion automatique')
      signOut({ callbackUrl: '/auth/signin' })
      return true
    }

    return false
  }

  return { handleApiError }
}

export default function ApiErrorHandler({ error, onRetry }: ApiErrorHandlerProps) {
  const { handleApiError } = useApiErrorHandler()

  useEffect(() => {
    if (error) {
      const wasHandled = handleApiError(error)
      if (wasHandled && onRetry) {
        onRetry()
      }
    }
  }, [error, handleApiError, onRetry])

  return null
}
