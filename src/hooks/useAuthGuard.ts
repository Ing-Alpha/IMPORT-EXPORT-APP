'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuthGuard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const checkAuth = () => {
    if (status === 'loading') return { isAuthenticated: false, isLoading: true }
    if (!session) return { isAuthenticated: false, isLoading: false }
    return { isAuthenticated: true, isLoading: false }
  }

  const redirectToLogin = (reason?: string) => {
    console.log(`AuthGuard: Redirection vers /auth/signin${reason ? ` - ${reason}` : ''}`)
    router.push('/auth/signin')
  }

  const requireAuth = (callback?: () => void) => {
    const authStatus = checkAuth()
    
    if (!authStatus.isAuthenticated && !authStatus.isLoading) {
      redirectToLogin('Authentification requise')
      return false
    }
    
    if (callback && authStatus.isAuthenticated) {
      callback()
    }
    
    return authStatus.isAuthenticated
  }

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    checkAuth,
    redirectToLogin,
    requireAuth
  }
}
