'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Gauge,
  Server,
  Database,
  HardDrive,
  Bug,
  Zap,
  RefreshCw,
  Globe,
  ToggleLeft,
  TestTube,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Activity,
  Clock,
  TrendingUp,
  Cpu,
  MemoryStick,
  Wifi,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// System metrics over time
const performanceData = [
  { time: '00:00', cpu: 45, memory: 62, network: 120 },
  { time: '02:00', cpu: 38, memory: 58, network: 90 },
  { time: '04:00', cpu: 32, memory: 55, network: 60 },
  { time: '06:00', cpu: 48, memory: 60, network: 180 },
  { time: '08:00', cpu: 72, memory: 75, network: 420 },
  { time: '10:00', cpu: 85, memory: 82, network: 580 },
  { time: '12:00', cpu: 78, memory: 78, network: 520 },
  { time: '14:00', cpu: 82, memory: 80, network: 490 },
  { time: '16:00', cpu: 68, memory: 72, network: 380 },
  { time: '18:00', cpu: 55, memory: 65, network: 280 },
  { time: '20:00', cpu: 42, memory: 60, network: 160 },
  { time: '22:00', cpu: 38, memory: 58, network: 100 },
]

// Maintenance sections
const maintenanceSections = [
  {
    title: 'Server Status',
    description: 'Monitor server performance and uptime',
    icon: Server,
    href: '/dashboard/maintenance/server',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Uptime', value: '99.98%' },
      { label: 'Response', value: '45ms' },
    ],
  },
  {
    title: 'Database',
    description: 'Database health and query performance',
    icon: Database,
    href: '/dashboard/maintenance/database',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Connections', value: '128/500' },
      { label: 'Query Time', value: '12ms' },
    ],
  },
  {
    title: 'Backup & Restore',
    description: 'Data backups and recovery options',
    icon: HardDrive,
    href: '/dashboard/maintenance/backup',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Last Backup', value: '2h ago' },
      { label: 'Size', value: '4.2GB' },
    ],
  },
  {
    title: 'Error Tracking',
    description: 'Monitor and debug system errors',
    icon: Bug,
    href: '/dashboard/maintenance/errors',
    status: 'warning' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Errors (24h)', value: '23' },
      { label: 'Critical', value: '2' },
    ],
  },
  {
    title: 'Rate Limiting',
    description: 'API rate limits and abuse control',
    icon: Zap,
    href: '/dashboard/maintenance/rate-limits',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Blocked', value: '147' },
      { label: 'Limit', value: '1000/min' },
    ],
  },
  {
    title: 'Sync Monitor',
    description: 'Offline sync status and conflicts',
    icon: RefreshCw,
    href: '/dashboard/maintenance/sync',
    status: 'warning' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Pending', value: '34' },
      { label: 'Failed', value: '3' },
    ],
  },
  {
    title: 'Storage',
    description: 'Storage usage and file management',
    icon: HardDrive,
    href: '/dashboard/maintenance/storage',
    status: 'warning' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Used', value: '78%' },
      { label: 'Files', value: '12.4K' },
    ],
  },
  {
    title: 'API Monitor',
    description: 'API endpoints and performance',
    icon: Globe,
    href: '/dashboard/maintenance/api',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Requests (1h)', value: '24.5K' },
      { label: 'Errors', value: '0.02%' },
    ],
  },
  {
    title: 'Feature Flags',
    description: 'Toggle features dynamically',
    icon: ToggleLeft,
    href: '/dashboard/maintenance/features',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Active', value: '12' },
      { label: 'Beta', value: '3' },
    ],
  },
  {
    title: 'Test Environment',
    description: 'Sandbox and testing tools',
    icon: TestTube,
    href: '/dashboard/maintenance/sandbox',
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    metrics: [
      { label: 'Test Users', value: '5' },
      { label: 'Test Data', value: '1.2GB' },
    ],
  },
]

// Current system status
const systemStatus = {
  cpu: 68,
  memory: 72,
  disk: 78,
  network: 'healthy' as const,
  uptime: '14d 6h 23m',
  lastRestart: '2 weeks ago',
}

function StatusBadge({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-medium',
        status === 'healthy' && 'bg-emerald-500/10 text-emerald-500',
        status === 'warning' && 'bg-amber-500/10 text-amber-500',
        status === 'critical' && 'bg-red-500/10 text-red-500'
      )}
    >
      {status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {status === 'critical' && <XCircle className="h-3 w-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function MaintenancePage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const healthyCount = maintenanceSections.filter(s => s.status === 'healthy').length
  const warningCount = maintenanceSections.filter(s => s.status === 'warning').length
  const criticalCount = maintenanceSections.filter(s => s.status === 'critical').length

  return (
    <>
      <DashboardHeader title="System Maintenance" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                System Health Center
              </h1>
              <p className="text-muted-foreground">
                Monitor, maintain, and optimize platform infrastructure
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
                Refresh All
              </Button>
            </div>
          </div>

          {/* Overall Status Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{healthyCount}</p>
                    <p className="text-sm text-muted-foreground">Healthy Systems</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{warningCount}</p>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{criticalCount}</p>
                    <p className="text-sm text-muted-foreground">Critical Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{systemStatus.uptime}</p>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Metrics */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>CPU, Memory, and Network usage over 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
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
                      <Line type="monotone" dataKey="cpu" name="CPU %" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="memory" name="Memory %" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Current Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Current Load</CardTitle>
                <CardDescription>Real-time resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium">{systemStatus.cpu}%</span>
                  </div>
                  <Progress value={systemStatus.cpu} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium">{systemStatus.memory}%</span>
                  </div>
                  <Progress value={systemStatus.memory} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Disk Usage</span>
                    </div>
                    <span className="text-sm font-medium">{systemStatus.disk}%</span>
                  </div>
                  <Progress value={systemStatus.disk} className={cn('h-2', systemStatus.disk > 75 && '[&>div]:bg-amber-500')} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Network Status</span>
                  </div>
                  <StatusBadge status={systemStatus.network} />
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                  Last restart: {systemStatus.lastRestart}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Sections Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Maintenance Modules</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {maintenanceSections.map((section) => (
                <Link key={section.href} href={section.href}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <StatusBadge status={section.status} />
                      </div>
                      <h3 className="font-semibold mb-1">{section.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{section.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.metrics.map((metric, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {metric.label}: <span className="font-medium">{metric.value}</span>
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
