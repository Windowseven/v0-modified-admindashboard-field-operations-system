'use client'

import * as React from 'react'
import {
  Copy, Plus, Trash2, Link2, Users, CheckCircle2,
  Clock, XCircle, RefreshCw, Mail, UserPlus,
  Eye, EyeOff, Shield,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface InviteLink {
  id: string
  code: string
  role: 'team_leader' | 'field_user'
  team: string
  uses: number
  maxUses: number
  createdAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'maxed'
}

interface PendingInvite {
  id: string
  email: string
  role: 'team_leader' | 'field_user'
  team: string
  sentAt: string
  status: 'pending' | 'accepted' | 'expired'
}

const inviteLinks: InviteLink[] = [
  { id: '1', code: 'FS-ALPHA-7K2M', role: 'field_user', team: 'Team Alpha', uses: 7, maxUses: 10, createdAt: 'Apr 1, 2026', expiresAt: 'Apr 15, 2026', status: 'active' },
  { id: '2', code: 'FS-BETA-9X3N', role: 'field_user', team: 'Team Beta', uses: 8, maxUses: 10, createdAt: 'Apr 1, 2026', expiresAt: 'Apr 15, 2026', status: 'active' },
  { id: '3', code: 'FS-LEAD-4P8Q', role: 'team_leader', team: 'Team Delta', uses: 1, maxUses: 1, createdAt: 'Mar 28, 2026', expiresAt: 'Apr 10, 2026', status: 'maxed' },
  { id: '4', code: 'FS-GAMMA-2L5R', role: 'field_user', team: 'Team Gamma', uses: 5, maxUses: 8, createdAt: 'Mar 20, 2026', expiresAt: 'Apr 3, 2026', status: 'expired' },
  { id: '5', code: 'FS-ECHO-6W1T', role: 'field_user', team: 'Team Echo', uses: 4, maxUses: 10, createdAt: 'Apr 5, 2026', expiresAt: 'Apr 19, 2026', status: 'active' },
]

const pendingInvites: PendingInvite[] = [
  { id: '1', email: 'njeri.mwangi@survey.co', role: 'field_user', team: 'Team Alpha', sentAt: '2h ago', status: 'pending' },
  { id: '2', email: 'emeka.eze@survey.co', role: 'field_user', team: 'Team Beta', sentAt: '5h ago', status: 'pending' },
  { id: '3', email: 'ama.mensah@survey.co', role: 'team_leader', team: 'Team Delta', sentAt: '1d ago', status: 'pending' },
  { id: '4', email: 'zara.traore@survey.co', role: 'field_user', team: 'Team Gamma', sentAt: '2d ago', status: 'accepted' },
  { id: '5', email: 'kofi.boateng@survey.co', role: 'field_user', team: 'Team Echo', sentAt: '3d ago', status: 'expired' },
]

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-500' },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground' },
  maxed: { label: 'Maxed Out', className: 'bg-amber-500/10 text-amber-500' },
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-500' },
  accepted: { label: 'Accepted', className: 'bg-emerald-500/10 text-emerald-500' },
}

