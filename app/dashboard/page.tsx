'use client'

import { useState } from 'react'
import {
  Users,
  FolderKanban,
  Activity,
  Server,
  Database,
  Globe,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Shield,
  Zap,
  RefreshCw,
  ArrowUpRight,
  Eye,
  Ban,
  UserX,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from 'recharts'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// System Health Data
const systemHealthData = {
  api: { status: 'healthy', latency: 45, uptime: 99.98 },
  database: { status: 'healthy', connections: 128, queryTime: 12 },
  websocket: { status: 'healthy', activeConnections: 847, messageRate: 1240 },
  storage: { status: 'warning', used: 78, total: 100 },
}

// Platform Stats
const platformStats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+124',
    changeType: 'increase' as const,
    icon: Users,
    breakdown: { active: 2341, inactive: 412, suspended: 94 },
  },
  {
    title: 'Supervisors',
    value: '47',
    change: '+3',
    changeType: 'increase' as const,
    icon: UserCheck,
    breakdown: { active: 45, pending: 2 },
  },
  {
    title: 'Active Projects',
    value: '156',
    change: '+12',
    changeType: 'increase' as const,
    icon: FolderKanban,
    breakdown: { running: 134, paused: 18, completed: 4 },
  },
  {
    title: 'Active Sessions',
    value: '847',
    change: '-23',
    changeType: 'decrease' as const,
    icon: Activity,
    description: 'Currently in field',
  },
]

// Activity Timeline Data
const activityData = [
  { time: '00:00', users: 120, submissions: 45, apiCalls: 890 },
  { time: '04:00', users: 80, submissions: 20, apiCalls: 450 },
  { time: '08:00', users: 450, submissions: 180, apiCalls: 2100 },
  { time: '12:00', users: 680, submissions: 320, apiCalls: 3400 },
  { time: '16:00', users: 720, submissions: 280, apiCalls: 3200 },
  { time: '20:00', users: 340, submissions: 120, apiCalls: 1800 },
  { time: '24:00', users: 150, submissions: 50, apiCalls: 920 },
]

// User Distribution
const userDistribution = [
  { name: 'Field Workers', value: 2456, color: 'hsl(var(--chart-1))' },
  { name: 'Team Leaders', value: 248, color: 'hsl(var(--chart-2))' },
  { name: 'Supervisors', value: 47, color: 'hsl(var(--chart-3))' },
  { name: 'Admins', value: 6, color: 'hsl(var(--chart-4))' },
]

// Recent Activity Feed
const recentActivity = [
  { id: 1, type: 'user_registered', message: 'New supervisor registered', user: 'John Doe', time: '2 min ago', icon: UserCheck },
  { id: 2, type: 'project_created', message: 'New project created', user: 'Sarah Smith', time: '5 min ago', icon: FolderKanban },
  { id: 3, type: 'security_alert', message: 'Multiple failed login attempts', user: 'System', time: '12 min ago', icon: Shield },
  { id: 4, type: 'user_blocked', message: 'User account suspended', user: 'Admin', time: '18 min ago', icon: Ban },
  { id: 5, type: 'backup_complete', message: 'Daily backup completed', user: 'System', time: '1 hour ago', icon: Database },
]

// Project Activity
const projectActivity = [
  { name: 'Mon', active: 134, new: 8 },
  { name: 'Tue', active: 138, new: 5 },
  { name: 'Wed', active: 142, new: 12 },
  { name: 'Thu', active: 148, new: 7 },
  { name: 'Fri', active: 156, new: 10 },
  { name: 'Sat', active: 152, new: 3 },
  { name: 'Sun', active: 156, new: 6 },
]

