'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSessionExpiration } from '@/hooks/useSessionExpiration'
import { useGlobalErrorHandler } from '@/hooks/useGlobalErrorHandler'
import AuthErrorHandler from './AuthErrorHandler'

interface AuthInterceptorProps {
  children: React.ReactNode
}

export default function AuthInterceptor({ children }: AuthInterceptorProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { isExpired, isCriticalTime } = useSessionExpiration()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = ['/auth/signin', '/auth/signup', '/']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // Ne pas intercepter sur les pages publiques
    if (isPublicPage) return

    // Attendre que le statut de session soit déterminé
    if (status === 'loading') return

    // Rediriger si pas de session ou session expirée
    if (!session || isExpired) {
      if (!isRedirecting) {
        setIsRedirecting(true)
        setAuthError(isExpired ? 'Votre session a expiré' : 'Authentification requise')
        console.log('AuthInterceptor: Redirection vers /auth/signin - Session expirée ou inexistante')
        
        // Déconnexion propre si session existe mais expirée
        if (session && isExpired) {
          signOut({ callbackUrl: '/auth/signin' })
        } else {
          router.push('/auth/signin')
        }
      }
      return
    }

    // Réinitialiser l'état de redirection si la session est valide
    if (isRedirecting) {
      setIsRedirecting(false)
    }
  }, [session, status, isExpired, isPublicPage, pathname, router, isRedirecting])

  // Afficher le gestionnaire d'erreur d'authentification
  if (isRedirecting && !isPublicPage && authError) {
    return (
      <AuthErrorHandler 
        error={authError}
        onRetry={() => {
          setIsRedirecting(false)
          setAuthError(null)
          window.location.reload()
        }}
      />
    )
  }

  // Afficher un avertissement critique si la session expire bientôt
  if (isCriticalTime && !isPublicPage && session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto pt-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Session critique
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>Votre session expire dans moins d'une minute. Vous allez être déconnecté automatiquement.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Se déconnecter maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
