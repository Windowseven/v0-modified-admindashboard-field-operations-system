'use client'

import { useState } from 'react'
import { Zap, RefreshCw, CheckCircle2, AlertTriangle, Shield, Ban, TrendingUp, Activity, XCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const requestData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  allowed: Math.floor(Math.random() * 2000) + 3000,
  blocked: Math.floor(Math.random() * 200) + 50,
}))

const blockedData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}:00`,
  count: Math.floor(Math.random() * 150) + 20,
}))

const blockedIPs = [
  { ip: '192.168.45.231', reason: 'Brute force login', requests: 847, blocked: '2h ago', status: 'blocked' },
  { ip: '10.0.0.142', reason: 'API rate limit exceeded', requests: 1204, blocked: '45m ago', status: 'blocked' },
  { ip: '172.16.8.99', reason: 'Suspicious activity pattern', requests: 423, blocked: '1h ago', status: 'blocked' },
  { ip: '203.0.113.87', reason: 'Multiple failed OTPs', requests: 234, blocked: '3h ago', status: 'blocked' },
  { ip: '198.51.100.22', reason: 'Scraping detected', requests: 3421, blocked: '5m ago', status: 'blocked' },
]

const rateLimitRules = [
  { endpoint: '/api/auth/login', limit: '10 req/min', current: 3, max: 10, enabled: true },
  { endpoint: '/api/auth/otp', limit: '5 req/min', current: 1, max: 5, enabled: true },
  { endpoint: '/api/locations', limit: '60 req/min', current: 38, max: 60, enabled: true },
  { endpoint: '/api/submissions', limit: '30 req/min', current: 12, max: 30, enabled: true },
  { endpoint: '/api/users', limit: '100 req/min', current: 24, max: 100, enabled: true },
  { endpoint: '/api/broadcast', limit: '5 req/hour', current: 1, max: 5, enabled: false },
]

export default function RateLimitsPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [rules, setRules] = useState(rateLimitRules)

  const toggleRule = (index: number) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <>
      <DashboardHeader title="Rate Limiting" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Rate Limiting & Abuse Control</h1>
              <p className="text-muted-foreground">API rate limits, blocked IPs, and abuse prevention</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                <Shield className="h-3 w-3 mr-1" /> Protection Active
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Requests Blocked (24h)', value: '1,847', icon: Ban, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Blocked IPs', value: '23', icon: XCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Total Requests (1h)', value: '24.5K', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Block Rate', value: '0.8%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                <CardTitle>Request Traffic</CardTitle>
                <CardDescription>Allowed vs blocked requests over 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={requestData}>
                      <defs>
                        <linearGradient id="allowedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="allowed" name="Allowed" stroke="hsl(var(--primary))" fill="url(#allowedGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="blocked" name="Blocked" stroke="hsl(var(--destructive))" fill="url(#blockedGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Block Events by Hour</CardTitle>
                <CardDescription>Number of blocks triggered per 2-hour window</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={blockedData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="count" name="Blocks" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limit Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Limit Rules</CardTitle>
              <CardDescription>Configure and monitor per-endpoint limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule, i) => (
                  <div key={rule.endpoint} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium truncate">{rule.endpoint}</span>
                        <Badge variant="secondary" className="text-[10px] shrink-0">{rule.limit}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(rule.current / rule.max) * 100} className={cn('h-1.5 flex-1', rule.current / rule.max > 0.8 && '[&>div]:bg-amber-500')} />
                        <span className="text-xs text-muted-foreground shrink-0">{rule.current}/{rule.max}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Label htmlFor={`rule-${i}`} className="text-xs text-muted-foreground">{rule.enabled ? 'Active' : 'Disabled'}</Label>
                      <Switch id={`rule-${i}`} checked={rule.enabled} onCheckedChange={() => toggleRule(i)} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocked IPs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blocked IPs</CardTitle>
                <CardDescription>Currently blocked IP addresses</CardDescription>
              </div>
              <Button variant="outline" size="sm">Export List</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Blocked</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map((ip) => (
                    <TableRow key={ip.ip}>
                      <TableCell><span className="font-mono text-sm">{ip.ip}</span></TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{ip.reason}</span></TableCell>
                      <TableCell><Badge variant="secondary" className="bg-destructive/10 text-destructive">{ip.requests}</Badge></TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{ip.blocked}</span></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Unblock</Button>
                          <Button variant="outline" size="sm">Investigate</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
