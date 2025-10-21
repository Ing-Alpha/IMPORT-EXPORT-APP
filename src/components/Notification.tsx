'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
}

interface NotificationProps {
  notification: Notification
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
}

export function NotificationItem({ notification, onClose }: NotificationProps) {
  const Icon = icons[notification.type]

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose(notification.id)
      }, notification.duration)

      return () => clearTimeout(timer)
    }
  }, [notification.duration, notification.id, onClose])

  return (
    <Alert className={`${colors[notification.type]} animate-in slide-in-from-right-full`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex-1">
        {notification.title && (
          <div className="font-medium">{notification.title}</div>
        )}
        <div>{notification.message}</div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onClose(notification.id)}
        className="h-6 w-6 p-0 hover:bg-transparent"
      >
        <X className="h-3 w-3" />
      </Button>
    </Alert>
  )
}

export function NotificationContainer({ notifications, onClose }: {
  notifications: Notification[]
  onClose: (id: string) => void
}) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

// Hook pour utiliser les notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // 5 secondes par défaut
    }
    
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  }
}
