'use client'

import { useState } from 'react'
import { Globe, RefreshCw, CheckCircle2, AlertTriangle, Zap, Activity, TrendingUp, Clock, XCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const requestsData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  requests: Math.floor(Math.random() * 3000) + 1000,
  errors: Math.floor(Math.random() * 30) + 2,
  latency: Math.floor(Math.random() * 40) + 20,
}))

const endpointData = [
  { endpoint: 'POST /api/locations', method: 'POST', requests: '24,521', avgLatency: '18ms', errorRate: '0.01%', p99: '120ms', status: 'healthy' },
  { endpoint: 'GET /api/users', method: 'GET', requests: '12,847', avgLatency: '25ms', errorRate: '0.02%', p99: '180ms', status: 'healthy' },
  { endpoint: 'POST /api/submissions', method: 'POST', requests: '8,234', avgLatency: '45ms', errorRate: '0.08%', p99: '310ms', status: 'healthy' },
  { endpoint: 'GET /api/teams', method: 'GET', requests: '7,891', avgLatency: '12ms', errorRate: '0.00%', p99: '80ms', status: 'healthy' },
  { endpoint: 'POST /api/auth/login', method: 'POST', requests: '3,421', avgLatency: '89ms', errorRate: '2.1%', p99: '450ms', status: 'warning' },
  { endpoint: 'GET /api/zones', method: 'GET', requests: '2,984', avgLatency: '15ms', errorRate: '0.01%', p99: '90ms', status: 'healthy' },
  { endpoint: 'POST /api/auth/otp', method: 'POST', requests: '1,247', avgLatency: '234ms', errorRate: '4.3%', p99: '890ms', status: 'warning' },
  { endpoint: 'DELETE /api/sessions', method: 'DELETE', requests: '892', avgLatency: '22ms', errorRate: '0.00%', p99: '110ms', status: 'healthy' },
]

const recentErrors = [
  { time: '14:32:01', method: 'POST', endpoint: '/api/auth/otp', status: 429, message: 'Too Many Requests', user: 'anon', count: 47 },
  { time: '14:28:15', method: 'POST', endpoint: '/api/submissions', status: 422, message: 'Validation Error: required field', user: 'james.mwangi', count: 12 },
  { time: '14:15:44', method: 'GET', endpoint: '/api/locations', status: 503, message: 'WebSocket timeout', user: 'system', count: 3 },
  { time: '13:58:22', method: 'POST', endpoint: '/api/auth/login', status: 401, message: 'Invalid credentials', user: 'anon', count: 89 },
]

const methodBreakdown = [
  { method: 'GET', count: 48200, color: 'hsl(var(--primary))' },
  { method: 'POST', count: 23100, color: 'hsl(var(--chart-2))' },
  { method: 'PUT', count: 4200, color: 'hsl(var(--chart-3))' },
  { method: 'DELETE', count: 1800, color: 'hsl(var(--chart-4))' },
]

const statusColors: Record<number, string> = {
  429: 'bg-amber-500/10 text-amber-500',
  422: 'bg-blue-500/10 text-blue-500',
  503: 'bg-destructive/10 text-destructive',
  401: 'bg-amber-500/10 text-amber-500',
}

export default function ApiMonitorPage() {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <DashboardHeader title="API Monitor" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">API Monitor</h1>
              <p className="text-muted-foreground">Endpoint performance, error rates, and request traffic</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3 w-3 mr-1" /> API Operational
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Requests (1h)', value: '24.5K', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Avg Latency', value: '38ms', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Error Rate', value: '0.12%', icon: XCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'P99 Latency', value: '312ms', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', s.bg)}>
                      <s.icon className={cn('h-6 w-6', s.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Request Volume & Latency</CardTitle>
                <CardDescription>Requests and avg latency over 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={requestsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="requests" name="Requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By HTTP Method</CardTitle>
                <CardDescription>Request distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {methodBreakdown.map((m) => (
                  <div key={m.method} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="font-mono font-medium">{m.method}</span>
                      </div>
                      <span className="text-muted-foreground">{m.count.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(m.count / 48200) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">Total: 77,300 requests in the last hour</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Table & Recent Errors */}
          <Tabs defaultValue="endpoints">
            <TabsList>
              <TabsTrigger value="endpoints">Endpoint Performance</TabsTrigger>
              <TabsTrigger value="errors">Recent Errors</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Requests (1h)</TableHead>
                        <TableHead>Avg Latency</TableHead>
                        <TableHead>P99</TableHead>
                        <TableHead>Error Rate</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {endpointData.map((e) => (
                        <TableRow key={e.endpoint}>
                          <TableCell><span className="font-mono text-sm">{e.endpoint}</span></TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-[10px]">{e.method}</Badge>
                          </TableCell>
                          <TableCell>{e.requests}</TableCell>
                          <TableCell>{e.avgLatency}</TableCell>
                          <TableCell>{e.p99}</TableCell>
                          <TableCell>
                            <span className={cn('text-sm font-medium', e.status === 'warning' ? 'text-amber-500' : 'text-emerald-500')}>
                              {e.errorRate}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={e.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
                              {e.status === 'healthy' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                              {e.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentErrors.map((e, i) => (
                        <TableRow key={i}>
                          <TableCell><span className="font-mono text-xs">{e.time}</span></TableCell>
                          <TableCell><Badge variant="secondary" className="font-mono text-[10px]">{e.method}</Badge></TableCell>
                          <TableCell><span className="font-mono text-sm">{e.endpoint}</span></TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusColors[e.status] ?? 'bg-muted text-muted-foreground'}>
                              {e.status}
                            </Badge>
                          </TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{e.message}</span></TableCell>
                          <TableCell><span className="font-mono text-xs">{e.user}</span></TableCell>
                          <TableCell><Badge variant="secondary">{e.count}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </>
  )
}
