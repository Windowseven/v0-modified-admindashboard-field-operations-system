'use client'

import { useState } from 'react'
import { AlertTriangle, RefreshCw, Shield, Globe, Ban, Eye, CheckCircle2, XCircle, MapPin } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const activeThreats = [
  { id: 'thr-001', type: 'Brute Force Attack', ip: '198.51.100.22', country: 'Unknown', target: 'POST /api/auth/login', attempts: 89, firstSeen: '5m ago', severity: 'critical', status: 'active' },
  { id: 'thr-002', type: 'API Abuse / Scraping', ip: '203.0.113.87', country: 'NG', target: 'GET /api/users', attempts: 3421, firstSeen: '15m ago', severity: 'critical', status: 'active' },
  { id: 'thr-003', type: 'Geo Anomaly Login', ip: '185.220.101.34', country: 'RU', target: 'ahmed.omar@fieldsync.io', attempts: 1, firstSeen: '1h ago', severity: 'warning', status: 'active' },
  { id: 'thr-004', type: 'OTP Flooding', ip: '10.0.0.142', country: 'KE', target: 'POST /api/auth/otp', attempts: 23, firstSeen: '2h ago', severity: 'warning', status: 'active' },
]

const resolvedThreats = [
  { id: 'thr-005', type: 'Brute Force Attack', ip: '192.168.45.231', country: 'TZ', target: 'POST /api/auth/login', attempts: 147, firstSeen: '1 day ago', severity: 'critical', status: 'blocked' },
  { id: 'thr-006', type: 'Rate Limit Exceeded', ip: '172.16.8.99', country: 'UG', target: 'API Gateway', attempts: 423, firstSeen: '2 days ago', severity: 'warning', status: 'blocked' },
  { id: 'thr-007', type: 'Token Reuse Attempt', ip: '192.0.2.55', country: 'GH', target: 'JWT validation', attempts: 8, firstSeen: '3 days ago', severity: 'warning', status: 'resolved' },
]

const severityConfig: Record<string, string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-amber-500/10 text-amber-500',
}

const statusConfig: Record<string, { className: string; icon: React.ElementType }> = {
  active: { className: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  blocked: { className: 'bg-emerald-500/10 text-emerald-500', icon: Ban },
  resolved: { className: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
}

function ThreatRow({ threat, showActions }: { threat: typeof activeThreats[number]; showActions: boolean }) {
  const sc = statusConfig[threat.status]
  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium text-sm">{threat.type}</p>
          <p className="text-xs text-muted-foreground">{threat.firstSeen}</p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-mono text-sm">{threat.ip}</p>
          <p className="text-xs text-muted-foreground">{threat.country}</p>
        </div>
      </TableCell>
      <TableCell><span className="font-mono text-xs text-muted-foreground">{threat.target}</span></TableCell>
      <TableCell><Badge variant="secondary" className="bg-destructive/10 text-destructive">{threat.attempts}</Badge></TableCell>
      <TableCell><Badge variant="secondary" className={severityConfig[threat.severity]}>{threat.severity}</Badge></TableCell>
      <TableCell><Badge variant="secondary" className={sc.className}><sc.icon className="h-3 w-3 mr-1" />{threat.status}</Badge></TableCell>
      {showActions && (
        <TableCell>
          <div className="flex gap-1">
            <Button variant="outline" size="sm"><Ban className="h-3.5 w-3.5 mr-1" /> Block IP</Button>
            <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5 mr-1" /> Investigate</Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}

export default function ThreatsPage() {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <DashboardHeader title="Threat Detection" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Threat Detection</h1>
              <p className="text-muted-foreground">Suspicious activity, brute force attempts, and anomaly detection</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" /> {activeThreats.length} Active
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Threats', value: activeThreats.length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Critical', value: activeThreats.filter(t => t.severity === 'critical').length, icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Blocked IPs', value: '23', icon: Ban, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Resolved (7d)', value: resolvedThreats.length, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
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

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Threats ({activeThreats.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedThreats.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Threat Type</TableHead>
                        <TableHead>IP / Origin</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeThreats.map(t => <ThreatRow key={t.id} threat={t} showActions={true} />)}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resolved">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Threat Type</TableHead>
                        <TableHead>IP / Origin</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resolvedThreats.map(t => <ThreatRow key={t.id} threat={t} showActions={false} />)}
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
