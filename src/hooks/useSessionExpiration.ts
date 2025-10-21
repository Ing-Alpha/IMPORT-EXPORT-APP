'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useSessionExpiration() {
  const { data: session, status } = useSession()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!session?.expires || status !== 'authenticated') {
      setTimeRemaining(0)
      setIsExpired(false)
      return
    }

    const updateTimeRemaining = () => {
      const expirationTime = new Date(session.expires).getTime()
      const currentTime = Date.now()
      const remaining = expirationTime - currentTime

      if (remaining <= 0) {
        setIsExpired(true)
        setTimeRemaining(0)
        // Déconnexion automatique après expiration
        signOut({ callbackUrl: '/auth/signin' })
        return
      }

      setTimeRemaining(remaining)
      setIsExpired(false)
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [session?.expires, status])

  const formatTimeRemaining = () => {
    if (timeRemaining <= 0) return '0s'

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const isWarningTime = timeRemaining < 5 * 60 * 1000 // 5 minutes
  const isCriticalTime = timeRemaining < 1 * 60 * 1000 // 1 minute

  return {
    timeRemaining,
    isExpired,
    isWarningTime,
    isCriticalTime,
    formatTimeRemaining: formatTimeRemaining(),
    session
  }
}
