'use client'

import * as React from 'react'
import {
  Plus, Eye, EyeOff, Pencil, Trash2, MapPin, Users,
  MoreHorizontal, CheckCircle2, Clock, AlertTriangle, Layers,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Zone {
  id: string
  name: string
  description: string
  color: string
  colorHex: string
  team: string
  status: 'active' | 'completed' | 'pending'
  coverage: number
  area: string
  members: number
  visible: boolean
  overlap: boolean
}

const zones: Zone[] = [
  { id: '1', name: 'Zone A', description: 'Central Business District', color: 'bg-chart-1', colorHex: '#22c55e', team: 'Team Alpha', status: 'active', coverage: 79, area: '4.2 km²', members: 9, visible: true, overlap: false },
  { id: '2', name: 'Zone B', description: 'Nairobi West', color: 'bg-chart-2', colorHex: '#3b82f6', team: 'Unassigned', status: 'pending', coverage: 0, area: '6.1 km²', members: 0, visible: true, overlap: false },
  { id: '3', name: 'Zone C', description: 'Westlands', color: 'bg-chart-3', colorHex: '#f59e0b', team: 'Team Beta', status: 'active', coverage: 68, area: '3.8 km²', members: 8, visible: true, overlap: true },
  { id: '4', name: 'Zone D', description: "Lang'ata", color: 'bg-chart-4', colorHex: '#a855f7', team: 'Unassigned', status: 'pending', coverage: 0, area: '8.3 km²', members: 0, visible: false, overlap: false },
  { id: '5', name: 'Zone E', description: 'Eastlands', color: 'bg-chart-5', colorHex: '#06b6d4', team: 'Team Gamma', status: 'active', coverage: 55, area: '5.5 km²', members: 7, visible: true, overlap: false },
  { id: '6', name: 'Zone F', description: 'Kasarani', color: 'bg-chart-1', colorHex: '#22c55e', team: 'Team Delta', status: 'active', coverage: 50, area: '7.2 km²', members: 10, visible: true, overlap: false },
  { id: '7', name: 'Zone G', description: 'Embakasi', color: 'bg-chart-2', colorHex: '#3b82f6', team: 'Unassigned', status: 'pending', coverage: 0, area: '9.0 km²', members: 0, visible: true, overlap: false },
  { id: '8', name: 'Zone H', description: 'Kibera', color: 'bg-chart-3', colorHex: '#f59e0b', team: 'Team Echo', status: 'active', coverage: 64, area: '3.1 km²', members: 8, visible: true, overlap: false },
  { id: '9', name: 'Zone I', description: 'Mathare', color: 'bg-chart-4', colorHex: '#a855f7', team: 'Unassigned', status: 'pending', coverage: 0, area: '2.8 km²', members: 0, visible: false, overlap: false },
  { id: '10', name: 'Zone J', description: 'Ruaraka', color: 'bg-chart-5', colorHex: '#06b6d4', team: 'Unassigned', status: 'pending', coverage: 0, area: '4.6 km²', members: 0, visible: true, overlap: false },
  { id: '11', name: 'Zone K', description: 'Makadara', color: 'bg-chart-1', colorHex: '#22c55e', team: 'Unassigned', status: 'pending', coverage: 0, area: '3.3 km²', members: 0, visible: true, overlap: false },
  { id: '12', name: 'Zone L', description: 'Dagoretti', color: 'bg-chart-2', colorHex: '#3b82f6', team: 'Unassigned', status: 'pending', coverage: 0, area: '5.9 km²', members: 0, visible: true, overlap: false },
]

const statusConfig = {
  active: { label: 'Active', icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-500' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'bg-primary/10 text-primary' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-muted text-muted-foreground' },
}

export default function SupervisorZonesPage() {
  const [zonesState, setZonesState] = React.useState(zones)
  const [createOpen, setCreateOpen] = React.useState(false)

  function toggleVisible(id: string) {
    setZonesState(prev => prev.map(z => z.id === id ? { ...z, visible: !z.visible } : z))
  }

  const assigned = zonesState.filter(z => z.team !== 'Unassigned')
  const pending = zonesState.filter(z => z.team === 'Unassigned')
  const overlapping = zonesState.filter(z => z.overlap)

  return (
    <>
      <DashboardHeader
        title="Zones"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Zones' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Zones & Coverage</h1>
              <p className="text-muted-foreground">Define geofenced zones, assign teams, and track coverage</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/supervisor/map">
                  <MapPin className="h-4 w-4 mr-2" /> View on Live Map
                </a>
              </Button>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" /> Create Zone</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Zone</DialogTitle>
                    <DialogDescription>Define a new geofenced zone for your field teams.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Zone Name</Label>
                      <Input placeholder="e.g. Zone M - Pumwani" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Brief area description" />
                    </div>
                    <div className="space-y-2">
                      <Label>Assign Team</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select team (optional)" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Leave Unassigned</SelectItem>
                          <SelectItem value="alpha">Team Alpha</SelectItem>
                          <SelectItem value="beta">Team Beta</SelectItem>
                          <SelectItem value="gamma">Team Gamma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted rounded-md p-3">
                      Zone boundaries are drawn directly on the Live Map. After creating the zone, go to Live Map to draw its geofence.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button onClick={() => setCreateOpen(false)}>Create Zone</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Zones', value: zonesState.length, icon: Layers, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Assigned', value: assigned.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Unassigned', value: pending.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Overlapping', value: overlapping.length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
            ].map(s => (
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

          {/* Zone Grid */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {zonesState.map(zone => {
              const cfg = statusConfig[zone.status]
              const StatusIcon = cfg.icon
              return (
                <Card key={zone.id} className={cn('transition-opacity', !zone.visible && 'opacity-50')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: zone.colorHex }} />
                        <div>
                          <CardTitle className="text-base">{zone.name}</CardTitle>
                          <CardDescription className="text-xs">{zone.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {zone.overlap && (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[10px] px-1.5">
                            Overlap
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit Zone</DropdownMenuItem>
                            <DropdownMenuItem><Users className="mr-2 h-4 w-4" /> Reassign Team</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Zone</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {zone.team}
                      </span>
                      <Badge variant="secondary" className={cfg.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Area: <span className="text-foreground font-medium">{zone.area}</span></span>
                      <span>Members: <span className="text-foreground font-medium">{zone.members}</span></span>
                    </div>
                    {zone.status !== 'pending' && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-medium">{zone.coverage}%</span>
                        </div>
                        <Progress value={zone.coverage} className="h-1.5" />
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-border">
                      <span className="text-xs text-muted-foreground">Visible on map</span>
                      <Switch checked={zone.visible} onCheckedChange={() => toggleVisible(zone.id)} />
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
