'use client'

import * as React from 'react'
import {
  TrendingUp, TrendingDown, Users, ClipboardList, Clock,
  MapPin, Download, Filter, Calendar, BarChart3, PieChart as PieChartIcon,
  Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Cell, Pie,
} from 'recharts'
import { cn } from '@/lib/utils'

const submissionData = [
  { name: 'Mon', total: 42, approved: 38 },
  { name: 'Tue', total: 58, approved: 52 },
  { name: 'Wed', total: 45, approved: 40 },
  { name: 'Thu', total: 72, approved: 65 },
  { name: 'Fri', total: 85, approved: 78 },
  { name: 'Sat', total: 32, approved: 28 },
  { name: 'Sun', total: 15, approved: 12 },
]

const teamData = [
  { name: 'Team Alpha', submissions: 145, coverage: 92 },
  { name: 'Team Beta', submissions: 132, coverage: 85 },
  { name: 'Team Gamma', submissions: 98, coverage: 78 },
  { name: 'Team Delta', submissions: 85, coverage: 72 },
  { name: 'Team Echo', submissions: 110, coverage: 88 },
]

const categoryData = [
  { name: 'Residential', value: 450, color: '#22c55e' },
  { name: 'Commercial', value: 250, color: '#3b82f6' },
  { name: 'Industrial', value: 120, color: '#f59e0b' },
  { name: 'Public', value: 180, color: '#a855f7' },
]

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader
        title="Project Analytics"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor/projects' }}
        breadcrumbs={[{ label: 'My Projects', href: '/supervisor/projects' }, { label: 'Analytics' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Project Insight & Analytics</h1>
              <p className="text-muted-foreground">Comprehensive performance data and field intelligence</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" /> Last 7 Days
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Submissions', value: '1,284', trend: '+12.5%', isUp: true, icon: ClipboardList },
              { label: 'Avg. Daily Rate', value: '45.2', trend: '+5.2%', isUp: true, icon: BarChart3 },
              { label: 'Active Agents', value: '38', trend: '-2.4%', isUp: false, icon: Users },
              { label: 'Completion Rate', value: '64.8%', trend: '+8.1%', isUp: true, icon: TrendingUp },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className={cn('flex items-center text-[10px] font-medium', kpi.isUp ? 'text-emerald-500' : 'text-rose-500')}>
                      {kpi.isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {kpi.trend} <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <kpi.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Daily Volume Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">Submission Volume</CardTitle>
                  <CardDescription>Daily total vs approved submissions</CardDescription>
                </div>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                      />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
                      <Bar dataKey="approved" fill="hsl(var(--primary)/0.3)" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribution Pie Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Submission Categories</CardTitle>
                <CardDescription>Data distribution by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold">1,000</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium">{Math.round((cat.value / 1000) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Team Efficiency Table/List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team Performance Metrics</CardTitle>
                <CardDescription>Efficiency and coverage by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {teamData.map((team) => (
                    <div key={team.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase font-bold text-primary">Team</Badge>
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{team.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground uppercase font-semibold tracking-wider">Coverage</span>
                            <span className="font-medium">{team.coverage}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${team.coverage}%` }} />
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-[10px] font-bold text-emerald-500 flex items-center justify-end">
                            <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 4.2%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Field Activity Heatmap (Visual Mock) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Field Activity Density</CardTitle>
                <CardDescription>Geographic concentration of submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] w-full rounded-lg bg-muted relative overflow-hidden">
                  {/* Mock Heatmap Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <Activity className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border rounded p-2 space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Density Legend</p>
                    <div className="h-2 w-24 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-900 rounded-full" />
                    <div className="flex justify-between text-[8px] text-muted-foreground font-medium">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  {/* Mock clusters */}
                  <div className="absolute top-[20%] left-[30%] h-16 w-16 bg-emerald-500/20 rounded-full blur-xl" />
                  <div className="absolute top-[40%] left-[60%] h-24 w-24 bg-emerald-500/30 rounded-full blur-2xl" />
                  <div className="absolute top-[70%] left-[45%] h-20 w-20 bg-emerald-500/20 rounded-full blur-xl" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs pt-4 border-t">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Nairobi Central most active</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">View Heatmap Detail</Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </>
  )
}
