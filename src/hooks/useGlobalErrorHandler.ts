'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function useGlobalErrorHandler() {
  const router = useRouter()

  useEffect(() => {
    // Intercepter les erreurs globales
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error)
      
      // Vérifier si l'erreur est liée à l'authentification
      if (event.error?.message?.includes('401') || 
          event.error?.message?.includes('Unauthorized') ||
          event.error?.message?.includes('Token expired')) {
        console.log('Global Error: Erreur d\'authentification détectée')
        signOut({ callbackUrl: '/auth/signin' })
      }
    }

    // Intercepter les erreurs de promesses non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      
      // Vérifier si l'erreur est liée à l'authentification
      if (event.reason?.status === 401 || 
          event.reason?.message?.includes('Unauthorized') ||
          event.reason?.message?.includes('Token expired')) {
        console.log('Promise Rejection: Erreur d\'authentification détectée')
        signOut({ callbackUrl: '/auth/signin' })
      }
    }

    // Ajouter les écouteurs d'événements
    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [router])

  return {
    handleAuthError: (error: any) => {
      if (error?.status === 401 || 
          error?.message?.includes('Unauthorized') ||
          error?.message?.includes('Token expired')) {
        signOut({ callbackUrl: '/auth/signin' })
        return true
      }
      return false
    }
  }
}
