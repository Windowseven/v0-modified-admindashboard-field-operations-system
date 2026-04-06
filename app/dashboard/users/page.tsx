'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  UserCog,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download,
  Upload,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'admin' | 'team_leader' | 'user'
  team?: string
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
  createdAt: string
  formsCompleted: number
}

const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@fieldsync.io',
    phone: '+1 555-0101',
    role: 'team_leader',
    team: 'Team Alpha',
    status: 'active',
    lastActive: '2 minutes ago',
    createdAt: '2024-01-15',
    formsCompleted: 156,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@fieldsync.io',
    phone: '+1 555-0102',
    role: 'user',
    team: 'Team Alpha',
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-01-16',
    formsCompleted: 128,
  },
  {
    id: '3',
    name: 'James Miller',
    email: 'james@fieldsync.io',
    phone: '+1 555-0201',
    role: 'team_leader',
    team: 'Team Beta',
    status: 'active',
    lastActive: '10 minutes ago',
    createdAt: '2024-01-20',
    formsCompleted: 189,
  },
  {
    id: '4',
    name: 'Lisa Park',
    email: 'lisa@fieldsync.io',
    phone: '+1 555-0103',
    role: 'user',
    team: 'Team Alpha',
    status: 'inactive',
    lastActive: '2 hours ago',
    createdAt: '2024-01-18',
    formsCompleted: 98,
  },
  {
    id: '5',
    name: 'Alex Turner',
    email: 'alex@fieldsync.io',
    phone: '+1 555-0301',
    role: 'team_leader',
    team: 'Team Gamma',
    status: 'active',
    lastActive: '1 minute ago',
    createdAt: '2024-02-01',
    formsCompleted: 212,
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@fieldsync.io',
    phone: '+1 555-0001',
    role: 'admin',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2024-01-01',
    formsCompleted: 0,
  },
  {
    id: '7',
    name: 'Emma Davis',
    email: 'emma@fieldsync.io',
    phone: '+1 555-0202',
    role: 'user',
    team: 'Team Beta',
    status: 'active',
    lastActive: '15 minutes ago',
    createdAt: '2024-01-21',
    formsCompleted: 145,
  },
  {
    id: '8',
    name: 'Chris Lee',
    email: 'chris@fieldsync.io',
    phone: '+1 555-0203',
    role: 'user',
    team: 'Team Beta',
    status: 'pending',
    lastActive: 'Never',
    createdAt: '2024-03-01',
    formsCompleted: 0,
  },
  {
    id: '9',
    name: 'Maria Garcia',
    email: 'maria@fieldsync.io',
    phone: '+1 555-0302',
    role: 'user',
    team: 'Team Gamma',
    status: 'active',
    lastActive: '30 minutes ago',
    createdAt: '2024-02-02',
    formsCompleted: 167,
  },
  {
    id: '10',
    name: 'David Kim',
    email: 'david@fieldsync.io',
    phone: '+1 555-0303',
    role: 'user',
    team: 'Team Gamma',
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-02-03',
    formsCompleted: 178,
  },
]

function getRoleBadge(role: User['role']) {
  switch (role) {
    case 'admin':
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      )
    case 'team_leader':
      return (
        <Badge className="bg-info/10 text-info hover:bg-info/20">
          <UserCog className="mr-1 h-3 w-3" />
          Team Leader
        </Badge>
      )
    case 'user':
      return (
        <Badge variant="secondary">
          User
        </Badge>
      )
  }
}

function getStatusBadge(status: User['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-success/10 text-success hover:bg-success/20">Active</Badge>
    case 'inactive':
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>
    case 'pending':
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>
  }
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState('all')
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const adminCount = users.filter((u) => u.role === 'admin').length
  const leaderCount = users.filter((u) => u.role === 'team_leader').length
  const userCount = users.filter((u) => u.role === 'user').length
  const activeCount = users.filter((u) => u.status === 'active').length

  return (
    <>
      <DashboardHeader
        title="User Management"
        breadcrumbs={[{ label: 'Users' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage users, roles, and access permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Invite a new user to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="userName">Full Name</Label>
                      <Input id="userName" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input id="userEmail" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="userPhone">Phone</Label>
                      <Input id="userPhone" placeholder="+1 555-0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="userRole">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="team_leader">Team Leader</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="userTeam">Team</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpha">Team Alpha</SelectItem>
                            <SelectItem value="beta">Team Beta</SelectItem>
                            <SelectItem value="gamma">Team Gamma</SelectItem>
                            <SelectItem value="delta">Team Delta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{adminCount}</p>
                  <p className="text-xs text-muted-foreground">Admins</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <UserCog className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{leaderCount}</p>
                  <p className="text-xs text-muted-foreground">Team Leaders</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <UserCog className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCount}</p>
                  <p className="text-xs text-muted-foreground">Regular Users</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <UserCog className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="team_leader">Team Leaders</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>

          {/* Users Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Forms</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.team || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm">{user.formsCompleted}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </>
  )
}
