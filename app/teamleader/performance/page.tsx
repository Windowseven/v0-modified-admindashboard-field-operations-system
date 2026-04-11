import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { BarChart3, TrendingUp, Crown, User, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PerformancePage() {
  // Sort by performance (tasks + forms)
  const sortedMembers = [...mockTeamMembers].sort((a, b) => 
    (b.tasksCompleted + b.formsSubmitted) - (a.tasksCompleted + a.formsSubmitted)
  )

  const leaderboard = sortedMembers.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Performance</h1>
          <p className="text-muted-foreground">Leaderboard and performance metrics</p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground text-sm self-start">
          <TrendingUp className="h-4 w-4 mr-1" />
          Team Avg +12% 📈
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers this session</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Forms</TableHead>
                  <TableHead>Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((member, index) => (
                  <TableRow key={member.id} className={cn(
                    "hover:bg-accent/50",
                    index === 0 && "bg-emerald-500/10 border-emerald-500/30"
                  )}>
                    <TableCell className={cn(
                      "font-bold text-lg",
                      index === 0 ? "text-emerald-600" : "text-muted-foreground"
                    )}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'
                        }`}>
                          {member.name.split(' ')[0][0]}{member.name.split(' ').pop()?.[0]}
                        </div>
                        <span className="font-semibold">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{member.tasksCompleted}</TableCell>
                    <TableCell className="font-mono text-sm">{member.formsSubmitted}</TableCell>
                    <TableCell className="font-bold text-lg">
                      {member.tasksCompleted + member.formsSubmitted}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Session Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Tasks Completed</span>
                <span className="text-2xl font-bold">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Forms Submitted</span>
                <span className="text-2xl font-bold">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Avg Completion Rate</span>
                <span className="text-2xl font-bold text-emerald-600">87%</span>
              </div>
            </div>

            {/* Target Progress */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Zone Coverage Target</span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600">On Track</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">92% of 12 zones complete</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Comparison Chart Placeholder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Team vs individual progress over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-muted-foreground">Interactive Performance Charts</h3>
            <p className="text-muted-foreground/70 max-w-md mx-auto">
              Individual contribution trends, zone efficiency, and team comparison
            </p>
            <div className="flex gap-2 pt-4">
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                Jane Smith (+15%)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 bg-slate-500 rounded-full" />
                Team Average
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

