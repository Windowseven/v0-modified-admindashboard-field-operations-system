'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import {
  Users, MapPin, Radio, Layers, Navigation, ZoomIn, ZoomOut,
  Maximize2, Eye, EyeOff, RefreshCw, ChevronRight, Circle,
  Filter, Clock, CheckCircle2
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { http } from '@/lib/api/httpClient'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { zoneService } from '@/lib/api/zoneService'
import { teamService } from '@/lib/api/teamService'

type LiveAgentStatus = 'active' | 'idle' | 'offline'

type LiveAgent = {
  id: string
  name: string
  team: string
  zone: string
  status: LiveAgentStatus
  lastUpdate: string
  lat: number
  lng: number
  submissions: number
}

const teamColors: Record<string, string> = {
  admin: '#22c55e',
  supervisor: '#3b82f6',
  team_leader: '#f59e0b',
  field_agent: '#a855f7',
  'Team Alpha': '#22c55e',
  'Team Beta': '#3b82f6',
  'Team Gamma': '#f59e0b',
  'Team Delta': '#a855f7',
  'Team Echo': '#06b6d4',
}

const statusDot = { active: 'bg-emerald-500 animate-pulse', idle: 'bg-amber-500', offline: 'bg-muted-foreground' }

// Mock SVG map with agent dots
function MockMap({ agents, zonesVisible, zones }: { agents: LiveAgent[]; zonesVisible: boolean; zones: any[] }) {
  return (
    <div className="relative w-full h-full bg-[hsl(var(--muted))] rounded-lg overflow-hidden border border-border">
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Zone blobs */}
      {zonesVisible && zones.length > 0 && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {zones.map((z, i) => {
            const cx = (20 + (i * 15)) % 90 + '%'
            const cy = (30 + (i * 12)) % 80 + '%'
            return (
              <ellipse key={z.id} cx={cx} cy={cy} rx="10%" ry="8%" fill="#22c55e" fillOpacity="0.1" stroke="#22c55e" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 2" />
            )
          })}
        </svg>
      )}

      {/* Agent dots */}
      {agents.map((agent, i) => {
        const x = (30 + (i * 8)) % 90 + '%'
        const y = (40 + (i * 6)) % 80 + '%'
        const color = teamColors[agent.team] || '#888'
        return (
          <div
            key={agent.id}
            className="absolute flex items-center justify-center transition-all duration-500"
            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
            title={`${agent.name} · ${agent.team}`}
          >
            <div
              className={cn('h-4 w-4 rounded-full border-2 border-white shadow-md cursor-pointer', agent.status === 'active' && 'animate-pulse')}
              style={{ backgroundColor: color }}
            />
          </div>
        )
      })}

      {/* Map labels */}
      <div className="absolute bottom-3 left-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Field Operations Map
      </div>
      <div className="absolute top-3 right-3 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live Feed
      </div>
    </div>
  )
}

