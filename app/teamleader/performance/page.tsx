"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, Crown, LineChart as LineChartIcon } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function PerformancePage() {
  const sortedMembers = [...mockTeamMembers].sort((a, b) =>
    (b.tasksCompleted + b.formsSubmitted) - (a.tasksCompleted + a.formsSubmitted)
  )

  const leaderboard = sortedMembers.slice(0, 5)
  const totalTasks = mockTeamMembers.reduce((s, m) => s + m.tasksCompleted, 0)
  const totalForms = mockTeamMembers.reduce((s, m) => s + m.formsSubmitted, 0)

  // Mock trend data for line chart
  const trendData = [
    { day: 'Mon', tasks: 12, forms: 8, completion: 85 },
    { day: 'Tue', tasks: 15, forms: 10, completion: 88 },
    { day: 'Wed', tasks: 18, forms: 12, completion: 87 },
    { day: 'Thu', tasks: 14, forms: 9, completion: 89 },
    { day: 'Fri', tasks: 20, forms: 14, completion: 91 },
    { day: 'Sat', tasks: 10, forms: 6, completion: 84 },
  ]

  // Mock member performance radar data
  const radarData = sortedMembers.slice(0, 5).map(m => ({
    name: m.name.split(' ')[0],
    score: m.tasksCompleted + m.formsSubmitted,
    tasks: m.tasksCompleted,
    forms: m.formsSubmitted,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Performance</h1>
          <p className="text-muted-foreground">Leaderboard and performance metrics</p>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm self-start">
          <TrendingUp className="h-4 w-4 mr-1" />
          Team Avg +12% 📈
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((member, index) => (
                <div key={member.id} className={cn('flex items-center gap-4 p-4 rounded-lg border', index === 0 && 'bg-emerald-500/10 border-emerald-500')}>
                  <div className={cn('w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center', index === 0 ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary')}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">Tasks: {member.tasksCompleted} | Forms: {member.formsSubmitted}</p>
                  </div>
                  <div className="font-bold text-lg">
                    {member.tasksCompleted + member.formsSubmitted}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Session Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
                <span className="text-2xl font-bold">{totalTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Forms</span>
                <span className="text-2xl font-bold">{totalForms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Avg Completion</span>
                <span className="text-2xl font-bold text-emerald-600">87%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Zone Coverage</span>
                <Badge className="bg-emerald-500">92%</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Alpha North</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '92%'}} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Alpha South</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Team tasks and forms completion over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} name="Tasks" />
              <Line type="monotone" dataKey="forms" stroke="#10b981" strokeWidth={2} name="Forms" />
              <Line type="monotone" dataKey="completion" stroke="#f59e0b" strokeWidth={2} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Member Performance Comparison
            </CardTitle>
            <CardDescription>Bar chart of top performers</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend />
                <Bar dataKey="tasks" fill="#3b82f6" name="Tasks" radius={[8, 8, 0, 0]} />
                <Bar dataKey="forms" fill="#10b981" name="Forms" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional member scores</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <PolarRadiusAxis stroke="var(--color-muted-foreground)" />
                <Radar name="Total Score" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
