import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { Activity, CheckCircle2, MapPin, FileText, Clock, Users } from 'lucide-react'

const mockActivity = [
  {
    id: 'act-1',
    type: 'form-submitted',
    title: 'Form Submission #45',
    member: 'Jane Smith',
    details: 'Household Survey completed in Zone Alpha North',
    timestamp: '2 min ago',
    zone: 'Alpha North',
  },
  {
    id: 'act-2',
    type: 'task-completed',
    title: 'Task #2 finished',
    member: 'Mike Johnson',
    details: 'Zone Beta South infrastructure verified',
    timestamp: '8 min ago',
    zone: 'Beta South',
  },
  {
    id: 'act-3',
    type: 'location-update',
    title: 'Team regrouping',
    member: 'Team Alpha',
    details: 'All members now in central coordination point',
    timestamp: '15 min ago',
    zone: 'Alpha Central',
  },
  {
    id: 'act-4',
    type: 'help-resolved',
    title: 'Help request closed',
    member: 'Sarah Lee',
    details: 'Battery issue resolved, back to work',
    timestamp: '22 min ago',
    zone: 'Alpha South',
  },
]

export default function ActivityPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Timeline</h1>
          <p className="text-muted-foreground">Real-time team activity log</p>
        </div>
        <Badge variant="secondary" className="self-start">
          Live • {mockActivity.length} events
        </Badge>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Activity className="h-7 w-7" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-px">
              {mockActivity.map((event, index) => (
                <div key={event.id} className="group hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0 p-6">
                  <div className="flex items-start gap-4">
                    {/* Time marker */}
                    <div className="flex flex-col items-center flex-shrink-0 w-12 text-xs text-muted-foreground mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="h-full w-px bg-muted mt-2" />
                      {event.timestamp}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                              {event.member.split(' ')[0][0]}{event.member.split(' ').pop()?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-sm leading-tight">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.member}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {event.zone}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{event.details}</p>

                      {/* Event type badges */}
                      <div className="flex flex-wrap gap-2">
                        {event.type === 'form-submitted' && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Form Complete
                          </Badge>
                        )}
                        {event.type === 'task-completed' && (
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                            Task Done
                          </Badge>
                        )}
                        {event.type === 'location-update' && (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            Location
                          </Badge>
                        )}
                        {event.type === 'help-resolved' && (
                          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 text-xs">
                            Help Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Forms Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">27</div>
            <p className="text-sm text-muted-foreground mt-1">+8 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Moves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-sm text-muted-foreground mt-1">Zone changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tasks Done
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">Completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">04:23:17</div>
            <p className="text-sm text-muted-foreground mt-1">Total active time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

