"use client"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bell, MessageCircle, HelpCircle, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react'

type NotificationType = 'help-request' | 'alert' | 'message' | 'task-update'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  sender: string
  status: 'unread' | 'read'
}

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'help-request',
    title: 'Help Request from Sarah Lee',
    message: 'Battery low, need assistance at Zone Alpha South',
    timestamp: '5 min ago',
    sender: 'Sarah Lee',
    status: 'unread',
  },
  {
    id: 'notif-2',
    type: 'alert',
    title: 'Mike Johnson left zone',
    message: 'Member left assigned zone boundary',
    timestamp: '12 min ago',
    sender: 'System',
    status: 'unread',
  },
  {
    id: 'notif-3',
    type: 'message',
    title: 'New message from Supervisor',
    message: 'Good progress today, keep up the coverage',
    timestamp: '1 hour ago',
    sender: 'Supervisor',
    status: 'read',
  },
  {
    id: 'notif-4',
    type: 'task-update',
    title: 'Task #2 marked complete',
    message: 'Jane Smith completed Zone Alpha survey',
    timestamp: '2 hours ago',
    sender: 'Jane Smith',
    status: 'read',
  },
  {
    id: 'notif-5',
    type: 'help-request',
    title: 'Help Request from Mike Johnson',
    message: 'Cannot locate household #23, need GPS confirmation',
    timestamp: '3 hours ago',
    sender: 'Mike Johnson',
    status: 'read',
  },
]

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bgColor: string }> = {
  'help-request': { icon: HelpCircle, color: 'border-l-orange-500', bgColor: 'bg-orange-500/10' },
  alert: { icon: AlertTriangle, color: 'border-l-destructive', bgColor: 'bg-destructive/10' },
  message: { icon: MessageCircle, color: 'border-l-primary', bgColor: 'bg-primary/10' },
  'task-update': { icon: CheckCircle, color: 'border-l-emerald-500', bgColor: 'bg-emerald-500/10' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all')

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })))
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' as const } : n))
  }

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Help requests, alerts, and messages</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount} New
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'all', label: 'All', icon: Bell },
          { key: 'help-request', label: 'Help Requests', icon: HelpCircle },
          { key: 'alert', label: 'Alerts', icon: AlertTriangle },
          { key: 'message', label: 'Messages', icon: MessageCircle },
          { key: 'task-update', label: 'Task Updates', icon: CheckCircle },
        ] as const).map(f => (
          <Button
            key={f.key}
            variant={activeFilter === f.key ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setActiveFilter(f.key)}
          >
            <f.icon className="h-3 w-3" />
            {f.label}
          </Button>
        ))}
      </div>

      <Card className="flex flex-col h-[550px]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">
            Live Feed
            {filtered.length !== notifications.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length} shown)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-6 pt-0 border-t">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No notifications in this category</p>
                </div>
              )}
              {filtered.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      'hover:shadow-md transition-all cursor-pointer border-l-4 p-4',
                      notification.status === 'unread' ? 'bg-accent/50' : 'hover:bg-accent/30',
                      config.color
                    )}
                    onClick={() => markRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bgColor)}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                          <Badge
                            variant={notification.status === 'unread' ? 'destructive' : 'secondary'}
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            {notification.status === 'unread' ? 'NEW' : 'READ'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{notification.sender}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-500">
              {notifications.filter(n => n.type === 'help-request').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Help Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-destructive">
              {notifications.filter(n => n.type === 'alert').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-destructive uppercase font-semibold tracking-wide">Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {notifications.filter(n => n.type === 'message').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Messages</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

