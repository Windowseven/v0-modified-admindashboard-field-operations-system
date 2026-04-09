'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Users, Search, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle,
  Shield, LogOut, Key, Ban, Eye, UserCog, UserCheck, User, Download,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const allUsers = [
  { id: 'u-001', name: 'Grace Wanjiku', email: 'grace.w@fieldsync.io', role: 'Supervisor', status: 'active', verified: true, joined: 'Jan 2026', lastActive: '2m ago', initials: 'GW', project: '3 projects' },
  { id: 'u-002', name: 'Ahmed Omar', email: 'ahmed.o@fieldsync.io', role: 'Supervisor', status: 'active', verified: true, joined: 'Jan 2026', lastActive: '15m ago', initials: 'AO', project: '2 projects' },
  { id: 'u-003', name: 'Peter Kamau', email: 'peter.k@fieldsync.io', role: 'Team Leader', status: 'active', verified: true, joined: 'Feb 2026', lastActive: '5m ago', initials: 'PK', project: 'Nairobi Campaign' },
  { id: 'u-004', name: 'James Mwangi', email: 'james.m@fieldsync.io', role: 'Field Worker', status: 'active', verified: true, joined: 'Feb 2026', lastActive: 'Just now', initials: 'JM', project: 'Nairobi Campaign' },
  { id: 'u-005', name: 'Amina Hassan', email: 'amina.h@fieldsync.io', role: 'Field Worker', status: 'active', verified: true, joined: 'Mar 2026', lastActive: '3m ago', initials: 'AH', project: 'Mombasa Census' },
  { id: 'u-006', name: 'Kwame Asante', email: 'kwame.a@fieldsync.io', role: 'Supervisor', status: 'suspended', verified: true, joined: 'Jan 2026', lastActive: '4 days ago', initials: 'KA', project: '—' },
  { id: 'u-007', name: 'David Osei', email: 'david.o@fieldsync.io', role: 'Field Worker', status: 'active', verified: true, joined: 'Mar 2026', lastActive: '12m ago', initials: 'DO', project: 'Kampala Outreach' },
  { id: 'u-008', name: 'Fatima Diallo', email: 'fatima.d@fieldsync.io', role: 'Field Worker', status: 'active', verified: false, joined: 'Apr 2026', lastActive: '1h ago', initials: 'FD', project: 'Dar es Salaam' },
  { id: 'u-009', name: 'Samuel Asante', email: 'samuel.a@fieldsync.io', role: 'Team Leader', status: 'inactive', verified: true, joined: 'Jan 2026', lastActive: '3 days ago', initials: 'SA', project: 'Nairobi Campaign' },
  { id: 'u-010', name: 'Marie Uwase', email: 'marie.u@fieldsync.io', role: 'Supervisor', status: 'active', verified: true, joined: 'Mar 2026', lastActive: '45m ago', initials: 'MU', project: '1 project' },
  { id: 'u-011', name: 'Junior Lespikius', email: 'junior.l@fieldsync.io', role: 'Supervisor', status: 'active', verified: true, joined: 'Mar 2026', lastActive: 'Just now', initials: 'JL', project: '4 projects' },
  { id: 'u-012', name: 'Lydia Nakato', email: 'lydia.n@fieldsync.io', role: 'Team Leader', status: 'active', verified: true, joined: 'Feb 2026', lastActive: '8m ago', initials: 'LN', project: 'Kigali Survey' },
]

const roleConfig: Record<string, { icon: React.ElementType; className: string }> = {
  Supervisor: { icon: UserCog, className: 'bg-blue-500/10 text-blue-500' },
  'Team Leader': { icon: UserCheck, className: 'bg-emerald-500/10 text-emerald-500' },
  'Field Worker': { icon: User, className: 'bg-primary/10 text-primary' },
}