export default function SupervisorMapPage() {
  const { projectId } = useParams() as { projectId: string }
  const [liveAgents, setLiveAgents] = React.useState<LiveAgent[]>([])
  const [zonesData, setZonesData] = React.useState<any[]>([])
  const [projectTeams, setProjectTeams] = React.useState<any[]>([])
  const [zonesVisible, setZonesVisible] = React.useState(true)
  const [teamFilter, setTeamFilter] = React.useState('all')
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const timeAgo = React.useCallback((iso: string) => {
    const t = new Date(iso).getTime()
    if (!Number.isFinite(t)) return '—'
    const diff = Date.now() - t
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const day = Math.floor(hr / 24)
    return `${day}d ago`
  }, [])

  const fetchData = React.useCallback(async () => {
    if (!projectId) return
    setIsLoading(true)
    try {
      const [agentsRes, zonesRes, teamsRes] = await Promise.all([
        http.get<any>(`/projects/${projectId}/locations`),
        zoneService.getByProject(projectId),
        teamService.getByProject(projectId)
      ])
      
      const rows = agentsRes?.data?.locations ?? []
      const mapped: LiveAgent[] = rows.map((r: any) => ({
        id: r.user_id,
        name: r.name ?? r.email ?? r.user_id,
        team: r.team_name || r.role || 'field_agent',
        zone: 'Operational Area',
        status: r.status === 'online' ? 'active' : r.status === 'idle' ? 'idle' : 'offline',
        lastUpdate: timeAgo(r.updated_at),
        lat: Number(r.lat ?? 0),
        lng: Number(r.lng ?? 0),
        submissions: 0,
      }))
      setLiveAgents(mapped)
      setZonesData(zonesRes)
      setProjectTeams(teamsRes)
    } catch (err) {
      console.error('Failed to fetch map data', err)
    } finally {
      setIsLoading(false)
    }
  }, [projectId, timeAgo])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredAgents = teamFilter === 'all' ? liveAgents : liveAgents.filter(a => a.team === teamFilter)
  const activeCount = liveAgents.filter(a => a.status === 'active').length

  return (
    <>
      <DashboardHeader
        title="Live Map"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor/projects' }}
        breadcrumbs={[{ label: 'My Projects', href: '/supervisor/projects' }, { label: 'Live Map' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Live Map</h1>
                <Badge variant="default" className="gap-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  Live Operational Feed
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Real-time tracking of mission assets and coverage zones</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setRefreshing(true)
                await fetchData()
                setTimeout(() => setRefreshing(false), 400)
              }}
              disabled={refreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
            </Button>
          </div>

          {/* Live stats bar */}
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeCount} agents active</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>{liveAgents.filter(a => a.status === 'idle').length} idle</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Radio className="h-3.5 w-3.5" />
              <span>{zonesData.length} active zones tracked</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {/* Map */}
            <div className="lg:col-span-3 space-y-3">
              {/* Map Controls */}
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-44 h-8 text-xs">
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {projectTeams.map(t => (
                      <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch id="zones" checked={zonesVisible} onCheckedChange={setZonesVisible} />
                    <Label htmlFor="zones" className="text-xs cursor-pointer">Zone Overlay</Label>
                  </div>
                </div>
              </div>

              {/* Map Canvas */}
              <div className="h-[500px]">
                <MockMap agents={filteredAgents} zonesVisible={zonesVisible} zones={zonesData} />
              </div>

              {/* Zone Legend */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-4">
                    {zonesData.length > 0 ? zonesData.map(z => (
                      <div key={z.id} className="flex items-center gap-1.5">
                        <div className="h-2.5 w-5 rounded-sm border" style={{ backgroundColor: '#22c55e20', borderColor: '#22c55e' }} />
                        <span className="text-xs text-muted-foreground">{z.name}</span>
                        <span className="text-xs text-foreground font-medium">({z.team_name || 'Unassigned'})</span>
                      </div>
                    )) : (
                      <span className="text-xs text-muted-foreground italic">No zones defined for this project</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agents Panel */}
            <div className="space-y-3">
              <Card className="h-full border-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Agents</CardTitle>
                  <CardDescription className="text-xs">{filteredAgents.length} currently visible</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[560px]">
                    <div className="p-3 space-y-2">
                      {isLoading ? (
                        <div className="py-20 text-center">
                          <Clock className="h-8 w-8 animate-spin text-primary opacity-20 mx-auto mb-2" />
                          <p className="text-[10px] text-muted-foreground">Syncing positions...</p>
                        </div>
                      ) : filteredAgents.length === 0 ? (
                        <div className="py-20 text-center text-muted-foreground text-xs italic">
                          No active agents found
                        </div>
                      ) : filteredAgents.map(agent => (
                        <div
                          key={agent.id}
                          className={cn(
                            'flex items-start gap-2.5 rounded-lg p-2.5 cursor-pointer hover:bg-accent transition-colors',
                            selectedAgent === agent.id && 'bg-accent shadow-sm ring-1 ring-primary/10'
                          )}
                          onClick={() => setSelectedAgent(a => a === agent.id ? null : agent.id)}
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-[10px] font-bold" style={{ backgroundColor: (teamColors[agent.team] || '#888') + '20', color: teamColors[agent.team] || '#888' }}>
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background shadow-sm', statusDot[agent.status])} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{agent.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{agent.team}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-2.5 w-2.5 text-primary" />
                              <span className="text-[10px] text-foreground font-medium">{agent.zone}</span>
                            </div>
                            {selectedAgent === agent.id && (
                              <div className="mt-3 space-y-2 border-t border-border pt-2">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">ID</span>
                                  <span className="font-mono text-[9px]">{agent.id.slice(0, 8)}...</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">Coordinates</span>
                                  <span className="font-medium">{agent.lat.toFixed(4)}, {agent.lng.toFixed(4)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 bg-muted/40 px-1.5 py-0.5 rounded text-[9px] h-fit">
                            <Clock className="h-2.5 w-2.5" />
                            <span className="text-muted-foreground whitespace-nowrap">{agent.lastUpdate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
