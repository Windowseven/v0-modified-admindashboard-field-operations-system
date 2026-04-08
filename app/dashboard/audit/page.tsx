'use client'

import { useState } from 'react'
import { History, Search, Download, Filter, CheckCircle2, AlertTriangle, XCircle, Shield, User, Settings, FileText, LogIn, LogOut, Trash2, Eye } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const allLogs = [
  { id: 'log-001', time: '14:32:01', user: 'grace.wanjiku', role: 'Supervisor', action: 'project.create', target: 'Nairobi Campaign v2', ip: '41.80.244.12', severity: 'info' },
  { id: 'log-002', time: '14:28:45', user: 'system', role: 'System', action: 'rate_limit.block', target: '192.168.45.231', ip: 'internal', severity: 'warning' },
  { id: 'log-003', time: '14:25:12', user: 'james.mwangi', role: 'Field Worker', action: 'submission.create', target: 'Form #47 — Zone A-12', ip: '41.80.100.44', severity: 'info' },
  { id: 'log-004', time: '14:20:08', user: 'anon', role: 'Unknown', action: 'auth.login_failed', target: 'ahmed.omar@fieldsync.io', ip: '203.0.113.87', severity: 'error' },
  { id: 'log-005', time: '14:18:33', user: 'admin', role: 'Admin', action: 'user.suspend', target: 'kwame.asante@fieldsync.io', ip: '196.43.12.8', severity: 'warning' },
  { id: 'log-006', time: '14:15:00', user: 'ahmed.omar', role: 'Supervisor', action: 'team.create', target: 'Team Bravo — Mombasa', ip: '41.80.211.33', severity: 'info' },
  { id: 'log-007', time: '14:10:22', user: 'esther.namutebi', role: 'Supervisor', action: 'zone.assign', target: 'Zone 3 → Team Alpha', ip: '41.80.198.77', severity: 'info' },
  { id: 'log-008', time: '14:05:44', user: 'system', role: 'System', action: 'backup.completed', target: 'backup_2026_04_08.sql', ip: 'internal', severity: 'info' },
  { id: 'log-009', time: '13:58:11', user: 'anon', role: 'Unknown', action: 'auth.brute_force', target: 'multiple accounts', ip: '198.51.100.22', severity: 'critical' },
  { id: 'log-010', time: '13:52:07', user: 'junior.lespikius', role: 'Supervisor', action: 'form.publish', target: 'Household Survey v3', ip: '41.80.145.90', severity: 'info' },
  { id: 'log-011', time: '13:45:30', user: 'admin', role: 'Admin', action: 'project.freeze', target: 'Door-to-Door Lagos', ip: '196.43.12.8', severity: 'warning' },
  { id: 'log-012', time: '13:40:15', user: 'peter.kamau', role: 'Team Leader', action: 'submission.delete', target: 'Draft #102', ip: '41.80.88.14', severity: 'info' },
]

const securityLogs = allLogs.filter(l => ['auth.login_failed', 'auth.brute_force', 'rate_limit.block', 'user.suspend'].includes(l.action))
const adminLogs = allLogs.filter(l => l.user === 'admin')

const severityConfig: Record<string, { className: string; icon: React.ElementType }> = {
  info: { className: 'bg-primary/10 text-primary', icon: CheckCircle2 },
  warning: { className: 'bg-amber-500/10 text-amber-500', icon: AlertTriangle },
  error: { className: 'bg-destructive/10 text-destructive', icon: XCircle },
  critical: { className: 'bg-destructive/10 text-destructive', icon: XCircle },
}

const actionIconMap: Record<string, React.ElementType> = {
  'auth.login_failed': LogIn,
  'auth.brute_force': Shield,
  'rate_limit.block': Shield,
  'user.suspend': User,
  'project.create': FileText,
  'project.freeze': FileText,
  'team.create': User,
  'zone.assign': Settings,
  'submission.create': FileText,
  'submission.delete': Trash2,
  'form.publish': FileText,
  'backup.completed': CheckCircle2,
}

function LogRow({ log }: { log: typeof allLogs[number] }) {
  const sc = severityConfig[log.severity]
  const ActionIcon = actionIconMap[log.action] ?? Eye
  return (
    <TableRow>
      <TableCell><span className="font-mono text-xs text-muted-foreground">{log.time}</span></TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-muted shrink-0">
            <ActionIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="font-mono text-xs">{log.action}</span>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="text-sm font-medium">{log.user}</p>
          <p className="text-[10px] text-muted-foreground">{log.role}</p>
        </div>
      </TableCell>
      <TableCell><span className="text-sm text-muted-foreground truncate max-w-[200px] block">{log.target}</span></TableCell>
      <TableCell><span className="font-mono text-xs text-muted-foreground">{log.ip}</span></TableCell>
      <TableCell>
        <Badge variant="secondary" className={sc.className}>
          <sc.icon className="h-3 w-3 mr-1" />
          {log.severity}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('all')

  const filtered = allLogs.filter(l => {
    const matchSearch = l.user.includes(search) || l.action.includes(search) || l.target.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severity === 'all' || l.severity === severity
    return matchSearch && matchSeverity
  })

  return (
    <>
      <DashboardHeader title="Audit & Logs" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Audit & Logs</h1>
              <p className="text-muted-foreground">Full system activity trail — who did what, when, and from where</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export Logs
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Events (24h)', value: '8,421', color: 'text-primary', bg: 'bg-primary/10', icon: History },
              { label: 'Warnings', value: '34', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertTriangle },
              { label: 'Errors', value: '12', color: 'text-destructive', bg: 'bg-destructive/10', icon: XCircle },
              { label: 'Critical Events', value: '2', color: 'text-destructive', bg: 'bg-destructive/10', icon: Shield },
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

          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="security">
                  Security
                  <Badge variant="secondary" className="ml-1.5 bg-destructive/10 text-destructive text-[10px] h-4 px-1">
                    {securityLogs.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="admin">Admin Actions</TabsTrigger>
              </TabsList>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(log => <LogRow key={log.id} log={log} />)}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityLogs.map(log => <LogRow key={log.id} log={log} />)}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminLogs.length > 0
                        ? adminLogs.map(log => <LogRow key={log.id} log={log} />)
                        : <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No admin actions found</TableCell></TableRow>
                      }
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
