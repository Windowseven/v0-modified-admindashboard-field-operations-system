'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Users, MapPin, Clock, MessageCircle, Star,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { teamService, type ApiMyTeamInfo } from '@/lib/api/teamService'
import { useAuth } from '@/lib/auth/AuthContext'

type MemberStatus = 'online' | 'idle' | 'offline'

const statusConfig: Record<MemberStatus, { label: string; dot: string; text: string; bg: string }> = {
  online: { label: 'Online', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  idle: { label: 'Idle', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted/50' },
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  return R * c
}

export default function UserTeamPage() {
  const { user } = useAuth()
  const [data, setData] = useState<ApiMyTeamInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await teamService.getMyTeamMembers()
        setData(res)
      } catch (err) {
        console.error('Failed to load team members', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const members = data?.members ?? []

  const myLocation = useMemo(() => {
    if (!user) return null
    const me = members.find((m) => m.id === user.id)
    if (me?.lat == null || me?.lng == null) return null
    return { lat: Number(me.lat), lng: Number(me.lng) }
  }, [members, user])

  const computedMembers = useMemo(() => {
    return members.map((m) => {
      const status: MemberStatus =
        m.status === 'online' ? 'online' : m.status === 'idle' ? 'idle' : 'offline'

      const hasCoords = m.lat != null && m.lng != null
      const coords = hasCoords ? { lat: Number(m.lat), lng: Number(m.lng) } : null
      const distanceKm =
        myLocation && coords ? haversineKm(myLocation, coords) : null

      return {
        ...m,
        statusForUi: status,
        locationLabel: coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Unknown',
        distanceLabel: distanceKm != null ? `${distanceKm.toFixed(1)} km` : '',
        lastSeenLabel: m.last_seen ? new Date(m.last_seen).toLocaleString() : 'Unknown',
      }
    })
  }, [members, myLocation])

  const onlineCount = computedMembers.filter((m) => m.statusForUi === 'online').length
  const idleCount = computedMembers.filter((m) => m.statusForUi === 'idle').length
  const offlineCount = computedMembers.filter((m) => m.statusForUi === 'offline').length

  return (
    <>
      <DashboardHeader
        title="Nearby Team"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Nearby Team' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nearby Team</h1>
            <p className="text-sm text-muted-foreground">
              {data?.team?.name ?? 'My Team'}
            </p>
          </div>

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

          <div className="space-y-3">
            {!loading && computedMembers.map((member) => {
              const sc = statusConfig[member.statusForUi]
              return (
                <Card key={member.id} className={cn(
                  'transition-shadow hover:shadow-md',
                  member.is_team_leader && 'border-primary/20'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold',
                          member.is_team_leader ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'
                        )}>
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className={cn(
                          'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                          sc.dot
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold leading-tight">{member.name}</p>
                          {member.is_team_leader && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 h-4 gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Leader
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {member.locationLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {member.lastSeenLabel}
                          </span>
                          {member.distanceLabel && (
                            <span className="font-medium text-primary">{member.distanceLabel}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={cn('text-[10px] px-1.5 border-0', sc.bg, sc.text)}>
                          {sc.label}
                        </Badge>
                        {member.statusForUi !== 'offline' && (
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


