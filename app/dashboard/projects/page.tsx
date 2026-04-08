'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FolderKanban, Search, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle, Users, MapPin, FileText, Eye, Ban, Trash2, Pause, Activity } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const projects = [
  {
    id: 'proj-001', name: 'Evangelism Campaign — Nairobi', supervisor: 'Grace Wanjiku',
    teams: 4, zones: 8, members: 48, submissions: 1247, status: 'active',
    startDate: 'Feb 2026', activity: 'High', storage: '2.4 GB',
  },
  {
    id: 'proj-002', name: 'Census Survey — Mombasa', supervisor: 'Ahmed Omar',
    teams: 3, zones: 6, members: 31, submissions: 892, status: 'active',
    startDate: 'Jan 2026', activity: 'Medium', storage: '1.8 GB',
  },
  {
    id: 'proj-003', name: 'Outreach Program — Kampala', supervisor: 'Esther Namutebi',
    teams: 2, zones: 4, members: 20, submissions: 423, status: 'active',
    startDate: 'Mar 2026', activity: 'Low', storage: '890 MB',
  },
  {
    id: 'proj-004', name: 'Field Study — Dar es Salaam', supervisor: 'Junior Lespikius',
    teams: 6, zones: 12, members: 74, submissions: 3421, status: 'active',
    startDate: 'Jan 2026', activity: 'High', storage: '3.1 GB',
  },
  {
    id: 'proj-005', name: 'Survey — Kigali', supervisor: 'Marie Uwase',
    teams: 1, zones: 3, members: 16, submissions: 234, status: 'active',
    startDate: 'Apr 2026', activity: 'Low', storage: '450 MB',
  },
  {
    id: 'proj-006', name: 'Door-to-Door — Lagos', supervisor: 'Kwame Asante',
    teams: 5, zones: 9, members: 0, submissions: 1892, status: 'frozen',
    startDate: 'Dec 2025', activity: 'None', storage: '1.2 GB',
  },
  {
    id: 'proj-007', name: 'Health Survey — Accra', supervisor: 'Lydia Nakato',
    teams: 3, zones: 5, members: 28, submissions: 673, status: 'active',
    startDate: 'Feb 2026', activity: 'Medium', storage: '780 MB',
  },
]

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  frozen: { label: 'Frozen', className: 'bg-blue-500/10 text-blue-500', icon: Pause },
  disabled: { label: 'Disabled', className: 'bg-destructive/10 text-destructive', icon: XCircle },
}

const activityColors: Record<string, string> = {
  High: 'text-emerald-500',
  Medium: 'text-amber-500',
  Low: 'text-muted-foreground',
  None: 'text-muted-foreground',
}

const validStatuses = ['all', 'active', 'frozen', 'disabled'] as const

function normalizeStatus(value: string | null): (typeof validStatuses)[number] {
  return validStatuses.includes(value as (typeof validStatuses)[number]) ? (value as (typeof validStatuses)[number]) : 'all'
}

export default function ProjectsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof validStatuses)[number]>(() => normalizeStatus(searchParams.get('status')))

  useEffect(() => {
    setStatusFilter(normalizeStatus(searchParams.get('status')))
  }, [searchParams])

  const updateStatusFilter = (status: string) => {
    const nextStatus = normalizeStatus(status)
    setStatusFilter(nextStatus)

    const params = new URLSearchParams(searchParams.toString())
    if (nextStatus === 'all') {
      params.delete('status')
    } else {
      params.set('status', nextStatus)
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(nextUrl, { scroll: false })
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.supervisor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = projects.filter(p => p.status === 'active').length
  const totalMembers = projects.reduce((a, p) => a + p.members, 0)
  const totalSubmissions = projects.reduce((a, p) => a + p.submissions, 0)

  return (
    <>
      <DashboardHeader title="Projects Overview" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Projects Overview</h1>
            <p className="text-muted-foreground">
              Read-only visibility into all platform projects. Use controls to freeze, disable, or delete in extreme cases.
            </p>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Active Projects', value: activeCount, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total Field Users', value: totalMembers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Total Submissions', value: totalSubmissions.toLocaleString(), icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by project name or supervisor..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={updateStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => {
              const sc = statusConfig[project.status]
              return (
                <Card key={project.id} className={cn('hover:border-primary/40 transition-colors', project.status === 'frozen' && 'opacity-75')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">{project.name}</CardTitle>
                        <CardDescription className="mt-1">Supervisor: {project.supervisor}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant="secondary" className={sc.className}>
                          <sc.icon className="h-3 w-3 mr-1" />
                          {sc.label}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {project.status === 'active' ? (
                              <DropdownMenuItem className="text-amber-500 focus:text-amber-500">
                                <Pause className="mr-2 h-4 w-4" /> Freeze Project
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Unfreeze Project
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-amber-500 focus:text-amber-500">
                              <Ban className="mr-2 h-4 w-4" /> Disable Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[
                        { label: 'Teams', value: project.teams, icon: Users },
                        { label: 'Zones', value: project.zones, icon: MapPin },
                        { label: 'Members', value: project.members, icon: Users },
                      ].map((m) => (
                        <div key={m.label} className="text-center rounded-lg bg-muted/50 p-2">
                          <p className="text-lg font-bold">{m.value}</p>
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <span>📁 {project.submissions.toLocaleString()} submissions</span>
                      <span className={cn('font-medium', activityColors[project.activity])}>
                        ● {project.activity} activity
                      </span>
                      <span>💾 {project.storage}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderKanban className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Admin Note:</span> Projects are created and managed exclusively by Supervisors. Admin can only view, freeze, disable, or delete projects as a moderation/emergency measure.
            </p>
          </div>

        </div>
      </main>
    </>
  )
}
