'use client'

import * as React from 'react'
import {
  Bell, AlertTriangle, CheckCircle2, Info, MessageSquare,
  ClipboardList, Users, Trash2, CheckCheck, Filter, Radio,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type NotifType = 'alert' | 'success' | 'info' | 'message' | 'submission' | 'system'

interface Notification {
  id: string
  type: NotifType
  title: string
  description: string
  from?: string
  time: string
  unread: boolean
}

const notifications: Notification[] = [
  { id: '1', type: 'alert', title: 'Help Request: Zone C GPS Issue', description: 'Team Beta agent Osei Mensah is reporting GPS signal failure in northern Zone C boundary.', from: 'Osei Mensah · Team Beta', time: '2m ago', unread: true },
  { id: '2', type: 'submission', title: 'Form Batch Received', description: 'Team Alpha submitted 22 forms from Zone A sector 3. Pending your review.', from: 'Team Alpha', time: '15m ago', unread: true },
  { id: '3', type: 'alert', title: 'Inactive Agent Detected', description: 'Sule Bah has been idle in Zone E for 42 minutes. Last known position: coords -1.305, 36.856.', from: 'System', time: '18m ago', unread: true },
  { id: '4', type: 'message', title: 'Message from James Kariuki', description: 'Hi, Team Beta has completed the northern half of Zone C. We need reassignment to Zone D soon.', from: 'James Kariuki · Team Beta Leader', time: '1h ago', unread: true },
  { id: '5', type: 'success', title: 'Task Completed', description: 'GPS calibration check has been marked as completed by Amara Diallo.', from: 'Amara Diallo · Team Gamma Leader', time: '2h ago', unread: false },
  { id: '6', type: 'submission', title: 'New Member Submission', description: 'Tewodros Bekele submitted 3 household surveys. Total: 19 submissions.', from: 'Tewodros Bekele · Team Alpha', time: '3h ago', unread: false },
  { id: '7', type: 'alert', title: 'Zone Overlap Warning', description: 'Zone C and Zone B have agents in overlapping areas. Review zone boundaries to avoid duplicate data.', from: 'System', time: '4h ago', unread: false },
  { id: '8', type: 'info', title: 'Daily Field Summary', description: 'Today: 48 submissions · 39 agents active · 5 zones covered · No critical incidents.', from: 'System', time: '6h ago', unread: false },
  { id: '9', type: 'message', title: 'Message from Chioma Obi', description: 'Team Delta needs 2 more members. Zone F is larger than expected. Can we get reinforcements?', from: 'Chioma Obi · Team Delta Leader', time: '8h ago', unread: false },
  { id: '10', type: 'success', title: 'Zone H Survey Complete', description: 'Team Echo has achieved 100% coverage of Zone H. Market Survey form completed with 28 submissions.', from: 'Team Echo', time: '1d ago', unread: false },
]

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  alert: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Alert' },
  success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Success' },
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', label: 'Info' },
  message: { icon: MessageSquare, color: 'text-chart-2', bg: 'bg-chart-2/10', label: 'Message' },
  submission: { icon: ClipboardList, color: 'text-chart-3', bg: 'bg-chart-3/10', label: 'Submission' },
  system: { icon: Radio, color: 'text-muted-foreground', bg: 'bg-muted', label: 'System' },
}

export default function SupervisorNotificationsPage() {
  const [notifs, setNotifs] = React.useState(notifications)
  const [filter, setFilter] = React.useState('all')

  const unread = notifs.filter(n => n.unread)
  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => n.unread) : notifs.filter(n => n.type === filter)

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      <DashboardHeader
        title="Notifications"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Notifications' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                {unread.length > 0 && (
                  <Badge variant="destructive">{unread.length} unread</Badge>
                )}
              </div>
              <p className="text-muted-foreground">Help requests, task updates, and field alerts</p>
            </div>
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread.length === 0}>
              <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
            </Button>
          </div>

          {/* Type stats */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(typeConfig).map(([type, cfg]) => {
              const count = notifs.filter(n => n.type === type).length
              if (count === 0) return null
              const Icon = cfg.icon
              return (
                <div key={type} className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium cursor-pointer', cfg.bg, cfg.color)} onClick={() => setFilter(f => f === type ? 'all' : type)}>
                  <Icon className="h-3 w-3" />
                  {cfg.label} ({count})
                </div>
              )
            })}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="submission">Submissions</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{filtered.length} notifications</span>
          </div>

          {/* Notification List */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No notifications to show</p>
                </CardContent>
              </Card>
            ) : filtered.map(notif => {
              const cfg = typeConfig[notif.type]
              const Icon = cfg.icon
              return (
                <Card key={notif.id} className={cn('transition-colors', notif.unread && 'border-primary/30 bg-primary/5')}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', cfg.bg)}>
                        <Icon className={cn('h-4 w-4', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-sm', notif.unread ? 'font-semibold' : 'font-medium')}>{notif.title}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            {notif.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.description}</p>
                        {notif.from && (
                          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Users className="h-3 w-3" /> {notif.from}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {notif.unread && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead(notif.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => dismiss(notif.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </main>
    </>
  )
}
