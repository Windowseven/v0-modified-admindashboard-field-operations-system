'use client'

import { useState } from 'react'
import { Users, RefreshCw, LogOut, Monitor, Smartphone, CheckCircle2, AlertTriangle, Globe, Clock } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const sessions = [
  { id: 'ses-001', user: 'James Mwangi', email: 'james.m@fieldsync.io', role: 'Field Worker', device: 'Samsung Galaxy A54', os: 'Android 14', ip: '41.80.100.44', country: 'KE', started: '2h ago', lastActivity: 'Just now', status: 'active' },
  { id: 'ses-002', user: 'Grace Wanjiku', email: 'grace.w@fieldsync.io', role: 'Supervisor', device: 'MacBook Pro', os: 'macOS 14', ip: '41.80.244.12', country: 'KE', started: '4h ago', lastActivity: '2m ago', status: 'active' },
  { id: 'ses-003', user: 'Ahmed Omar', email: 'ahmed.o@fieldsync.io', role: 'Supervisor', device: 'iPhone 15', os: 'iOS 17', ip: '41.80.211.33', country: 'KE', started: '1h ago', lastActivity: '15m ago', status: 'active' },
  { id: 'ses-004', user: 'Amina Hassan', email: 'amina.h@fieldsync.io', role: 'Field Worker', device: 'Tecno Spark 20', os: 'Android 13', ip: '41.80.198.77', country: 'KE', started: '3h ago', lastActivity: '3m ago', status: 'active' },
  { id: 'ses-005', user: 'Peter Kamau', email: 'peter.k@fieldsync.io', role: 'Team Leader', device: 'Redmi Note 13', os: 'Android 14', ip: '41.80.88.14', country: 'KE', started: '5h ago', lastActivity: '30m ago', status: 'idle' },
  { id: 'ses-006', user: 'Unknown User', email: 'anon@suspicious.com', role: '—', device: 'Unknown Browser', os: 'Linux', ip: '185.220.101.34', country: 'RU', started: '45m ago', lastActivity: '40m ago', status: 'suspicious' },
  { id: 'ses-007', user: 'Junior Lespikius', email: 'junior.l@fieldsync.io', role: 'Supervisor', device: 'Windows PC', os: 'Windows 11', ip: '41.80.145.90', country: 'TZ', started: '6h ago', lastActivity: 'Just now', status: 'active' },
]

const statusConfig: Record<string, { className: string; icon: React.ElementType }> = {
  active: { className: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  idle: { className: 'bg-amber-500/10 text-amber-500', icon: Clock },
  suspicious: { className: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
}

const deviceIcon = (os: string) => os.includes('Android') || os.includes('iOS') ? Smartphone : Monitor

export default function SessionsPage() {
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = sessions.filter(s =>
    s.user.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.ip.includes(search)
  )

  const activeCount = sessions.filter(s => s.status === 'active').length
  const suspiciousCount = sessions.filter(s => s.status === 'suspicious').length

  return (
    <>
      <DashboardHeader title="Session Manager" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Session Manager</h1>
              <p className="text-muted-foreground">All active user sessions, devices, and locations</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm">
                <LogOut className="h-4 w-4 mr-2" /> Force Logout All
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Sessions', value: sessions.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Active', value: activeCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Idle', value: sessions.filter(s => s.status === 'idle').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Suspicious', value: suspiciousCount, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
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

          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by user, email, or IP..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>IP / Country</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => {
                    const sc = statusConfig[s.status]
                    const DevIcon = deviceIcon(s.os)
                    return (
                      <TableRow key={s.id} className={s.status === 'suspicious' ? 'bg-destructive/5' : ''}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{s.user}</p>
                            <p className="text-xs text-muted-foreground">{s.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DevIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm">{s.device}</p>
                              <p className="text-xs text-muted-foreground">{s.os}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-mono text-sm">{s.ip}</p>
                          <p className="text-xs text-muted-foreground">{s.country}</p>
                        </TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{s.started}</span></TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{s.lastActivity}</span></TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={sc.className}>
                            <sc.icon className="h-3 w-3 mr-1" />{s.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className={s.status === 'suspicious' ? 'border-destructive/50 text-destructive hover:text-destructive' : ''}>
                            <LogOut className="h-3.5 w-3.5 mr-1" /> Terminate
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