const statusConfig: Record<string, { className: string; icon: React.ElementType }> = {
  active: { className: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  inactive: { className: 'bg-muted text-muted-foreground', icon: AlertTriangle },
  suspended: { className: 'bg-destructive/10 text-destructive', icon: XCircle },
}

const validTabs = ['all', 'supervisors', 'leaders', 'workers'] as const

function normalizeTab(value: string | null): (typeof validTabs)[number] {
  return validTabs.includes(value as (typeof validTabs)[number]) ? (value as (typeof validTabs)[number]) : 'all'
}

function UsersPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<(typeof validTabs)[number]>(() => normalizeTab(searchParams.get('tab')))

  useEffect(() => {
    setActiveTab(normalizeTab(searchParams.get('tab')))
  }, [searchParams])

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const byRole = (role: string) => allUsers.filter(u => u.role === role)
  const counts = {
    all: allUsers.length,
    supervisors: byRole('Supervisor').length,
    leaders: byRole('Team Leader').length,
    workers: byRole('Field Worker').length,
    suspended: allUsers.filter(u => u.status === 'suspended').length,
  }

  const updateTab = (tab: string) => {
    const nextTab = normalizeTab(tab)
    setActiveTab(nextTab)

    const params = new URLSearchParams(searchParams.toString())
    if (nextTab === 'all') {
      params.delete('tab')
    } else {
      params.set('tab', nextTab)
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(nextUrl, { scroll: false })
  }

  const UserTable = ({ users }: { users: typeof allUsers }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Project / Team</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const rc = roleConfig[user.role]
          const sc = statusConfig[user.status]
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={rc.className}>
                  <rc.icon className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{user.project}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{user.lastActive}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{user.joined}</span></TableCell>
              <TableCell>
                {user.verified
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <AlertTriangle className="h-4 w-4 text-amber-500" />}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={sc.className}>
                  <sc.icon className="h-3 w-3 mr-1" />
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                    <DropdownMenuItem><Shield className="mr-2 h-4 w-4" /> Investigate</DropdownMenuItem>
                    <DropdownMenuItem><Key className="mr-2 h-4 w-4" /> Reset Password</DropdownMenuItem>
                    <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /> Force Logout</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === 'active' ? (
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Ban className="mr-2 h-4 w-4" /> Suspend Account
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-emerald-500 focus:text-emerald-500">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Reactivate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <>
      <DashboardHeader title="Global Users" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Global Users</h1>
              <p className="text-muted-foreground">All platform users across every role and project</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export Users
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Total Users', value: counts.all, color: 'text-primary', bg: 'bg-primary/10', icon: Users },
              { label: 'Supervisors', value: counts.supervisors, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: UserCog },
              { label: 'Team Leaders', value: counts.leaders, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: UserCheck },
              { label: 'Field Workers', value: counts.workers, color: 'text-primary', bg: 'bg-primary/10', icon: User },
              { label: 'Suspended', value: counts.suspended, color: 'text-destructive', bg: 'bg-destructive/10', icon: Ban },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', s.bg)}>
                      <s.icon className={cn('h-5 w-5', s.color)} />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
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
              <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Team Leader">Team Leader</SelectItem>
                <SelectItem value="Field Worker">Field Worker</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={updateTab}>
            <TabsList>
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="supervisors">Supervisors ({counts.supervisors})</TabsTrigger>
              <TabsTrigger value="leaders">Team Leaders ({counts.leaders})</TabsTrigger>
              <TabsTrigger value="workers">Field Workers ({counts.workers})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card><CardContent className="p-0"><UserTable users={filtered} /></CardContent></Card>
            </TabsContent>
            <TabsContent value="supervisors">
              <Card><CardContent className="p-0"><UserTable users={byRole('Supervisor')} /></CardContent></Card>
            </TabsContent>
            <TabsContent value="leaders">
              <Card><CardContent className="p-0"><UserTable users={byRole('Team Leader')} /></CardContent></Card>
            </TabsContent>
            <TabsContent value="workers">
              <Card><CardContent className="p-0"><UserTable users={byRole('Field Worker')} /></CardContent></Card>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  )
}
