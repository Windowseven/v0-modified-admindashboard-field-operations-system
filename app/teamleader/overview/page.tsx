"use client"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { Users2, MapPin, ListCheck, FileText, Clock, AlertCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeamLeaderOverview() {
  const onlineMembers = mockTeamMembers.filter(m => m.status === 'online' || m.status === 'active').length
  const totalMembers = mockTeamMembers.length
  const tasksPending = 3
  const formsPending = 7
  const alerts = 2

  const stats = [
    { title: 'Active Members', value: `${onlineMembers}/${totalMembers}`, icon: Users2, trend: '+2', color: 'bg-emerald-500/10 text-emerald-500' },
    { title: 'Pending Tasks', value: tasksPending.toString(), icon: ListCheck, trend: '-1', color: 'bg-orange-500/10 text-orange-500' },
    { title: 'Forms Pending', value: formsPending.toString(), icon: FileText, trend: '+3', color: 'bg-blue-500/10 text-blue-500' },
    { title: 'Alerts', value: alerts.toString(), icon: AlertCircle, trend: '+1', color: 'bg-destructive/10 text-destructive' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground">Team Alpha - Zone Survey Operation</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">Live Session</Badge>
          <Badge className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground text-sm">Active</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={cn("hover:shadow-lg transition-all", stat.color)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend.includes('+') ? '↑' : '↓'} {stat.trend} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your team session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/teamleader/map"
                className="h-12 rounded-lg border bg-card hover:bg-accent text-card-foreground shadow-sm transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <MapPin className="h-4 w-4" />
                View Map
              </Link>
              <Link
                href="/teamleader/members"
                className="h-12 rounded-lg border bg-card hover:bg-accent text-card-foreground shadow-sm transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Users2 className="h-4 w-4" />
                Members
              </Link>
              <Link
                href="/teamleader/tasks"
                className="h-12 rounded-lg border bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center gap-2 text-sm font-medium col-span-2"
              >
                <Activity className="h-4 w-4" />
                Start New Task Assignment
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Live Status */}
        <Card>
          <CardHeader>
            <CardTitle>Live Status</CardTitle>
            <CardDescription>Team activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Session Time</span>
              <Badge className="text-xs">02:47:32</Badge>
            </div>
            <div className="space-y-2">
              {[
                { label: 'In Zone', value: '4', color: 'default' },
                { label: 'Outside Zone', value: '1', color: 'destructive' },
                { label: 'Idle >5min', value: '1', color: 'secondary' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <Badge variant={item.color as any}>{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last team updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Jane Smith submitted Form #45 - Zone Alpha North',
              'Mike Johnson marked Task #2 as In Progress',
              'Sarah Lee requested help - Battery low',
              'Team coverage 92% - Good progress',
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
