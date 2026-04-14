'use client'

import { useState } from 'react'
import {
  MapPin, Navigation, Users, ZoomIn, ZoomOut,
  Crosshair, AlertTriangle, CheckCircle2, Radio,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mockUserProfile, mockNearbyTeam, mockUserSession } from '@/lib/mock-user'

export default function UserMapPage() {
  const [locationSharing, setLocationSharing] = useState(mockUserProfile.locationSharingEnabled)
  const onlineTeam = mockNearbyTeam.filter((m) => m.status === 'online')

  const statusColor = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    offline: 'bg-muted-foreground',
  }

  return (
    <>
      <DashboardHeader
        title="My Map"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'My Map' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Map</h1>
              <p className="text-sm text-muted-foreground">Your location & zone boundaries</p>
            </div>
            <Button
              variant={locationSharing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocationSharing(!locationSharing)}
              className={cn('gap-2 shrink-0', locationSharing ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
            >
              <Radio className="h-3.5 w-3.5" />
              {locationSharing ? 'Sharing' : 'Share Location'}
            </Button>
          </div>

          {/* Zone info bar */}
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Assigned Zone</p>
                  <p className="font-semibold text-xs">{mockUserProfile.assignedZone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <Navigation className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">GPS Status</p>
                  <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Active · High accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <Users className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Team Online</p>
                  <p className="font-semibold text-xs">{onlineTeam.length} members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map placeholder */}
          <Card className="overflow-hidden">
            <div className="relative bg-muted/40 h-72 md:h-96 flex items-center justify-center border-b border-border">
              {/* SVG mock map */}
              <svg viewBox="0 0 500 320" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid slice">
                {/* Background */}
                <rect width="500" height="320" fill="hsl(var(--muted)/0.3)" />
                {/* Grid lines */}
                {[0,50,100,150,200,250,300,350,400,450,500].map(x => (
                  <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="320" stroke="hsl(var(--border))" strokeWidth="0.5" />
                ))}
                {[0,40,80,120,160,200,240,280,320].map(y => (
                  <line key={`hy${y}`} x1="0" y1={y} x2="500" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" />
                ))}
                {/* Zone Alpha North boundary */}
                <polygon
                  points="100,40 380,40 420,160 340,280 120,280 60,160"
                  fill="hsl(var(--primary)/0.07)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                />
                {/* Roads */}
                <line x1="0" y1="160" x2="500" y2="160" stroke="hsl(var(--border))" strokeWidth="3" />
                <line x1="250" y1="0" x2="250" y2="320" stroke="hsl(var(--border))" strokeWidth="3" />
                <line x1="100" y1="40" x2="380" y2="280" stroke="hsl(var(--border))" strokeWidth="2" opacity="0.5" />
                {/* Teammate dots */}
                <circle cx="210" cy="130" r="7" fill="#10b981" opacity="0.9" />
                <circle cx="280" cy="115" r="7" fill="#10b981" opacity="0.9" />
                <circle cx="320" cy="175" r="7" fill="#f59e0b" opacity="0.9" />
                <circle cx="160" cy="210" r="7" fill="#6b7280" opacity="0.6" />
                {/* User pin */}
                <circle cx="245" cy="160" r="10" fill="hsl(var(--primary))" />
                <circle cx="245" cy="160" r="15" fill="hsl(var(--primary)/0.25)" />
                <circle cx="245" cy="160" r="22" fill="hsl(var(--primary)/0.1)" />
              </svg>

              {/* Map controls overlay */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                  <Crosshair className="h-4 w-4" />
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur rounded-lg p-2 space-y-1 text-[10px] border border-border">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> You
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Online
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Idle
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" /> Offline
                </div>
              </div>

              {/* Zone label */}
              <div className="absolute top-3 left-3 bg-primary/10 border border-primary/20 rounded px-2 py-1">
                <span className="text-[10px] font-bold text-primary">Zone Alpha – North</span>
              </div>
            </div>

            {/* Map footer */}
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', locationSharing ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground')} />
                <span className="text-xs text-muted-foreground">
                  {locationSharing ? 'Broadcasting location every 30s' : 'Location sharing paused'}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Last update: just now</span>
            </CardContent>
          </Card>

          {/* Location sharing warning */}
          {!locationSharing && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Location sharing is off</p>
                  <p className="text-xs text-muted-foreground">Your team leader can't see your position. Enable it to stay visible.</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setLocationSharing(true)} className="shrink-0 text-xs">
                  Enable
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Nearby team quick list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Nearby Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4 px-4">
              {mockNearbyTeam.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', statusColor[m.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {m.name} {m.isTeamLeader && <span className="text-muted-foreground">(Leader)</span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{m.distance}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
