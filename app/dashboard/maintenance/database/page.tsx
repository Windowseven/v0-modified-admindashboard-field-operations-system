'use client'

import { useState } from 'react'
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Zap, HardDrive, Activity, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const queryTimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  avg: Math.floor(Math.random() * 15) + 5,
  p95: Math.floor(Math.random() * 50) + 25,
  p99: Math.floor(Math.random() * 100) + 70,
}))

const connectionData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  active: Math.floor(Math.random() * 80) + 60,
  idle: Math.floor(Math.random() * 40) + 20,
}))

const tableStats = [
  { name: 'users', rows: '12,450', size: '48 MB', avgQuery: '4ms', indexes: 5, status: 'healthy' },
  { name: 'sessions', rows: '89,231', size: '124 MB', avgQuery: '8ms', indexes: 3, status: 'healthy' },
  { name: 'form_submissions', rows: '341,087', size: '892 MB', avgQuery: '22ms', indexes: 4, status: 'warning' },
  { name: 'gps_locations', rows: '2,847,392', size: '4.2 GB', avgQuery: '45ms', indexes: 6, status: 'warning' },
  { name: 'audit_logs', rows: '1,234,567', size: '2.1 GB', avgQuery: '18ms', indexes: 3, status: 'healthy' },
  { name: 'teams', rows: '847', size: '2 MB', avgQuery: '2ms', indexes: 4, status: 'healthy' },
  { name: 'zones', rows: '423', size: '8 MB', avgQuery: '5ms', indexes: 3, status: 'healthy' },
  { name: 'notifications', rows: '567,234', size: '312 MB', avgQuery: '12ms', indexes: 2, status: 'healthy' },
]

const slowQueries = [
  { query: 'SELECT * FROM gps_locations WHERE team_id IN (...)', duration: '234ms', frequency: '12/hr', table: 'gps_locations' },
  { query: 'SELECT submissions JOIN forms WHERE zone_id = ?', duration: '189ms', frequency: '8/hr', table: 'form_submissions' },
  { query: 'UPDATE audit_logs SET read_at WHERE user_id = ?', duration: '145ms', frequency: '45/hr', table: 'audit_logs' },
  { query: 'SELECT COUNT(*) FROM sessions WHERE active = true', duration: '98ms', frequency: '120/hr', table: 'sessions' },
]

export default function DatabasePage() {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <DashboardHeader title="Database" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Database Health</h1>
              <p className="text-muted-foreground">Query performance, connections, and table statistics</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Connections', value: '128 / 500', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Avg Query Time', value: '12ms', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total DB Size', value: '7.8 GB', icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Slow Queries (1h)', value: '4', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', stat.bg)}>
                      <stat.icon className={cn('h-6 w-6', stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Query Response Time</CardTitle>
                <CardDescription>Avg, P95, and P99 latency over 24h (ms)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={queryTimeData}>
                      <defs>
                        <linearGradient id="dbAvgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="avg" name="Avg" stroke="hsl(var(--primary))" fill="url(#dbAvgGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="p95" name="P95" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="p99" name="P99" stroke="hsl(var(--destructive))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Pool</CardTitle>
                <CardDescription>Active vs idle connections over 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={connectionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="active" name="Active" stackId="a" fill="hsl(var(--primary))" />
                      <Bar dataKey="idle" name="Idle" stackId="a" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Current database resource consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Connection Pool (128/500)', value: 26 },
                  { label: 'Cache Hit Rate', value: 94 },
                  { label: 'Disk I/O', value: 62 },
                ].map((r) => (
                  <div key={r.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium">{r.value}%</span>
                    </div>
                    <Progress value={r.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tables">
            <TabsList>
              <TabsTrigger value="tables">Table Statistics</TabsTrigger>
              <TabsTrigger value="slow">Slow Queries</TabsTrigger>
            </TabsList>
            <TabsContent value="tables">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table</TableHead>
                        <TableHead>Rows</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Avg Query</TableHead>
                        <TableHead>Indexes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableStats.map((t) => (
                        <TableRow key={t.name}>
                          <TableCell><span className="font-mono text-sm">{t.name}</span></TableCell>
                          <TableCell>{t.rows}</TableCell>
                          <TableCell>{t.size}</TableCell>
                          <TableCell>{t.avgQuery}</TableCell>
                          <TableCell>{t.indexes}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={cn(t.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')}>
                              {t.status === 'healthy' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="slow">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Query</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowQueries.map((q, i) => (
                        <TableRow key={i}>
                          <TableCell><span className="font-mono text-xs text-muted-foreground">{q.query}</span></TableCell>
                          <TableCell><Badge variant="secondary" className="bg-amber-500/10 text-amber-500">{q.duration}</Badge></TableCell>
                          <TableCell>{q.frequency}</TableCell>
                          <TableCell><span className="font-mono text-xs">{q.table}</span></TableCell>
                          <TableCell><Button variant="outline" size="sm">Analyze</Button></TableCell>
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
