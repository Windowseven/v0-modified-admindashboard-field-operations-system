'use client'

import { useState } from 'react'
import {
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  Zap,
  ThermometerSun,
  ArrowUpDown,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Performance data
const cpuData = Array.from({ length: 60 }, (_, i) => ({
  time: `${i}s`,
  value: Math.floor(Math.random() * 30) + 50,
}))

const memoryData = Array.from({ length: 60 }, (_, i) => ({
  time: `${i}s`,
  value: Math.floor(Math.random() * 15) + 65,
}))

const networkData = Array.from({ length: 60 }, (_, i) => ({
  time: `${i}s`,
  inbound: Math.floor(Math.random() * 500) + 200,
  outbound: Math.floor(Math.random() * 300) + 100,
}))

// Server instances
const serverInstances = [
  { id: 'app-01', name: 'App Server 1', status: 'healthy', cpu: 65, memory: 72, region: 'us-east-1', uptime: '14d 6h' },
  { id: 'app-02', name: 'App Server 2', status: 'healthy', cpu: 58, memory: 68, region: 'us-east-1', uptime: '14d 6h' },
  { id: 'api-01', name: 'API Server 1', status: 'healthy', cpu: 72, memory: 75, region: 'us-west-2', uptime: '7d 12h' },
  { id: 'api-02', name: 'API Server 2', status: 'warning', cpu: 88, memory: 82, region: 'us-west-2', uptime: '7d 12h' },
  { id: 'ws-01', name: 'WebSocket Server', status: 'healthy', cpu: 45, memory: 55, region: 'us-east-1', uptime: '14d 6h' },
  { id: 'worker-01', name: 'Background Worker', status: 'healthy', cpu: 32, memory: 48, region: 'us-east-1', uptime: '3d 8h' },
]

// System services
const systemServices = [
  { name: 'API Gateway', status: 'running', latency: '45ms', requests: '24.5K/hr' },
  { name: 'Authentication Service', status: 'running', latency: '12ms', requests: '8.2K/hr' },
  { name: 'WebSocket Handler', status: 'running', latency: '8ms', requests: '1.2M/hr' },
  { name: 'Background Jobs', status: 'running', latency: '-', requests: '450/hr' },
  { name: 'File Storage', status: 'running', latency: '120ms', requests: '2.1K/hr' },
  { name: 'Email Service', status: 'running', latency: '250ms', requests: '180/hr' },
  { name: 'Notification Service', status: 'running', latency: '15ms', requests: '5.4K/hr' },
]

export default function ServerStatusPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <>
      <DashboardHeader title="Server Status" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                Server Status
              </h1>
              <p className="text-muted-foreground">
                Real-time server monitoring and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
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
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-sm text-muted-foreground">Active Servers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Clock className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">99.98%</p>
                    <p className="text-sm text-muted-foreground">Uptime (30d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45ms</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Regions Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Performance</CardTitle>
              <CardDescription>Live system metrics (last 60 seconds)</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cpu">
                <TabsList className="mb-4">
                  <TabsTrigger value="cpu">CPU</TabsTrigger>
                  <TabsTrigger value="memory">Memory</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                </TabsList>
                <TabsContent value="cpu" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuData}>
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`${value}%`, 'CPU Usage']}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#cpuGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="memory" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memoryData}>
                      <defs>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`${value}%`, 'Memory Usage']}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" fill="url(#memGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="network" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={networkData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value, name) => [`${value} KB/s`, name === 'inbound' ? 'Inbound' : 'Outbound']}
                      />
                      <Line type="monotone" dataKey="inbound" name="inbound" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="outbound" name="outbound" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Server Instances */}
          <Card>
            <CardHeader>
              <CardTitle>Server Instances</CardTitle>
              <CardDescription>All active server instances and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Uptime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serverInstances.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{server.name}</p>
                            <p className="text-xs text-muted-foreground">{server.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            server.status === 'healthy' && 'bg-emerald-500/10 text-emerald-500',
                            server.status === 'warning' && 'bg-amber-500/10 text-amber-500'
                          )}
                        >
                          {server.status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {server.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {server.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={server.cpu} className={cn('h-2 w-16', server.cpu > 80 && '[&>div]:bg-amber-500')} />
                          <span className="text-sm">{server.cpu}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={server.memory} className={cn('h-2 w-16', server.memory > 80 && '[&>div]:bg-amber-500')} />
                          <span className="text-sm">{server.memory}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{server.region}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{server.uptime}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>System Services</CardTitle>
              <CardDescription>Status of all platform services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {systemServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.latency !== '-' ? `${service.latency} latency` : 'Background service'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{service.requests}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
