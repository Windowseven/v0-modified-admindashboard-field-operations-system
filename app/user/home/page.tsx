'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Play, Square, MapPin, FileText, ClipboardList,
  Users, RefreshCw, Bell, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Wifi, WifiOff, Zap,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  mockUserProfile,
  mockUserSession,
  mockUserTasks,
  mockUserForms,
  mockNearbyTeam,
  mockUserNotifications,
  syncSummary,
  taskSummary,
} from '@/lib/mock-user'

export default function UserHomePage() {
  const [sessionActive, setSessionActive] = useState(mockUserSession.status === 'active')
  const [sessionTime, setSessionTime] = useState(mockUserSession.duration)

  const unreadNotifs = mockUserNotifications.filter((n) => !n.isRead).length
  const pendingTasks = mockUserTasks.filter((t) => t.status === 'pending' || t.status === 'in-progress')
  const urgentTask = pendingTasks.find((t) => t.priority === 'high' && t.status === 'in-progress')
  const onlineTeam = mockNearbyTeam.filter((m) => m.status === 'online').length
  const formsSubmitted = mockUserForms.filter((f) => f.status === 'submitted').length

  const quickStats = [
    {
      label: 'Tasks Done',
      value: `${taskSummary.completed}/${taskSummary.total}`,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Forms Submitted',
      value: formsSubmitted,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Nearby Team',
      value: `${onlineTeam} online`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Sync Status',
      value: syncSummary.failed > 0 ? `${syncSummary.failed} failed` : syncSummary.pending > 0 ? `${syncSummary.pending} pending` : 'All synced',
      icon: syncSummary.failed > 0 ? WifiOff : Wifi,
      color: syncSummary.failed > 0 ? 'text-destructive' : syncSummary.pending > 0 ? 'text-amber-500' : 'text-emerald-500',
      bg: syncSummary.failed > 0 ? 'bg-destructive/10' : syncSummary.pending > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
    },
  ]

  const taskStatusColor = {
    pending: 'text-muted-foreground bg-muted/60',
    'in-progress': 'text-amber-700 bg-amber-500/10 dark:text-amber-400',
    completed: 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400',
  }

  const priorityDot = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-muted-foreground',
  }

  return (
    <>
      <DashboardHeader
        title="My Dashboard"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Home' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          {/* ── Greeting + Zone ────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Hello, {mockUserProfile.firstName} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {mockUserProfile.assignedZone}
              </span>
              <span className="text-border">·</span>
              <span>{mockUserProfile.teamName}</span>
              <span className="text-border">·</span>
              <span>{mockUserProfile.assignedProject}</span>
            </div>
          </div>

          {/* ── Session Control ────────────────────────────────────── */}
          <Card className={cn(
            'border-2 transition-colors',
            sessionActive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-dashed border-muted-foreground/30'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full shrink-0',
                    sessionActive ? 'bg-emerald-500/15' : 'bg-muted'
                  )}>
                    <Clock className={cn('h-5 w-5', sessionActive ? 'text-emerald-500' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <p className={cn('text-sm font-bold', sessionActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground')}>
                      {sessionActive ? 'Session Active' : 'Session Not Started'}
                    </p>
                    {sessionActive ? (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        Started {mockUserSession.startedAt} · {sessionTime}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Start your session to begin tracking</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={sessionActive ? 'outline' : 'default'}
                  onClick={() => setSessionActive(!sessionActive)}
                  className={cn(
                    'gap-2 shrink-0',
                    sessionActive ? 'border-destructive/40 text-destructive hover:bg-destructive/5' : ''
                  )}
                >
                  {sessionActive ? (
                    <><Square className="h-3.5 w-3.5 fill-current" /> End Session</>
                  ) : (
                    <><Play className="h-3.5 w-3.5 fill-current" /> Start Session</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Quick Stats ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg mb-2', stat.bg)}>
                    <stat.icon className={cn('h-4 w-4', stat.color)} />
                  </div>
                  <p className="text-lg font-bold leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Focus: Current Task ────────────────────────────────── */}
          {urgentTask && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Focus Right Now
                  </CardTitle>
                  <Badge variant="secondary" className="text-amber-700 bg-amber-500/15 border-amber-500/20 text-[10px]">
                    In Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm">{urgentTask.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {urgentTask.location}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> Due {urgentTask.deadline}
                  </p>
                </div>
                {urgentTask.linkedForm && (
                  <Button asChild size="sm" className="w-full gap-2">
                    <Link href={`/user/forms/${urgentTask.linkedForm}`}>
                      <FileText className="h-4 w-4" />
                      Open Form
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Today's Tasks ──────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Today's Tasks
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <Link href="/user/tasks">
                    All Tasks <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-4 px-4">
              {mockUserTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg p-3 bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <span className={cn('h-2 w-2 rounded-full shrink-0', priorityDot[task.priority])} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-xs font-medium truncate',
                      task.status === 'completed' && 'line-through text-muted-foreground'
                    )}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{task.deadline}</p>
                  </div>
                  <Badge className={cn('text-[10px] px-1.5 shrink-0 border-0', taskStatusColor[task.status])}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'completed' ? 'Done' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Quick Access Grid ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Open Forms', icon: FileText, href: '/user/forms', color: 'text-primary', bg: 'bg-primary/10', desc: 'Fill & submit' },
              { label: 'My Map', icon: MapPin, href: '/user/map', color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'View your zone' },
              { label: 'Nearby Team', icon: Users, href: '/user/team', color: 'text-purple-500', bg: 'bg-purple-500/10', desc: `${onlineTeam} online` },
              { label: 'Notifications', icon: Bell, href: '/user/notifications', color: 'text-amber-500', bg: 'bg-amber-500/10', desc: `${unreadNotifs} unread` },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', item.bg)}>
                      <item.icon className={cn('h-5 w-5', item.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* ── Sync Nudge ─────────────────────────────────────────── */}
          {(syncSummary.pending > 0 || syncSummary.failed > 0) && (
            <Link href="/user/sync">
              <Card className={cn(
                'border cursor-pointer hover:shadow-md transition-all',
                syncSummary.failed > 0 ? 'border-destructive/30 bg-destructive/5' : 'border-amber-500/30 bg-amber-500/5'
              )}>
                <CardContent className="p-4 flex items-center gap-3">
                  {syncSummary.failed > 0
                    ? <WifiOff className="h-5 w-5 text-destructive shrink-0" />
                    : <RefreshCw className="h-5 w-5 text-amber-500 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {syncSummary.failed > 0
                        ? `${syncSummary.failed} submission${syncSummary.failed > 1 ? 's' : ''} failed to sync`
                        : `${syncSummary.pending} pending sync`}
                    </p>
                    <p className="text-xs text-muted-foreground">Tap to view sync status</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          )}

        </div>
      </main>
    </>
  )
}
