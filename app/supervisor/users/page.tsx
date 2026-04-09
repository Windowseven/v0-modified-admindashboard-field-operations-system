'use client'

import * as React from 'react'
import {
  Search, MoreHorizontal, UserX, Shield, Users,
  CheckCircle2, XCircle, Clock, Filter,
  Mail, Phone, UsersRound, ArrowUpDown,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ProjectUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'team_leader' | 'field_user'
  team: string
  status: 'active' | 'offline' | 'idle'
  verified: boolean
  joinedAt: string
  submissions: number
  lastSeen: string
}

const users: ProjectUser[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@survey.co', phone: '+254 712 345 678', role: 'team_leader', team: 'Team Alpha', status: 'active', verified: true, joinedAt: 'Mar 1, 2026', submissions: 87, lastSeen: '2m ago' },
  { id: '2', name: 'James Kariuki', email: 'james.k@survey.co', phone: '+254 723 456 789', role: 'team_leader', team: 'Team Beta', status: 'active', verified: true, joinedAt: 'Mar 1, 2026', submissions: 72, lastSeen: '5m ago' },
  { id: '3', name: 'Amara Diallo', email: 'amara.d@survey.co', phone: '+254 734 567 890', role: 'team_leader', team: 'Team Gamma', status: 'idle', verified: true, joinedAt: 'Mar 3, 2026', submissions: 56, lastSeen: '22m ago' },
  { id: '4', name: 'Kwame Asante', email: 'kwame.a@survey.co', phone: '+254 745 678 901', role: 'field_user', team: 'Team Alpha', status: 'active', verified: true, joinedAt: 'Mar 5, 2026', submissions: 43, lastSeen: '1m ago' },
  { id: '5', name: 'Fatima Ndiaye', email: 'fatima.n@survey.co', phone: '+254 756 789 012', role: 'field_user', team: 'Team Beta', status: 'offline', verified: true, joinedAt: 'Mar 5, 2026', submissions: 31, lastSeen: '3h ago' },
  { id: '6', name: 'Chioma Obi', email: 'chioma.o@survey.co', phone: '+254 767 890 123', role: 'team_leader', team: 'Team Delta', status: 'active', verified: true, joinedAt: 'Mar 7, 2026', submissions: 22, lastSeen: '8m ago' },
  { id: '7', name: 'Tewodros Bekele', email: 'tewodros.b@survey.co', phone: '+254 778 901 234', role: 'field_user', team: 'Team Alpha', status: 'active', verified: true, joinedAt: 'Mar 8, 2026', submissions: 19, lastSeen: '4m ago' },
  { id: '8', name: 'Ngozi Adeyemi', email: 'ngozi.a@survey.co', phone: '+254 789 012 345', role: 'field_user', team: 'Team Gamma', status: 'offline', verified: false, joinedAt: 'Mar 12, 2026', submissions: 4, lastSeen: '2d ago' },
  { id: '9', name: 'Mwangi Njoroge', email: 'mwangi.n@survey.co', phone: '+254 790 123 456', role: 'team_leader', team: 'Team Echo', status: 'active', verified: true, joinedAt: 'Mar 2, 2026', submissions: 61, lastSeen: '3m ago' },
  { id: '10', name: 'Aisha Diop', email: 'aisha.d@survey.co', phone: '+254 701 234 567', role: 'field_user', team: 'Team Echo', status: 'idle', verified: true, joinedAt: 'Mar 9, 2026', submissions: 15, lastSeen: '45m ago' },
]

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-500', dot: 'bg-emerald-500' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  idle: { label: 'Idle', className: 'bg-amber-500/10 text-amber-500', dot: 'bg-amber-500' },
}

const roleConfig = {
  team_leader: { label: 'Team Leader', className: 'bg-primary/10 text-primary' },
  field_user: { label: 'Field User', className: 'bg-secondary text-secondary-foreground' },
}

export default function SupervisorUsersPage() {
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const leaders = users.filter(u => u.role === 'team_leader')
  const fieldUsers = users.filter(u => u.role === 'field_user')
  const active = users.filter(u => u.status === 'active')
  const unverified = users.filter(u => !u.verified)

  return (
    <>
      <DashboardHeader
        title="Project Users"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Project Users' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Project Users</h1>
            <p className="text-muted-foreground">All members in Urban Survey — Nairobi project</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Members', value: users.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Team Leaders', value: leaders.length, icon: Shield, color: 'text-chart-2', bg: 'bg-chart-2/10' },
              { label: 'Currently Active', value: active.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Unverified', value: unverified.length, icon: XCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', s.bg)}>
                    <s.icon className={cn('h-5 w-5', s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="team_leader">Team Leaders</SelectItem>
                <SelectItem value="field_user">Field Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Members ({users.length})</TabsTrigger>
              <TabsTrigger value="leaders">Team Leaders ({leaders.length})</TabsTrigger>
              <TabsTrigger value="field">Field Users ({fieldUsers.length})</TabsTrigger>
            </TabsList>

            {(['all', 'leaders', 'field'] as const).map(tab => {
              const tabUsers = tab === 'all' ? filtered : filtered.filter(u => tab === 'leaders' ? u.role === 'team_leader' : u.role === 'field_user')
              return (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead><div className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3" /> Submissions</div></TableHead>
                            <TableHead>Last Seen</TableHead>
                            <TableHead className="w-10" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tabUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={roleConfig[user.role].className}>
                                  {roleConfig[user.role].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5 text-sm">
                                  <UsersRound className="h-3.5 w-3.5 text-muted-foreground" />
                                  {user.team}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <div className={cn('h-1.5 w-1.5 rounded-full', statusConfig[user.status].dot)} />
                                  <span className="text-sm">{statusConfig[user.status].label}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.verified
                                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  : <Clock className="h-4 w-4 text-amber-500" />}
                              </TableCell>
                              <TableCell className="font-mono text-sm">{user.submissions}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{user.lastSeen}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Mail className="mr-2 h-4 w-4" /> Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Phone className="mr-2 h-4 w-4" /> View Contact
                                    </DropdownMenuItem>
                                    {user.role === 'field_user' && (
                                      <DropdownMenuItem>
                                        <Shield className="mr-2 h-4 w-4" /> Promote to Leader
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <UserX className="mr-2 h-4 w-4" /> Remove from Project
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>

        </div>
      </main>
    </>
  )
}
