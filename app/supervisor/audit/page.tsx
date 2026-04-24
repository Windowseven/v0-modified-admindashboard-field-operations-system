'use client'

import * as React from 'react'
import {
  History, Search, Filter, Download, ChevronDown,
  UserPlus, UserMinus, ClipboardList, MapPin, Settings,
  Shield, CheckCircle2, XCircle, Users, Layers, FileText,
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type ActionCategory = 'user' | 'team' | 'zone' | 'form' | 'task' | 'project' | 'security'

interface AuditEntry {
  id: string
  actor: string
  actorRole: string
  action: string
  target: string
  category: ActionCategory
  timestamp: string
  ip?: string
  detail?: string
}

const entries: AuditEntry[] = [
  { id: '1', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Assigned task', target: '"Complete Zone A Survey" → Team Alpha', category: 'task', timestamp: 'Apr 9, 2026 · 09:42', detail: 'Priority: High · Deadline: Apr 15' },
  { id: '2', actor: 'Sarah Johnson', actorRole: 'Team Leader', action: 'Submitted forms', target: '22 forms in Zone A (batch)', category: 'form', timestamp: 'Apr 9, 2026 · 09:31' },
  { id: '3', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Generated invite link', target: 'ALPHA-X9K2 (Field User, Team Alpha)', category: 'user', timestamp: 'Apr 9, 2026 · 08:55' },
  { id: '4', actor: 'James Kariuki', actorRole: 'Team Leader', action: 'Marked task complete', target: 'GPS calibration check', category: 'task', timestamp: 'Apr 9, 2026 · 08:20', detail: 'Confirmed by: Amara Diallo' },
  { id: '5', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Updated zone boundaries', target: 'Zone C — extended eastern edge', category: 'zone', timestamp: 'Apr 8, 2026 · 17:14' },
  { id: '6', actor: 'Ngozi Adeyemi', actorRole: 'Field User', action: 'Joined project', target: 'Urban Survey — Nairobi', category: 'user', timestamp: 'Apr 8, 2026 · 15:03', ip: '41.90.64.12' },
  { id: '7', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Removed user from project', target: 'ex-member@survey.co', category: 'security', timestamp: 'Apr 8, 2026 · 14:30', detail: 'Reason: Inactive for 14 days' },
  { id: '8', actor: 'Chioma Obi', actorRole: 'Team Leader', action: 'Updated team info', target: 'Team Delta — description updated', category: 'team', timestamp: 'Apr 8, 2026 · 12:00' },
  { id: '9', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Assigned form to team', target: '"Infrastructure Audit" → Team Beta', category: 'form', timestamp: 'Apr 7, 2026 · 11:22' },
  { id: '10', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Created team', target: 'Team Echo (8 members)', category: 'team', timestamp: 'Apr 6, 2026 · 09:05' },
  { id: '11', actor: 'Mwangi Njoroge', actorRole: 'Team Leader', action: 'Submitted forms', target: '18 forms in Zone H', category: 'form', timestamp: 'Apr 5, 2026 · 16:48' },
  { id: '12', actor: 'Jane Supervisor', actorRole: 'Supervisor', action: 'Created zone', target: 'Zone H — Kibera (3.1 km²)', category: 'zone', timestamp: 'Mar 1, 2026 · 10:00' },
]

const categoryConfig: Record<ActionCategory, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  user: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10', label: 'User' },
  team: { icon: Users, color: 'text-chart-2', bg: 'bg-chart-2/10', label: 'Team' },
  zone: { icon: Layers, color: 'text-chart-3', bg: 'bg-chart-3/10', label: 'Zone' },
  form: { icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Form' },
  task: { icon: CheckCircle2, color: 'text-chart-4', bg: 'bg-chart-4/10', label: 'Task' },
  project: { icon: Settings, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Project' },
  security: { icon: Shield, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Security' },
}

export default function SupervisorAuditPage() {
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [actorFilter, setActorFilter] = React.useState('all')

  const filtered = entries.filter(e => {
    const matchSearch = e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.target.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter
    const matchActor = actorFilter === 'all' ||
      (actorFilter === 'supervisor' && e.actorRole === 'Supervisor') ||
      (actorFilter === 'leader' && e.actorRole === 'Team Leader') ||
      (actorFilter === 'field' && e.actorRole === 'Field User')
    return matchSearch && matchCat && matchActor
  })

  const categoryCounts = Object.keys(categoryConfig).reduce((acc, key) => {
    acc[key as ActionCategory] = entries.filter(e => e.category === key as ActionCategory).length
    return acc
  }, {} as Record<ActionCategory, number>)

  return (
    <>
      <DashboardHeader
        title="Audit Logs"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Audit Logs' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
              <p className="text-muted-foreground">Complete activity trail scoped to Urban Survey — Nairobi</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(categoryConfig) as [ActionCategory, typeof categoryConfig[ActionCategory]][]).map(([cat, cfg]) => {
              const Icon = cfg.icon
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(f => f === cat ? 'all' : cat)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    categoryFilter === cat ? cn(cfg.bg, cfg.color, 'ring-1 ring-current') : 'bg-muted text-muted-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {cfg.label}
                  <span className="tabular-nums">({categoryCounts[cat]})</span>
                </button>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search actions, actors, targets..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-44">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="leader">Team Leaders</SelectItem>
                <SelectItem value="field">Field Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Log Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(entry => {
                    const cfg = categoryConfig[entry.category]
                    const Icon = cfg.icon
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{entry.actor}</p>
                            <p className="text-xs text-muted-foreground">{entry.actorRole}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{entry.action}</p>
                            {entry.detail && <p className="text-xs text-muted-foreground">{entry.detail}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground max-w-[240px] truncate">{entry.target}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('gap-1', cfg.bg, cfg.color)}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {entry.timestamp}
                          {entry.ip && <p className="text-xs font-mono">{entry.ip}</p>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                        No audit entries match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            Showing {filtered.length} of {entries.length} entries · Logs are scoped to this project only
          </p>

        </div>
      </main>
    </>
  )
}

