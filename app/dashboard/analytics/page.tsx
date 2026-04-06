'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const dailyData = [
  { date: 'Mon', active: 120, completed: 85, pending: 35 },
  { date: 'Tue', active: 150, completed: 110, pending: 40 },
  { date: 'Wed', active: 140, completed: 95, pending: 45 },
  { date: 'Thu', active: 180, completed: 130, pending: 50 },
  { date: 'Fri', active: 200, completed: 160, pending: 40 },
  { date: 'Sat', active: 170, completed: 140, pending: 30 },
  { date: 'Sun', active: 130, completed: 100, pending: 30 },
];

const zonePerformance = [
  { zone: 'Zone A', completion: 92, coverage: 98 },
  { zone: 'Zone B', completion: 87, coverage: 95 },
  { zone: 'Zone C', completion: 78, coverage: 88 },
  { zone: 'Zone D', completion: 95, coverage: 99 },
  { zone: 'Zone E', completion: 82, coverage: 92 },
];

const taskDistribution = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'In Progress', value: 30, color: '#3b82f6' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'Failed', value: 5, color: '#ef4444' },
];

const teamPerformance = [
  { team: 'Team Alpha', avg: 92, active: 12 },
  { team: 'Team Beta', avg: 88, active: 10 },
  { team: 'Team Gamma', avg: 85, active: 8 },
  { team: 'Team Delta', avg: 90, active: 11 },
  { team: 'Team Epsilon', avg: 87, active: 9 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="mt-2 text-muted-foreground">Real-time insights and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border bg-gradient-to-br from-background to-background/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">87.5%</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <span>+2.3% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-gradient-to-br from-background to-background/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <span>+145 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-gradient-to-br from-background to-background/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Coverage Rate</p>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">94.2%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <span>+1.1% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-gradient-to-br from-background to-background/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">3.2m</div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <span>-0.4m from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Activity Trend */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Daily Activity Trend</CardTitle>
            <CardDescription>Task activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="active" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Current task status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Zone Performance */}
        <Card className="border border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Zone Performance Metrics</CardTitle>
            <CardDescription>Completion and coverage rates by zone</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zonePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="zone" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="completion" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="coverage" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Team Performance Summary</CardTitle>
          <CardDescription>Average completion rate and active members per team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Team Name</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Avg Completion</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Active Members</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((team, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{team.team}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-24 rounded-full bg-background">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{width: `${team.avg}%`}} />
                        </div>
                        <span className="text-foreground font-semibold">{team.avg}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-foreground">{team.active}</td>
                    <td className="px-4 py-4 text-right">
                      <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
