'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users, Activity, MapPin, ClipboardList, CheckCircle2,
  Clock, AlertTriangle, RefreshCw, ArrowUpRight, TrendingUp,
  TrendingDown, UsersRound, Layers, UserPlus, Radio,
  BarChart3, Bell, History, FolderOpen, Play, Pause,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const projectStats = [
  {
    title: 'Team Members',
    value: '42',
    change: '+3',
    up: true,
    icon: Users,
    breakdown: { online: 28, offline: 11, idle: 3 },
  },
  {
    title: 'Active Sessions',
    value: '28',
    change: '+5',
    up: true,
    icon: Activity,
    breakdown: { field: 24, idle: 4 },
  },
  {
    title: 'Tasks Progress',
    value: '67%',
    change: '+12%',
    up: true,
    icon: ClipboardList,
    breakdown: { completed: 134, pending: 66 },
  },
  {
    title: 'Zones Covered',
    value: '8/12',
    change: '+2',
    up: true,
    icon: MapPin,
    breakdown: { active: 8, pending: 4 },
  },
]

const submissionTrend = [
  { time: '08:00', submissions: 12, active: 18 },
  { time: '10:00', submissions: 34, active: 26 },
  { time: '12:00', submissions: 28, active: 30 },
  { time: '14:00', submissions: 45, active: 28 },
  { time: '16:00', submissions: 38, active: 22 },
  { time: '18:00', submissions: 20, active: 15 },
]

const teamPerformance = [
  { name: 'Alpha', completed: 45, pending: 12, members: 9 },
  { name: 'Beta', completed: 38, pending: 18, members: 8 },
  { name: 'Gamma', completed: 29, pending: 14, members: 7 },
  { name: 'Delta', completed: 22, pending: 22, members: 10 },
  { name: 'Echo', completed: 18, pending: 10, members: 8 },
]

const recentActivity = [
  { message: 'Team Alpha completed Zone A survey', sub: 'Sarah Johnson · 45 submissions', time: '5m ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { message: 'Help request from Team Beta', sub: 'Zone C — GPS signal weak', time: '12m ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { message: 'New member joined the project', sub: 'kwame.asante@survey.co', time: '31m ago', icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  { message: 'Form submission batch received', sub: 'Team Gamma · 29 entries', time: '1h ago', icon: ClipboardList, color: 'text-chart-2', bg: 'bg-chart-2/10' },
  { message: 'Zone B boundaries updated', sub: 'Overlapping area resolved', time: '2h ago', icon: Layers, color: 'text-chart-3', bg: 'bg-chart-3/10' },
]

const teams = [
  { name: 'Team Alpha', leader: 'Sarah Johnson', members: 9, progress: 79, status: 'active' as const, zone: 'Zone A' },
  { name: 'Team Beta', leader: 'James Kariuki', members: 8, progress: 68, status: 'active' as const, zone: 'Zone C' },
  { name: 'Team Gamma', leader: 'Amara Diallo', members: 7, progress: 55, status: 'active' as const, zone: 'Zone E' },
  { name: 'Team Delta', leader: 'Chioma Obi', members: 10, progress: 50, status: 'idle' as const, zone: 'Zone F' },
  { name: 'Team Echo', leader: 'Mwangi Njoroge', members: 8, progress: 64, status: 'active' as const, zone: 'Zone H' },
]

const statusColors = {
  active: 'text-emerald-500',
  idle: 'text-amber-500',
  paused: 'text-muted-foreground',
}

const quickActions = [
  { label: 'Live Map', sub: 'Track field agents', icon: Radio, href: '/supervisor/map', badge: 'Live' },
  { label: 'Teams', sub: 'Manage & assign', icon: UsersRound, href: '/supervisor/teams' },
  { label: 'Zones', sub: 'Draw & configure', icon: Layers, href: '/supervisor/zones' },
  { label: 'Forms & Tasks', sub: 'Assign & review', icon: ClipboardList, href: '/supervisor/forms' },
  { label: 'Project Users', sub: 'View & manage', icon: Users, href: '/supervisor/users' },
  { label: 'Invitations', sub: 'Invite new members', icon: UserPlus, href: '/supervisor/invitations' },
  { label: 'Analytics', sub: 'Performance stats', icon: BarChart3, href: '/supervisor/analytics' },
  { label: 'Audit Logs', sub: 'Project activity trail', icon: History, href: '/supervisor/audit' },
]

export default function SupervisorOverviewPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [projectStatus, setProjectStatus] = useState<'active' | 'paused'>('active')

  return (
    <>
      <DashboardHeader
        title="Project Overview"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Urban Survey — Nairobi</h1>
                <Badge variant="secondary" className={cn('gap-1', projectStatus === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', projectStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                  {projectStatus === 'active' ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <p className="text-muted-foreground">Project Overview · Supervisor control center</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProjectStatus(s => s === 'active' ? 'paused' : 'active')}
                className={projectStatus === 'active' ? 'text-amber-500 border-amber-500/30 hover:bg-amber-500/10' : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}
              >
                {projectStatus === 'active' ? <><Pause className="h-4 w-4 mr-1" /> Pause Project</> : <><Play className="h-4 w-4 mr-1" /> Resume Project</>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          {/* Project Info Bar */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Urban Survey — Nairobi</span>
                </div>
                <div className="text-sm text-muted-foreground">5 Teams · 12 Zones · 200 Forms</div>
                <div className="text-sm text-muted-foreground">Started: Mar 1, 2026</div>
                <div className="text-sm text-muted-foreground">Deadline: Jun 30, 2026</div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Overall Progress</span>
                  <Progress value={67} className="w-32 h-2" />
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectStats.map((stat) => (
              <Card key={stat.title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className={cn('font-mono', stat.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')}>
                      {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(stat.breakdown).map(([key, value]) => (
                      <span key={key} className="text-xs text-muted-foreground">
                        {key}: <span className="text-foreground font-medium">{value}</span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Field Activity Today</CardTitle>
                <CardDescription>Form submissions and active agents throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={submissionTrend}>
                      <defs>
                        <linearGradient id="gradSubmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="submissions" name="Submissions" stroke="hsl(var(--primary))" fill="url(#gradSubmissions)" strokeWidth={2} />
                      <Area type="monotone" dataKey="active" name="Active Agents" stroke="hsl(var(--chart-2))" fill="url(#gradActive)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Completed vs pending tasks per team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={40} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="completed" name="Done" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams + Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Team Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Status</CardTitle>
                    <CardDescription>Live overview of all field teams</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/supervisor/teams">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams.map((team) => (
                    <div key={team.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <UsersRound className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{team.name}</p>
                          <span className={cn('text-xs font-medium capitalize', statusColors[team.status])}>{team.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{team.leader} · {team.zone} · {team.members} members</p>
                        <Progress value={team.progress} className="mt-1.5 h-1.5" />
                      </div>
                      <span className="text-sm font-semibold shrink-0">{team.progress}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest project events and field updates</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/supervisor/audit">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', a.bg)}>
                        <a.icon className={cn('h-4 w-4', a.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{a.message}</p>
                        <p className="text-xs text-muted-foreground truncate">{a.sub} · {a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to any supervisor section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {quickActions.map((action) => (
                  <Button key={action.href} variant="outline" className="h-auto flex-col items-start p-4 gap-2 relative" asChild>
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-medium flex items-center gap-2">
                          {action.label}
                          {action.badge && <Badge variant="default" className="h-4 px-1.5 text-[9px]">{action.badge}</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.sub}</p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
