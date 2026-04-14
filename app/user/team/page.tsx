'use client'

import {
  Users, MapPin, Clock, MessageCircle, Star,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mockNearbyTeam, mockUserProfile, type MemberStatus } from '@/lib/mock-user'

const statusConfig: Record<MemberStatus, { label: string; dot: string; text: string; bg: string }> = {
  online: { label: 'Online', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  idle: { label: 'Idle', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted/50' },
}

export default function UserTeamPage() {
  const onlineCount = mockNearbyTeam.filter((m) => m.status === 'online').length
  const idleCount = mockNearbyTeam.filter((m) => m.status === 'idle').length
  const offlineCount = mockNearbyTeam.filter((m) => m.status === 'offline').length

  return (
    <>
      <DashboardHeader
        title="Nearby Team"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Nearby Team' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nearby Team</h1>
            <p className="text-sm text-muted-foreground">
              {mockUserProfile.teamName} · {mockUserProfile.assignedZone}
            </p>
          </div>

          {/* Summary pills */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Online', value: onlineCount, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Idle', value: idleCount, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Offline', value: offlineCount, color: 'text-muted-foreground', bg: 'bg-muted/60' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team members */}
          <div className="space-y-3">
            {mockNearbyTeam.map((member) => {
              const sc = statusConfig[member.status]
              return (
                <Card key={member.id} className={cn(
                  'transition-shadow hover:shadow-md',
                  member.isTeamLeader && 'border-primary/20'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold',
                          member.isTeamLeader ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'
                        )}>
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className={cn(
                          'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                          sc.dot
                        )} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold leading-tight">{member.name}</p>
                          {member.isTeamLeader && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 h-4 gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Leader
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.currentActivity}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {member.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {member.lastSeen}
                          </span>
                          <span className="font-medium text-primary">{member.distance}</span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={cn('text-[10px] px-1.5 border-0', sc.bg, sc.text)}>
                          {sc.label}
                        </Badge>
                        {member.status !== 'offline' && (
                          <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1 px-2">
                            <Link href="/user/help">
                              <MessageCircle className="h-3 w-3" /> Contact
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </main>
    </>
  )
}
