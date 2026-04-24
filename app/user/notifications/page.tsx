'use client'

import { useState, useEffect } from 'react'
import {
  Bell, CheckCheck, ListTodo, FileText,
  MessageSquare, AlertTriangle, Info, Zap, Loader2,
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { notificationService, type ApiNotification } from '@/lib/api/notificationService'
import { fieldSyncSocket } from '@/lib/auth/socketManager'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  task: { icon: ListTodo, color: 'text-primary', bg: 'bg-primary/10' },
  form: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  message: { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  alert: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  system: { icon: Zap, color: 'text-muted-foreground', bg: 'bg-muted/60' },
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const unsubscribe = fieldSyncSocket.on('notification:new', (payload) => {
      const notif = payload as ApiNotification | null
      if (!notif?.id) return
      setNotifications((prev) => [notif, ...prev])
    })

    return () => unsubscribe()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getAll()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const markRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Notifications"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Notifications' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2 shrink-0">
                <CheckCheck className="h-4 w-4" /> Mark all read
              </Button>
            )}
          </div>

          {/* Notifications list */}
          <div className="space-y-2">
            {notifications.map((notif) => {
              const tc = typeConfig[notif.type]
              const Icon = tc.icon
              return (
                <Card
                  key={notif.id}
                  className={cn(
                    'transition-colors cursor-pointer hover:shadow-sm',
                    !notif.is_read && 'border-primary/20 bg-primary/[0.02]'
                  )}
                  onClick={() => markRead(notif.id)}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0 mt-0.5', tc.bg)}>
                      <Icon className={cn('h-4 w-4', tc.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm leading-tight', !notif.is_read ? 'font-semibold' : 'font-medium')}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!notif.is_read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTime(notif.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <Bell className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">You're all caught up</p>
            </div>
          )}

        </div>
      </main>
    </>
  )
}

