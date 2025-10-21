'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface AuthErrorHandlerProps {
  error?: string
  onRetry?: () => void
}

export default function AuthErrorHandler({ error, onRetry }: AuthErrorHandlerProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push('/auth/signin')
    }
  }, [countdown, router])

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Erreur d'authentification
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {error || 'Une erreur est survenue lors de la vérification de votre session.'}
          </p>
          
          <Alert className="mt-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <AlertDescription>
              Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
            </AlertDescription>
          </Alert>

          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
            <Button
              onClick={() => router.push('/auth/signin')}
              className="flex items-center gap-2"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
