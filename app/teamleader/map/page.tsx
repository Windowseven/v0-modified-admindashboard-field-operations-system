import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { MapPin, Users, AlertTriangle, Maximize2, Filter, Layers } from 'lucide-react'
import { mockProjects } from '@/lib/mock-projects'

export default function TeamLeaderMapPage() {
  const project = mockProjects[0] // Use first project for demo
  const onlineMembers = mockTeamMembers.filter(m => m.status === 'online' || m.status === 'active')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Field Map</h1>
          <p className="text-muted-foreground">Real-time team tracking - {project.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {onlineMembers.length} Online
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex items-center gap-1">
            Zone Alpha 92%
          </Badge>
          <Button size="sm" variant="outline">
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Preview / Placeholder */}
        <Card className="lg:col-span-2 h-[600px] overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle className="text-xl">Zone Coverage - {project.location}</CardTitle>
            </div>
            <CardDescription>Live GPS tracking and zone boundaries</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-full">
            {/* Map Placeholder */}
            <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 rounded-lg">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-primary-foreground rounded-full flex items-center justify-center shadow-lg mb-6">
                    <MapPin className="h-12 w-12 text-primary-foreground/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-foreground/80">Interactive Map View</h3>
                  <p className="text-muted-foreground/60 max-w-md mx-auto">
                    Team locations, movement paths, zone boundaries, and coverage heatmaps
                  </p>
                  <div className="flex gap-2 justify-center pt-4">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Layers className="h-3 w-3 mr-1" />
                      Zones
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Controls & Legend */}
        <div className="space-y-6 lg:space-y-0 lg:space-x-0 lg:grid lg:grid-cols-1 lg:gap-6">
          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Map Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Track All Members
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                Alerts Only
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Zone Boundaries
              </Button>
              <Button className="w-full h-10" size="sm">
                Center on Team
              </Button>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Team Leader</span>
                  <div className="flex h-3 w-3 rounded-full bg-emerald-600" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Member</span>
                  <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Online</span>
                  <div className="flex h-3 w-3 rounded-full bg-blue-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Idle</span>
                  <div className="flex h-3 w-3 rounded-full bg-amber-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Offline</span>
                  <div className="flex h-3 w-3 rounded-full bg-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="text-3xl font-bold text-emerald-600">92%</div>
              <div className="text-xs text-muted-foreground">Zone Alpha complete</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

