'use client'

import * as React from 'react'
import {
  Users, MapPin, Radio, Layers, Navigation, ZoomIn, ZoomOut,
  Maximize2, Eye, EyeOff, RefreshCw, ChevronRight, Circle,
  Filter, Clock,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const liveAgents = [
  { id: 'a1', name: 'Kwame Asante', team: 'Team Alpha', zone: 'Zone A', status: 'active' as const, lastUpdate: '30s ago', lat: -1.286, lng: 36.820, submissions: 43 },
  { id: 'a2', name: 'Tewodros Bekele', team: 'Team Alpha', zone: 'Zone A', status: 'active' as const, lastUpdate: '1m ago', lat: -1.290, lng: 36.823, submissions: 19 },
  { id: 'a3', name: 'Amina Sesay', team: 'Team Beta', zone: 'Zone C', status: 'active' as const, lastUpdate: '45s ago', lat: -1.268, lng: 36.807, submissions: 27 },
  { id: 'a4', name: 'Osei Mensah', team: 'Team Beta', zone: 'Zone C', status: 'idle' as const, lastUpdate: '8m ago', lat: -1.272, lng: 36.811, submissions: 14 },
  { id: 'a5', name: 'Yvonne Cherono', team: 'Team Gamma', zone: 'Zone E', status: 'active' as const, lastUpdate: '2m ago', lat: -1.300, lng: 36.854, submissions: 22 },
  { id: 'a6', name: 'Sule Bah', team: 'Team Gamma', zone: 'Zone E', status: 'idle' as const, lastUpdate: '15m ago', lat: -1.305, lng: 36.856, submissions: 18 },
  { id: 'a7', name: 'Blessing Okeke', team: 'Team Delta', zone: 'Zone F', status: 'active' as const, lastUpdate: '1m ago', lat: -1.220, lng: 36.890, submissions: 9 },
  { id: 'a8', name: 'Kojo Acheampong', team: 'Team Echo', zone: 'Zone H', status: 'active' as const, lastUpdate: '20s ago', lat: -1.312, lng: 36.793, submissions: 28 },
]

const zones = [
  { id: 'zA', name: 'Zone A', color: '#22c55e', team: 'Team Alpha', visible: true },
  { id: 'zC', name: 'Zone C', color: '#3b82f6', team: 'Team Beta', visible: true },
  { id: 'zE', name: 'Zone E', color: '#f59e0b', team: 'Team Gamma', visible: true },
  { id: 'zF', name: 'Zone F', color: '#a855f7', team: 'Team Delta', visible: true },
  { id: 'zH', name: 'Zone H', color: '#06b6d4', team: 'Team Echo', visible: true },
]

const teamColors: Record<string, string> = {
  'Team Alpha': '#22c55e',
  'Team Beta': '#3b82f6',
  'Team Gamma': '#f59e0b',
  'Team Delta': '#a855f7',
  'Team Echo': '#06b6d4',
}

const statusDot = { active: 'bg-emerald-500 animate-pulse', idle: 'bg-amber-500', offline: 'bg-muted-foreground' }

// Mock SVG map with agent dots
function MockMap({ agents, zonesVisible }: { agents: typeof liveAgents; zonesVisible: boolean }) {
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
      {zonesVisible && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="35%" cy="45%" rx="12%" ry="10%" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 2" />
          <ellipse cx="28%" cy="28%" rx="10%" ry="8%" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 2" />
          <ellipse cx="62%" cy="55%" rx="11%" ry="9%" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 2" />
          <ellipse cx="75%" cy="30%" rx="9%" ry="8%" fill="#a855f7" fillOpacity="0.15" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 2" />
          <ellipse cx="20%" cy="65%" rx="10%" ry="9%" fill="#06b6d4" fillOpacity="0.15" stroke="#06b6d4" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      )}

      {/* Agent dots */}
      {agents.map((agent, i) => {
        const positions = [
          { x: '33%', y: '42%' }, { x: '37%', y: '48%' },
          { x: '26%', y: '25%' }, { x: '30%', y: '31%' },
          { x: '60%', y: '52%' }, { x: '64%', y: '58%' },
          { x: '73%', y: '27%' }, { x: '18%', y: '62%' },
        ]
        const pos = positions[i] || { x: '50%', y: '50%' }
        const color = teamColors[agent.team] || '#888'
        return (
          <div
            key={agent.id}
            className="absolute flex items-center justify-center"
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
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
        Nairobi, Kenya · Mock View
      </div>
      <div className="absolute top-3 right-3 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live Feed
      </div>
    </div>
  )
}

export default function SupervisorMapPage() {
  const [zonesVisible, setZonesVisible] = React.useState(true)
  const [teamFilter, setTeamFilter] = React.useState('all')
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState(false)

  const filteredAgents = teamFilter === 'all' ? liveAgents : liveAgents.filter(a => a.team === teamFilter)
  const activeCount = liveAgents.filter(a => a.status === 'active').length

  return (
    <>
      <DashboardHeader
        title="Live Map"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Live Map' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Live Map</h1>
                <Badge variant="default" className="gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground">Real-time GPS tracking of all field agents</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000) }} disabled={refreshing}>
              <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
            </Button>
          </div>

          {/* Live stats bar */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeCount} agents in field</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>{liveAgents.filter(a => a.status === 'idle').length} idle</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Radio className="h-3.5 w-3.5" />
              <span>5 active zones</span>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="Team Alpha">Team Alpha</SelectItem>
                    <SelectItem value="Team Beta">Team Beta</SelectItem>
                    <SelectItem value="Team Gamma">Team Gamma</SelectItem>
                    <SelectItem value="Team Delta">Team Delta</SelectItem>
                    <SelectItem value="Team Echo">Team Echo</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch id="zones" checked={zonesVisible} onCheckedChange={setZonesVisible} />
                    <Label htmlFor="zones" className="text-xs cursor-pointer">Show Zones</Label>
                  </div>
                </div>
              </div>

              {/* Map Canvas */}
              <div className="h-[500px]">
                <MockMap agents={filteredAgents} zonesVisible={zonesVisible} />
              </div>

              {/* Zone Legend */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-4">
                    {zones.map(z => (
                      <div key={z.id} className="flex items-center gap-1.5">
                        <div className="h-2.5 w-5 rounded-sm border" style={{ backgroundColor: z.color + '40', borderColor: z.color }} />
                        <span className="text-xs text-muted-foreground">{z.name}</span>
                        <span className="text-xs text-foreground font-medium">({z.team})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agents Panel */}
            <div className="space-y-3">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Field Agents</CardTitle>
                  <CardDescription className="text-xs">{filteredAgents.length} agents visible</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[560px]">
                    <div className="p-3 space-y-2">
                      {filteredAgents.map(agent => (
                        <div
                          key={agent.id}
                          className={cn(
                            'flex items-start gap-2.5 rounded-lg p-2.5 cursor-pointer hover:bg-accent transition-colors',
                            selectedAgent === agent.id && 'bg-accent'
                          )}
                          onClick={() => setSelectedAgent(a => a === agent.id ? null : agent.id)}
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-[10px]" style={{ backgroundColor: teamColors[agent.team] + '20', color: teamColors[agent.team] }}>
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background', statusDot[agent.status])} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{agent.name}</p>
                            <p className="text-[10px] text-muted-foreground">{agent.team}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">{agent.zone}</span>
                            </div>
                            {selectedAgent === agent.id && (
                              <div className="mt-2 space-y-1 border-t border-border pt-2">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">Submissions</span>
                                  <span className="font-medium">{agent.submissions}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">Last update</span>
                                  <span className="font-medium">{agent.lastUpdate}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">Coordinates</span>
                                  <span className="font-mono">{agent.lat.toFixed(3)}, {agent.lng.toFixed(3)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{agent.lastUpdate}</span>
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
