"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { mockTeamMembers, MockTeamMember } from '@/lib/mock-teamleader'
import { cn } from '@/lib/utils'
import { Users2, MapPin, Clock, Activity, Phone, Mail, ExternalLink } from 'lucide-react'

// Mock phone/email — in production these come from the member's profile
const memberContacts: Record<string, { phone: string; email: string }> = {
  'tl-john-doe': { phone: '+255700000001', email: 'john.doe@fieldsync.app' },
  'tm-jane-smith': { phone: '+255700000002', email: 'jane.smith@fieldsync.app' },
  'tm-mike-johnson': { phone: '+255700000003', email: 'mike.johnson@fieldsync.app' },
  'tm-sarah-lee': { phone: '+255700000004', email: 'sarah.lee@fieldsync.app' },
}

export default function TeamMembersPage() {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<MockTeamMember | null>(null)
  const [open, setOpen] = useState(false)

  const statusConfig = {
    online: 'bg-emerald-500',
    active: 'bg-emerald-600',
    idle: 'bg-amber-500',
    offline: 'bg-slate-400',
  } as const

  function openMember(member: MockTeamMember) {
    setSelectedMember(member)
    setOpen(true)
  }

  function handleCall(member: MockTeamMember) {
    const contact = memberContacts[member.id]
    if (contact?.phone) {
      window.location.href = `tel:${contact.phone}`
    }
  }

  function handleMessage(member: MockTeamMember) {
    // Navigate to notifications page (in-app messaging hub)
    setOpen(false)
    router.push('/teamleader/notifications')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage and monitor your field team</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users2 className="h-3 w-3" />
            {mockTeamMembers.length} Total
          </Badge>
          <Badge className="flex items-center gap-1">
            {mockTeamMembers.filter(m => m.status === 'online' || m.status === 'active').length} Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTeamMembers.map((member) => (
          <Card
            key={member.id}
            className="hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => openMember(member)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors truncate font-bold">
                    {member.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={cn('flex h-2 w-2 rounded-full', member.status !== 'offline' && 'animate-pulse')}
                      style={{ backgroundColor: '' }}
                    >
                      <div className={cn('h-2 w-2 rounded-full', statusConfig[member.status])} />
                    </div>
                    <CardDescription className="text-sm capitalize">{member.status}</CardDescription>
                    {member.sessionActive && <Badge variant="secondary" className="text-xs">Live</Badge>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{member.currentActivity}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{member.location}</span>
              </div>
              {member.distanceFromLeader && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">📏 {member.distanceFromLeader}km from leader</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t">
                Last seen {member.lastSeen}
              </div>

              {/* Quick action buttons on the card */}
              <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleCall(member)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleMessage(member)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>Full profile and activity for {selectedMember?.name}</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={cn('h-3 w-3 rounded-full', statusConfig[selectedMember.status])} />
                    <span className="capitalize font-medium">{selectedMember.status}</span>
                    {selectedMember.sessionActive && <Badge>Session Active</Badge>}
                  </div>
                  <p className="text-muted-foreground">{selectedMember.currentActivity}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location & Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{selectedMember.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>Last seen {selectedMember.lastSeen}</span>
                    </div>
                    {selectedMember.distanceFromLeader && (
                      <div className="flex items-center gap-2 text-sm">
                        📏 {selectedMember.distanceFromLeader}km from leader
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tasks Completed</span>
                      <Badge>{selectedMember.tasksCompleted}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Forms Submitted</span>
                      <Badge>{selectedMember.formsSubmitted}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Score</span>
                      <Badge className="bg-primary">
                        {selectedMember.tasksCompleted + selectedMember.formsSubmitted}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleCall(selectedMember)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleMessage(selectedMember)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Send Message
                    </Button>
                  </div>
                  {memberContacts[selectedMember.id] && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {memberContacts[selectedMember.id].phone} · {memberContacts[selectedMember.id].email}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
