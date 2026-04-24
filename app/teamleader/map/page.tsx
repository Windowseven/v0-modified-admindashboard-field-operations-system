"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, AlertTriangle, Maximize2, Filter, Layers, Loader2 } from 'lucide-react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api/swr-fetcher'

type TeamMember = {
  status?: string
}

export default function TeamLeaderMapPage() {
  const { data: projectsData, error: projectsError } = useSWR('/projects', fetcher)
  const { data: teamData, error: teamError } = useSWR('/team/my/members', fetcher)

  const isLoading = !projectsData && !projectsError || !teamData && !teamError
  const project = projectsData?.projects?.[0] || projectsData?.[0]
  const members: TeamMember[] = teamData?.members || []
  const onlineMembers = members.filter((m) => m.status === 'online' || m.status === 'active')

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading map data...</span>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No active projects found</h2>
        <p className="text-muted-foreground">You need to be assigned to a project to view the map.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Map</h1>
          <p className="text-muted-foreground">Google Maps integration will be enabled next - {project.name}</p>
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
        <Card className="lg:col-span-2 h-[600px] overflow-hidden border-primary/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Zone Coverage - {project.location || 'Site Location'}</CardTitle>
            </div>
            <CardDescription>Temporary map preview (Google Maps API pending)</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-full">
            {/* Map Placeholder */}
            <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 rounded-lg">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-primary-foreground rounded-full flex items-center justify-center shadow-lg mb-6">
                    <MapPin className="h-12 w-12 text-primary-foreground/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-foreground/80">Map Integration Pending</h3>
                  <p className="text-muted-foreground/60 max-w-md mx-auto">
                    We will connect live team locations here once Google Maps API is added.
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
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Map Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary/5 transition-colors" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Track All Members ({onlineMembers.length})
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                Alerts Only
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Zone Boundaries
              </Button>
              <Button className="w-full h-10 shadow-sm" size="sm">
                Center on Team
              </Button>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Team Leader</span>
                  <div className="flex h-3 w-3 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Member</span>
                  <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Online</span>
                  <div className="flex h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Idle</span>
                  <div className="flex h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Offline</span>
                  <div className="flex h-3 w-3 rounded-full bg-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="text-3xl font-bold text-primary">92%</div>
              <div className="text-xs text-muted-foreground">Zone Alpha complete</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


