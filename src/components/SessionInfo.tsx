'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, AlertTriangle } from 'lucide-react'
import { useSessionExpiration } from '@/hooks/useSessionExpiration'

export default function SessionInfo() {
  const { formatTimeRemaining, isWarningTime, isCriticalTime } = useSessionExpiration()

  if (!formatTimeRemaining) return null

  return (
    <div className="mb-4">
      <Alert className={
        isCriticalTime 
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
          : isWarningTime 
            ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
            : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
      }>
        <div className="flex items-center">
          {isCriticalTime ? (
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          ) : isWarningTime ? (
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          ) : (
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
          <AlertDescription className="ml-2">
            <span className="font-medium">
              {isCriticalTime 
                ? 'URGENT: Session expire dans: ' 
                : isWarningTime 
                  ? 'Attention: Session expire dans: '
                  : 'Session expire dans: '
              }
            </span>
            <span className={
              isCriticalTime 
                ? 'text-red-700 dark:text-red-300' 
                : isWarningTime 
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-blue-700 dark:text-blue-300'
            }>
              {formatTimeRemaining}
            </span>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}
