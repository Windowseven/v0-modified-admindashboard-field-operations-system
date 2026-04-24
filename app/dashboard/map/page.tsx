'use client'

import * as React from 'react'
import {
  Plus,
  Layers,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  MapPin,
  Users,
  MoreHorizontal,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Zone {
  id: string
  name: string
  description: string
  color: string
  team: string
  status: 'active' | 'completed' | 'pending'
  coverage: number
  area: string
  members: number
  visible: boolean
}

const zones: Zone[] = [
  {
    id: '1',
    name: 'Zone A - Downtown',
    description: 'Central business district area',
    color: 'bg-chart-1',
    team: 'Alpha',
    status: 'active',
    coverage: 72,
    area: '2.4 km²',
    members: 4,
    visible: true,
  },
  {
    id: '2',
    name: 'Zone B - North District',
    description: 'Residential northern sector',
    color: 'bg-chart-2',
    team: 'Beta',
    status: 'active',
    coverage: 45,
    area: '3.1 km²',
    members: 3,
    visible: true,
  },
  {
    id: '3',
    name: 'Zone C - Industrial',
    description: 'Industrial and warehouse area',
    color: 'bg-chart-3',
    team: 'Gamma',
    status: 'active',
    coverage: 88,
    area: '4.2 km²',
    members: 5,
    visible: true,
  },
  {
    id: '4',
    name: 'Zone D - Suburbs',
    description: 'Suburban residential area',
    color: 'bg-chart-4',
    team: 'Delta',
    status: 'completed',
    coverage: 100,
    area: '5.8 km²',
    members: 2,
    visible: true,
  },
  {
    id: '5',
    name: 'Zone E - East Side',
    description: 'Eastern commercial district',
    color: 'bg-chart-5',
    team: 'Echo',
    status: 'pending',
    coverage: 0,
    area: '2.9 km²',
    members: 0,
    visible: false,
  },
]

const mapLayers = [
  { id: 'zones', label: 'Zone Boundaries', enabled: true },
  { id: 'users', label: 'Team Members', enabled: true },
  { id: 'coverage', label: 'Coverage Heatmap', enabled: false },
  { id: 'routes', label: 'Travel Routes', enabled: false },
  { id: 'labels', label: 'Zone Labels', enabled: true },
]

function getStatusBadge(status: Zone['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-success/10 text-success hover:bg-success/20">Active</Badge>
    case 'completed':
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Completed</Badge>
    case 'pending':
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Pending</Badge>
  }
}

export default function MapPage() {
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null)
  const [layers, setLayers] = React.useState(mapLayers)
  const [zoomLevel, setZoomLevel] = React.useState(100)

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, enabled: !l.enabled } : l))
    )
  }

  return (
    <>
      <DashboardHeader
        title="Map & Zones"
        breadcrumbs={[{ label: 'Map & Zones' }]}
      />
      <main className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Map & Zone Management
              </h1>
              <p className="text-muted-foreground">
                Configure and monitor operational zones
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Zone</DialogTitle>
                  <DialogDescription>
                    Define a new operational zone on the map
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Zone Name</Label>
                    <Input id="name" placeholder="Zone E - East Side" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description of the zone" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="team">Assign Team</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
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
                    <div className="grid gap-2">
                      <Label htmlFor="color">Zone Color</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="cyan">Cyan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Zone</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Map Area */}
            <Card className="flex-1 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b py-3">
                <CardTitle className="text-base">Zone Map</CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-xs text-muted-foreground w-12 text-center">
                    {zoomLevel}%
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative h-full p-0">
                {/* Placeholder Map */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 transition-transform"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(oklch(0.5 0 0 / 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(0.5 0 0 / 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '50px 50px',
                    }}
                  />

                  {/* Zone overlays */}
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={cn(
                        'absolute rounded-lg border-2 transition-all',
                        zone.color.replace('bg-', 'border-'),
                        zone.color + '/10',
                        zone.visible ? 'opacity-100' : 'opacity-30',
                        selectedZone === zone.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      )}
                      style={{
                        left: `${10 + zones.indexOf(zone) * 15}%`,
                        top: `${10 + (zones.indexOf(zone) % 2) * 45}%`,
                        width: '25%',
                        height: '40%',
                      }}
                    >
                      <div className="absolute left-3 top-3">
                        <span className={cn('text-xs font-medium', zone.color.replace('bg-', 'text-'))}>
                          {zone.name.split(' - ')[0]}
                        </span>
                        {zone.status === 'completed' && (
                          <Badge className="ml-2 h-4 bg-primary/20 text-primary text-[10px]">
                            100%
                          </Badge>
                        )}
                      </div>
                      {layers.find((l) => l.id === 'coverage')?.enabled && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <Progress value={zone.coverage} className="h-1" />
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Map info */}
                  <div className="absolute bottom-4 left-4 rounded-lg bg-card/80 px-3 py-2 backdrop-blur">
                    <p className="text-xs text-muted-foreground">
                      Click on a zone to view details • Drag to pan • Scroll to zoom
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="hidden w-80 flex-col gap-4 lg:flex">
              {/* Layers Control */}
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Map Layers
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <Label htmlFor={layer.id} className="text-sm cursor-pointer">
                        {layer.label}
                      </Label>
                      <Switch
                        id={layer.id}
                        checked={layer.enabled}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Zones List */}
              <Card className="flex-1 overflow-hidden">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Zones ({zones.length})</CardTitle>
                  <CardDescription>Manage operational zones</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-480px)]">
                    <div className="space-y-1 px-4 pb-4">
                      {zones.map((zone) => (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone.id)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent/50',
                            selectedZone === zone.id && 'bg-accent'
                          )}
                        >
                          <div className={cn('mt-0.5 h-4 w-4 rounded', zone.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm truncate">{zone.name}</span>
                              {getStatusBadge(zone.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{zone.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Team {zone.team}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {zone.area}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Coverage</span>
                                <span className="font-medium">{zone.coverage}%</span>
                              </div>
                              <Progress value={zone.coverage} className="h-1.5" />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View on Map
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Zone
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Reassign Team
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Zone
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </button>
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

