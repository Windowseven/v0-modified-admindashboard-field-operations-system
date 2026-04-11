"use client";

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockTeamMembers, MockTeamMember } from '@/lib/mock-teamleader'
import { Users2, MapPin, Clock, Activity, Phone, Mail } from 'lucide-react'

export default function TeamMembersPage() {
  const [selectedMember, setSelectedMember] = useState<MockTeamMember | null>(null)
  const [open, setOpen] = useState(false)

  const statusConfig = {
    online: 'bg-emerald-500',
    active: 'bg-emerald-600',
    idle: 'bg-amber-500',
    offline: 'bg-destructive',
  } as const

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-all group cursor-pointer" onClick={() => { setSelectedMember(member); setOpen(true); }}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors truncate font-bold">{member.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: (statusConfig as any)[member.status] }} />
                    <CardDescription className="text-sm capitalize">{member.status}</CardDescription>
                    {member.sessionActive && <Badge variant="secondary" className="text-xs">Live</Badge>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-3 w-3" />
                {member.currentActivity}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {member.location}
              </div>
              {member.distanceFromLeader && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  📏 {member.distanceFromLeader}km from leader
                </div>
              )}
              <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t">
                Last seen {member.lastSeen}
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
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{selectedMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex h-3 w-3 rounded-full" style={{ backgroundColor: (statusConfig as any)[selectedMember.status] }} />
                    <span className="capitalize font-medium">{selectedMember.status}</span>
                    {selectedMember.sessionActive && <Badge>Session Active</Badge>}
                  </div>
                  <p className="text-muted-foreground">{selectedMember.currentActivity}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location & Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Last seen {selectedMember.lastSeen}</span>
                    </div>
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
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="justify-start h-10 px-0 hover:bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="ghost" className="justify-start h-10 px-0 hover:bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

