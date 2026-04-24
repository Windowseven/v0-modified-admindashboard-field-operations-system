'use client'

import { useState } from 'react'
import {
  MapPin, Navigation, Users, ZoomIn, ZoomOut,
  Crosshair, AlertTriangle, CheckCircle2, Radio, Loader2
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useSWR from 'swr'
import { fetcher } from '@/lib/api/swr-fetcher'

type TeamMember = {
  id: string
  name?: string
  email?: string
  role?: string
  status?: string
}

export default function UserMapPage() {
  const { data: profileData, error: profileError } = useSWR('/auth/profile', fetcher)
  const { data: teamData, error: teamError } = useSWR('/team/members', fetcher)
  
  const [locationSharing, setLocationSharing] = useState(true)

  const isLoading = (!profileData && !profileError) || (!teamData && !teamError)
  const user = profileData?.user || profileData || {}
  const members: TeamMember[] = Array.isArray(teamData) ? teamData : []
  const onlineTeam = members.filter((m) => m.status === 'online')

  const statusColor: Record<string, string> = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    offline: 'bg-muted-foreground',
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground font-medium">Initializing spatial session...</span>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Field Map"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Interactive Map' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 animate-in fade-in duration-700">
        <div className="mx-auto max-w-3xl space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Geo-Spatial Intelligence</h1>
              <p className="text-sm text-muted-foreground">Monitor zone boundaries and team proximity in real-time</p>
            </div>
            <Button
              variant={locationSharing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocationSharing(!locationSharing)}
              className={cn('gap-2 shrink-0 shadow-sm transition-all active:scale-95 group', locationSharing ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
            >
              <Radio className={cn("h-3.5 w-3.5", locationSharing && "animate-pulse")} />
              {locationSharing ? 'Broadcasting Live' : 'Go Visible'}
            </Button>
          </div>

          {/* Zone info bar */}
          <Card className="border-primary/10 bg-primary/[0.01] shadow-inner">
            <CardContent className="p-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Assigned Sector</p>
                  <p className="font-bold text-xs uppercase">{user.assigned_zone || 'Pending assignment'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-primary/10 pl-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Navigation className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Map Provider</p>
                  <p className="font-bold text-xs text-amber-600">Google Maps integration pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-primary/10 pl-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Co-Presence</p>
                  <p className="font-bold text-xs">{onlineTeam.length} Active Near You</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map placeholder */}
          <Card className="overflow-hidden border-primary/20 shadow-2xl relative group">
            <div className="relative bg-muted/40 h-72 md:h-96 flex items-center justify-center border-b border-border overflow-hidden">
              {/* Temporary placeholder map until Google Maps API is added */}
              <svg viewBox="0 0 500 320" className="w-full h-full opacity-60 transition-transform duration-1000 group-hover:scale-[1.02]" preserveAspectRatio="xMidYMid slice">
                <rect width="500" height="320" fill="hsl(var(--muted)/0.3)" />
                {[0,50,100,150,200,250,300,350,400,450,500].map(x => (
                  <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="320" stroke="hsl(var(--border))" strokeWidth="0.5" />
                ))}
                {[0,40,80,120,160,200,240,280,320].map(y => (
                  <line key={`hy${y}`} x1="0" y1={y} x2="500" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" />
                ))}
                
                {/* Zone Polygon */}
                <polygon
                  points="100,40 380,40 420,160 340,280 120,280 60,160"
                  fill="hsl(var(--primary)/0.05)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
                
                {/* Simulated Members */}
                {onlineTeam.slice(0, 4).map((_, i) => (
                  <circle 
                    key={`m-${i}`} 
                    cx={150 + (i * 60)} 
                    cy={100 + (i * 40)} 
                    r="8" 
                    fill="#10b981" 
                    className="animate-bounce" 
                    style={{ animationDelay: `${i * 0.2}s`, animationDuration: '3s' }}
                  />
                ))}

                {/* User Location Node */}
                <g className="user-node">
                  <circle cx="245" cy="160" r="28" fill="hsl(var(--primary)/0.1)" className="animate-ping" />
                  <circle cx="245" cy="160" r="16" fill="hsl(var(--primary)/0.2)" />
                  <circle cx="245" cy="160" r="10" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
                </g>
              </svg>

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="h-10 w-10 shadow-xl hover:bg-primary hover:text-white transition-all scale-95 hover:scale-105">
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="h-10 w-10 shadow-xl hover:bg-primary hover:text-white transition-all scale-95 hover:scale-105">
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="default" className="h-10 w-10 shadow-xl bg-primary text-white scale-100 hover:scale-110 active:scale-95 transition-all">
                  <Crosshair className="h-5 w-5" />
                </Button>
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md rounded-xl p-4 border border-primary/20 shadow-2xl space-y-2">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 border-b border-primary/10 pb-1">Legend</h4>
                 <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/20" /> YOUR POSITION
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> TEAM ACTIVE
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> TEAM IDLE
                 </div>
              </div>

              {/* Zone Tag */}
              <div className="absolute top-4 left-4">
                 <Badge className="bg-primary text-white font-black px-3 py-1.5 rounded-lg shadow-lg text-[10px] tracking-widest border-none">
                   {user.assigned_zone || 'OPERATIONAL SECTOR'}
                 </Badge>
              </div>
            </div>

              {/* Map footer */}
            <CardContent className="p-4 flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-2">
                <div className={cn('h-2.5 w-2.5 rounded-full shadow-sm', locationSharing ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground')} />
                <span className="text-xs font-bold text-muted-foreground/80 lowercase">
                  {locationSharing ? 'Location sharing enabled for team coordination' : 'Session privacy layer active'}
                </span>
              </div>
              <span className="text-[10px] font-black text-primary/40 uppercase tracking-tighter">google maps api: coming soon</span>
            </CardContent>
          </Card>

          {/* Warning for shared location */}
          {!locationSharing && (
            <Card className="border-amber-200 bg-amber-50 shadow-sm animate-in slide-in-from-top-2">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900 uppercase tracking-tight">Ghost Mode Active</p>
                  <p className="text-xs text-amber-700 font-medium leading-tight">Your live telemetry is hidden. Supervisors cannot perform emergency assistance without a location fix.</p>
                </div>
                <Button size="sm" onClick={() => setLocationSharing(true)} className="bg-amber-600 hover:bg-amber-700 font-bold px-4">
                  Restore Sync
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Team proximity list */}
          <Card className="border-primary/5 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/5 bg-primary/[0.02]">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center justify-between">
                <span>Nearby Operatives</span>
                <Users className="h-4 w-4 opacity-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-primary/5">
              {members.length > 0 ? members.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-primary/[0.01] transition-all">
                  <div className={cn('h-3 w-3 rounded-full shrink-0 shadow-inner', statusColor[m.status || 'offline'] || statusColor['offline'])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold flex items-center gap-2 truncate">
                      {m.name || m.email?.split('@')[0]}
                      {m.role === 'team_leader' && <Badge variant="outline" className="text-[8px] h-4 px-1 lowercase font-black border-primary/30 text-primary">leader</Badge>}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-black tracking-tighter opacity-70">
                    {m.status?.toUpperCase() || 'OFFLINE'}
                  </Badge>
                </div>
              )) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2 opacity-40">
                   <Users className="h-8 w-8" />
                   <span className="text-xs font-bold uppercase tracking-widest">Scanning for nearby team...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

