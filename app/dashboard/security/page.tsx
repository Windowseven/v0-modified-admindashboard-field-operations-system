'use client'

import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle2, XCircle, Globe, Lock, Eye, ArrowRight, Activity, Users, Zap } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

const threatData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  threats: Math.floor(Math.random() * 15) + 2,
  blocked: Math.floor(Math.random() * 200) + 50,
}))

const recentThreats = [
  { type: 'Brute Force', ip: '198.51.100.22', target: 'auth endpoint', attempts: 89, time: '5m ago', severity: 'critical' },
  { type: 'Rate Limit Exceeded', ip: '192.168.45.231', target: 'API gateway', attempts: 847, time: '45m ago', severity: 'warning' },
  { type: 'Suspicious Geo Login', ip: '203.0.113.87', target: 'ahmed.omar', attempts: 1, time: '1h ago', severity: 'warning' },
  { type: 'Multiple OTP Fails', ip: '10.0.0.142', target: 'auth/otp', attempts: 23, time: '2h ago', severity: 'warning' },
]

const securityModules = [
  { title: 'Threat Detection', desc: 'Active threats, suspicious IPs, brute force', href: '/dashboard/security/threats', icon: AlertTriangle, status: 'warning', count: '4 active' },
  { title: 'Session Manager', desc: 'Active sessions, force logout, device tracking', href: '/dashboard/security/sessions', icon: Users, status: 'healthy', count: '234 sessions' },
  { title: 'Access Policies', desc: 'Password rules, token expiry, rate limits', href: '/dashboard/security/policies', icon: Lock, status: 'healthy', count: '8 policies' },
]

const severityMap: Record<string, string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-amber-500/10 text-amber-500',
  info: 'bg-primary/10 text-primary',
}

export default function SecurityPage() {
  return (
    <>
      <DashboardHeader title="Security Center" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Security Center</h1>
              <p className="text-muted-foreground">Threats, sessions, access policies, and security monitoring</p>
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 w-fit">
              <AlertTriangle className="h-3 w-3 mr-1" /> 4 Active Threats
            </Badge>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Threats', value: '4', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Blocked (24h)', value: '1,847', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Active Sessions', value: '234', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Suspicious IPs', value: '23', icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

          {/* Security Modules */}
          <div className="grid gap-4 sm:grid-cols-3">
            {securityModules.map((m) => (
              <Link key={m.href} href={m.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <m.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className={m.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
                        {m.status === 'healthy' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {m.count}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{m.desc}</p>
                    <div className="flex items-center text-xs text-primary font-medium">
                      Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Threat Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Activity</CardTitle>
              <CardDescription>Threats detected and requests blocked over 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={threatData}>
                    <defs>
                      <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="blockedGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="threats" name="Threats" stroke="hsl(var(--destructive))" fill="url(#threatGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="blocked" name="Blocked Reqs" stroke="hsl(var(--primary))" fill="url(#blockedGrad2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Threats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Threats</CardTitle>
                <CardDescription>Latest detected security events</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/security/threats">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentThreats.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', t.severity === 'critical' ? 'bg-destructive/10' : 'bg-amber-500/10')}>
                        <AlertTriangle className={cn('h-4 w-4', t.severity === 'critical' ? 'text-destructive' : 'text-amber-500')} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{t.type}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.ip} → {t.target} · {t.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className={severityMap[t.severity]}>{t.severity}</Badge>
                      <span className="text-xs text-muted-foreground">{t.time}</span>
                      <Button variant="outline" size="sm">Block</Button>
                    </div>
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
