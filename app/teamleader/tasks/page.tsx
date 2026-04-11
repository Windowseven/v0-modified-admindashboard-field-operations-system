"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockTeamMembers, mockTasks } from '@/lib/mock-teamleader'
import { ListTodo, Calendar, User, Clock, CheckCircle2, AlertCircle, Plus, Assign } from 'lucide-react'
import { mockTeamMembers as teamMembers } from '@/lib/mock-teamleader' // Import for assignment

const mockTasksData = [
  {
    id: 'task-1',
    title: 'Zone Alpha North - Household Survey',
    description: 'Complete survey of 50 households',
    assignedTo: ['tm-jane-smith'],
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: '2024-04-15',
    progress: 65,
  },
  {
    id: 'task-2',
    title: 'Review yesterday submissions',
    description: 'Check and approve 15 pending forms',
    assignedTo: [],
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: '2024-04-14',
    progress: 0,
  },
  {
    id: 'task-3',
    title: 'Zone Beta South - Infrastructure check',
    description: 'Verify road conditions and assets',
    assignedTo: ['tm-mike-johnson'],
    status: 'completed' as const,
    priority: 'low' as const,
    dueDate: '2024-04-13',
    progress: 100,
  },
  // Add more tasks
]

export default function TasksPage() {
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const priorityConfig = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-amber-500 text-amber-foreground',
    low: 'bg-emerald-500 text-emerald-foreground',
  } as const

  const statusConfig = {
    pending: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    'in-progress': 'bg-primary/10 text-primary border-primary/30',
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  } as const

  const selectedTask = mockTasksData.find(task => task.id === selectedTaskId)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks & Assignments</h1>
          <p className="text-muted-foreground">Assign, track, and manage field tasks</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{mockTasksData.length} Tasks</Badge>
          <Badge className="bg-primary">3 Pending</Badge>
          <Button onClick={() => setOpenTaskDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasksData.map((task) => (
                <TableRow key={task.id} className="hover:bg-accent/50 group" onClick={() => { setSelectedTaskId(task.id); setOpenTaskDialog(true); }}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.assignedTo.length > 0 ? (
                        task.assignedTo.map(id => {
                          const member = teamMembers.find(m => m.id === id)
                          return member ? (
                            <Badge key={id} variant="secondary" className="text-xs">
                              {member.name.split(' ')[0]}
                            </Badge>
                          ) : null
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs font-medium", (statusConfig as any)[task.status])}>
                      {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs font-medium", (priorityConfig as any)[task.priority])}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{task.progress}%</span>
                  </TableCell>
                  <TableCell className="group-hover:opacity-100 opacity-0 transition-all">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">{selectedTask.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedTask.assignedTo.length} assigned
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Reassign</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Update Progress
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

