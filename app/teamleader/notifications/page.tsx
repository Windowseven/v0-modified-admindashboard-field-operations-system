import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { Bell, MessageCircle, HelpCircle, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react'

const mockNotifications = [
  {
    id: 'notif-1',
    type: 'help-request',
    title: 'Help Request from Sarah Lee',
    message: 'Battery low, need assistance at Zone Alpha South',
    timestamp: '5 min ago',
    sender: 'Sarah Lee',
    status: 'unread' as const,
  },
  {
    id: 'notif-2',
    type: 'alert',
    title: 'Mike Johnson left zone',
    message: 'Member left assigned zone boundary',
    timestamp: '12 min ago',
    sender: 'System',
    status: 'read' as const,
  },
  {
    id: 'notif-3',
    type: 'message',
    title: 'New message from Supervisor',
    message: 'Good progress today, keep up the coverage',
    timestamp: '1 hour ago',
    sender: 'Supervisor',
    status: 'read' as const,
  },
  {
    id: 'notif-4',
    type: 'task-update',
    title: 'Task #2 marked complete',
    message: 'Jane Smith completed Zone Alpha survey',
    timestamp: '2 hours ago',
    sender: 'Jane Smith',
    status: 'read' as const,
  },
]

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => n.status === 'unread').length

  const typeConfig = {
    'help-request': { icon: HelpCircle, color: 'bg-orange-500' },
    alert: { icon: AlertTriangle, color: 'bg-destructive' },
    message: { icon: MessageCircle, color: 'bg-primary' },
    'task-update': { icon: CheckCircle, color: 'bg-emerald-500' },
  } as const

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Help requests, alerts, and messages</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {unreadCount} New
          </Badge>
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      <Card className="flex flex-col h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Live Feed</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-6 border-t">
              {mockNotifications.map((notification) => {
                const Icon = (typeConfig as any)[notification.type].icon
                const color = (typeConfig as any)[notification.type].color
                return (
                  <Card key={notification.id} className={cn(
                    "hover:shadow-md transition-all cursor-pointer border-l-4 p-4",
                    notification.status === 'unread' ? 'bg-accent/50 border-l-primary' : 'hover:bg-accent/30',
                    `border-l-${color}`
                  )}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className={`w-12 h-12 rounded-lg ${color}/10 flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                          <Badge variant={notification.status === 'unread' ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
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
            <CardTitle className="text-2xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Help Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-destructive">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-destructive uppercase font-semibold tracking-wide">Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Messages</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

