import {
  Users,
  MapPin,
  FileText,
  Radio,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { TeamStatus } from '@/components/dashboard/team-status'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { LiveUsers } from '@/components/dashboard/live-users'
import { ZoneCoverage } from '@/components/dashboard/zone-coverage'

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Overview" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Title */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Mission Control
            </h1>
            <p className="text-muted-foreground">
              Real-time overview of all field operations
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              title="Active Users"
              value="48"
              icon={Users}
              trend={{ value: 12, label: 'from yesterday' }}
              status="success"
            />
            <StatCard
              title="Teams in Field"
              value="6"
              icon={Radio}
              description="All teams deployed"
              status="default"
            />
            <StatCard
              title="Active Zones"
              value="8"
              icon={MapPin}
              trend={{ value: 2, label: 'new zones today' }}
              status="default"
            />
            <StatCard
              title="Forms Submitted"
              value="284"
              icon={FileText}
              trend={{ value: 24, label: 'from last hour' }}
              status="success"
            />
            <StatCard
              title="Coverage Rate"
              value="72%"
              icon={TrendingUp}
              trend={{ value: 8, label: 'improvement' }}
              status="success"
            />
            <StatCard
              title="Alerts"
              value="3"
              icon={AlertTriangle}
              description="Require attention"
              status="warning"
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ActivityChart />
            <ZoneCoverage />
          </div>

          {/* Teams and Activity Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <TeamStatus />
            <div className="grid gap-6">
              <LiveUsers />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity />
            {/* Alerts Panel */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Active Alerts</h3>
                  <p className="text-sm text-muted-foreground">Requires immediate attention</p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                  3
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Help Request - Team Alpha</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson needs assistance in Zone A sector 3</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Zone Overlap Detected</p>
                    <p className="text-xs text-muted-foreground">Teams Alpha and Gamma operating in overlapping area</p>
                    <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low Coverage Warning</p>
                    <p className="text-xs text-muted-foreground">Zone F coverage below 30% - needs more resources</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