export default function InvitationsPage() {
  const [showCopied, setShowCopied] = React.useState<string | null>(null)
  const [showLink, setShowLink] = React.useState<string | null>(null)
  const [newRole, setNewRole] = React.useState('field_user')
  const [newTeam, setNewTeam] = React.useState('')
  const [newMaxUses, setNewMaxUses] = React.useState('10')

  const handleCopy = (code: string) => {
    setShowCopied(code)
    setTimeout(() => setShowCopied(null), 2000)
  }

  const activeLinks = inviteLinks.filter(l => l.status === 'active')
  const pendingCount = pendingInvites.filter(p => p.status === 'pending').length

  return (
    <>
      <DashboardHeader
        title="Invitations & Access"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor/projects' }}
        breadcrumbs={[{ label: 'My Projects', href: '/supervisor/projects' }, { label: 'Invitations' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Invitations & Access Control</h1>
              <p className="text-muted-foreground">Generate invite links and manage who joins your project</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Plus className="h-4 w-4" /> Generate Invite Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Invite Link</DialogTitle>
                  <DialogDescription>Create a shareable link for new members to join your project.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="field_user">Field User</SelectItem>
                        <SelectItem value="team_leader">Team Leader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assign to Team</Label>
                    <Select value={newTeam} onValueChange={setNewTeam}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alpha">Team Alpha</SelectItem>
                        <SelectItem value="beta">Team Beta</SelectItem>
                        <SelectItem value="gamma">Team Gamma</SelectItem>
                        <SelectItem value="delta">Team Delta</SelectItem>
                        <SelectItem value="echo">Team Echo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Uses</Label>
                    <Input type="number" value={newMaxUses} onChange={e => setNewMaxUses(e.target.value)} min="1" max="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expires In</Label>
                    <Select defaultValue="7">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button className="gap-2"><Link2 className="h-4 w-4" /> Generate Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Active Links', value: activeLinks.length, icon: Link2, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Total Joined', value: inviteLinks.reduce((a, l) => a + l.uses, 0), icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Pending Invites', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Expired / Maxed', value: inviteLinks.filter(l => l.status !== 'active').length, icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
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

          <Tabs defaultValue="links">
            <TabsList>
              <TabsTrigger value="links">Invite Links</TabsTrigger>
              <TabsTrigger value="pending">
                Email Invites
                {pendingCount > 0 && <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-[10px]">{pendingCount}</Badge>}
              </TabsTrigger>
            </TabsList>

            {/* Invite Links Tab */}
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shareable Invite Links</CardTitle>
                  <CardDescription>Share these links with new members to onboard them directly into a team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inviteLinks.map((link) => (
                      <div key={link.id} className={cn('rounded-lg border p-4 transition-colors', link.status !== 'active' && 'opacity-60')}>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', link.status === 'active' ? 'bg-primary/10' : 'bg-muted')}>
                              <Link2 className={cn('h-4 w-4', link.status === 'active' ? 'text-primary' : 'text-muted-foreground')} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-medium">
                                  {showLink === link.id ? `fieldsync.io/join/${link.code}` : `fieldsync.io/join/••••••••`}
                                </span>
                                <Badge variant="secondary" className={statusConfig[link.status].className}>{statusConfig[link.status].label}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {link.role === 'team_leader' ? 'Team Leader' : 'Field User'} · {link.team} · {link.uses}/{link.maxUses} uses · Expires {link.expiresAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowLink(showLink === link.id ? null : link.id)}>
                              {showLink === link.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                            {link.status === 'active' && (
                              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => handleCopy(link.code)}>
                                {showCopied === link.code ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                {showCopied === link.code ? 'Copied!' : 'Copy'}
                              </Button>
                            )}
                            {link.status === 'active' && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        {link.status === 'active' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{link.uses} of {link.maxUses} uses</span>
                              <span>{Math.round((link.uses / link.maxUses) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(link.uses / link.maxUses) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Invites Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Email Invitations</CardTitle>
                      <CardDescription>Direct email invites sent to specific people</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Mail className="h-4 w-4" /> Send Invite
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Email Invite</DialogTitle>
                          <DialogDescription>Send a direct invite to a specific email address.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input type="email" placeholder="user@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Select defaultValue="field_user">
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="field_user">Field User</SelectItem>
                                <SelectItem value="team_leader">Team Leader</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Assign to Team</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alpha">Team Alpha</SelectItem>
                                <SelectItem value="beta">Team Beta</SelectItem>
                                <SelectItem value="gamma">Team Gamma</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="gap-2"><Mail className="h-4 w-4" /> Send Invite</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvites.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={invite.role === 'team_leader' ? 'bg-primary/10 text-primary' : ''}>
                              {invite.role === 'team_leader' ? 'Team Leader' : 'Field User'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{invite.team}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{invite.sentAt}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusConfig[invite.status].className}>
                              {statusConfig[invite.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {invite.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                <RefreshCw className="h-3 w-3" /> Resend
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
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
