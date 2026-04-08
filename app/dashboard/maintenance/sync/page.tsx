'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock, Wifi, WifiOff, Users, FileText } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const syncActivityData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  synced: Math.floor(Math.random() * 80) + 40,
  pending: Math.floor(Math.random() * 20) + 5,
  failed: Math.floor(Math.random() * 5),
}))

const pendingSyncs = [
  { id: 'sync-001', user: 'James Mwangi', device: 'Samsung Galaxy A54', records: 23, type: 'Form Submissions', age: '12m', status: 'pending' },
  { id: 'sync-002', user: 'Amina Hassan', device: 'iPhone 14', records: 8, type: 'GPS Locations', age: '5m', status: 'pending' },
  { id: 'sync-003', user: 'David Osei', device: 'Tecno Spark 20', records: 45, type: 'Form Submissions', age: '34m', status: 'pending' },
  { id: 'sync-004', user: 'Fatima Diallo', device: 'Redmi Note 13', records: 12, type: 'Session Data', age: '2m', status: 'pending' },
]

const failedSyncs = [
  { id: 'fail-001', user: 'Peter Kamau', device: 'Nokia G22', records: 67, type: 'Form Submissions', error: 'Validation error: required field missing', age: '1h', retries: 3 },
  { id: 'fail-002', user: 'Lydia Nakato', device: 'Itel A70', records: 14, type: 'GPS Locations', error: 'Timestamp conflict — duplicate coordinates', age: '45m', retries: 2 },
  { id: 'fail-003', user: 'Samuel Asante', device: 'Infinix Hot 40', records: 29, type: 'Session Data', error: 'Session ID not found on server', age: '2h', retries: 5 },
]

const conflicts = [
  { id: 'conf-001', field: 'form_submission.household_count', local: '4', server: '3', user: 'James Mwangi', zone: 'Zone A-12', time: '10m ago' },
  { id: 'conf-002', field: 'gps_location.coordinates', local: '-1.2921, 36.8219', server: '-1.2920, 36.8221', user: 'Amina Hassan', zone: 'Zone B-7', time: '25m ago' },
]

export default function SyncMonitorPage() {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <DashboardHeader title="Sync Monitor" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Offline Sync Monitor</h1>
              <p className="text-muted-foreground">Track pending syncs, failed attempts, and data conflicts</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-3 w-3 mr-1" /> 34 Pending
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
              <Button size="sm">Force Sync All</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Pending Syncs', value: '34', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Failed Syncs', value: '3', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Offline Users', value: '7', icon: WifiOff, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Synced Today', value: '1,284', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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

          <Card>
            <CardHeader>
              <CardTitle>Sync Activity</CardTitle>
              <CardDescription>Synced, pending, and failed records over 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={syncActivityData}>
                    <defs>
                      <linearGradient id="syncedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="synced" name="Synced" stroke="hsl(var(--primary))" fill="url(#syncedGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="failed" name="Failed" stroke="hsl(var(--destructive))" fill="none" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingSyncs.length})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({failedSyncs.length})</TabsTrigger>
              <TabsTrigger value="conflicts">Conflicts ({conflicts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Waiting</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingSyncs.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.user}</TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{s.device}</span></TableCell>
                          <TableCell><Badge variant="secondary">{s.records}</Badge></TableCell>
                          <TableCell><span className="text-sm">{s.type}</span></TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{s.age}</span></TableCell>
                          <TableCell><Button variant="outline" size="sm">Force Sync</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="failed">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Retries</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failedSyncs.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.user}</TableCell>
                          <TableCell>{s.type}</TableCell>
                          <TableCell><span className="text-xs text-muted-foreground">{s.error}</span></TableCell>
                          <TableCell><Badge variant="secondary" className="bg-destructive/10 text-destructive">{s.retries}</Badge></TableCell>
                          <TableCell>{s.age}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">Retry</Button>
                              <Button variant="outline" size="sm">Discard</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conflicts">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Local Value</TableHead>
                        <TableHead>Server Value</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Resolution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conflicts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell><span className="font-mono text-xs">{c.field}</span></TableCell>
                          <TableCell><Badge variant="secondary" className="bg-blue-500/10 text-blue-500">{c.local}</Badge></TableCell>
                          <TableCell><Badge variant="secondary" className="bg-amber-500/10 text-amber-500">{c.server}</Badge></TableCell>
                          <TableCell>{c.user}</TableCell>
                          <TableCell>{c.zone}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">Keep Local</Button>
                              <Button variant="outline" size="sm">Keep Server</Button>
                            </div>
                          </TableCell>
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