function SystemHealthCard({ 
  title, 
  status, 
  metrics 
}: { 
  title: string
  status: 'healthy' | 'warning' | 'critical'
  metrics: { label: string; value: string | number }[]
}) {
  const statusColors = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4">
      <div className={cn('h-3 w-3 rounded-full animate-pulse', statusColors[status])} />
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <div className="flex gap-4 mt-1">
          {metrics.map((metric, i) => (
            <span key={i} className="text-xs text-muted-foreground">
              {metric.label}: <span className="text-foreground">{metric.value}</span>
            </span>
          ))}
        </div>
      </div>
      <Badge variant={status === 'healthy' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}>
        {status}
      </Badge>
    </div>
  )
}

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <>
      <DashboardHeader title="System Overview" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                Platform Control Center
              </h1>
              <p className="text-muted-foreground">
                System-wide overview of the Field Sync platform
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          {/* System Health Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">System Health</CardTitle>
                  <CardDescription>Real-time status of all platform services</CardDescription>
                </div>
                <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  All Systems Operational
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SystemHealthCard
                title="API Server"
                status={systemHealthData.api.status as 'healthy'}
                metrics={[
                  { label: 'Latency', value: `${systemHealthData.api.latency}ms` },
                  { label: 'Uptime', value: `${systemHealthData.api.uptime}%` },
                ]}
              />
              <SystemHealthCard
                title="Database"
                status={systemHealthData.database.status as 'healthy'}
                metrics={[
                  { label: 'Connections', value: systemHealthData.database.connections },
                  { label: 'Query Time', value: `${systemHealthData.database.queryTime}ms` },
                ]}
              />
              <SystemHealthCard
                title="WebSocket"
                status={systemHealthData.websocket.status as 'healthy'}
                metrics={[
                  { label: 'Active', value: systemHealthData.websocket.activeConnections },
                  { label: 'Msg/sec', value: systemHealthData.websocket.messageRate },
                ]}
              />
              <SystemHealthCard
                title="Storage"
                status={systemHealthData.storage.status as 'warning'}
                metrics={[
                  { label: 'Used', value: `${systemHealthData.storage.used}%` },
                  { label: 'Total', value: `${systemHealthData.storage.total}GB` },
                ]}
              />
            </CardContent>
          </Card>

          {/* Platform Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((stat) => (
              <Card key={stat.title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        'font-mono',
                        stat.changeType === 'increase' && 'bg-emerald-500/10 text-emerald-500',
                        stat.changeType === 'decrease' && 'bg-amber-500/10 text-amber-500'
                      )}
                    >
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                  {stat.breakdown && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(stat.breakdown).map(([key, value]) => (
                        <span key={key} className="text-xs text-muted-foreground">
                          {key}: <span className="text-foreground font-medium">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Users, submissions, and API usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="api">API Calls</TabsTrigger>
                  </TabsList>
                  <TabsContent value="users" className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="hsl(var(--primary))"
                          fill="url(#colorUsers)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="submissions" className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="submissions"
                          stroke="hsl(var(--chart-2))"
                          fill="url(#colorSubmissions)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="api" className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="apiCalls"
                          stroke="hsl(var(--chart-3))"
                          fill="url(#colorApi)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by role across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--background))"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {userDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system events and actions</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full',
                        activity.type === 'security_alert' && 'bg-amber-500/10',
                        activity.type === 'user_blocked' && 'bg-red-500/10',
                        activity.type !== 'security_alert' && activity.type !== 'user_blocked' && 'bg-primary/10'
                      )}>
                        <activity.icon className={cn(
                          'h-4 w-4',
                          activity.type === 'security_alert' && 'text-amber-500',
                          activity.type === 'user_blocked' && 'text-red-500',
                          activity.type !== 'security_alert' && activity.type !== 'user_blocked' && 'text-primary'
                        )} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Project Activity</CardTitle>
                <CardDescription>Active projects and new creations this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="active" name="Active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="new" name="New" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Manage Users</p>
                    <p className="text-xs text-muted-foreground">View and manage all users</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">View Projects</p>
                    <p className="text-xs text-muted-foreground">Monitor all projects</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Security Center</p>
                    <p className="text-xs text-muted-foreground">Review security alerts</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">System Health</p>
                    <p className="text-xs text-muted-foreground">Check system status</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
