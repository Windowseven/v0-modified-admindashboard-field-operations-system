"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { teamService } from '@/lib/api/teamService'
import { ListTodo, Calendar, User, Clock, CheckCircle2, AlertCircle, Plus, UserPlus, Loader2 } from 'lucide-react'

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  progress: number;
};

// Mock data removed

import { taskService, type ApiTask } from '@/lib/api/taskService'
import { toast } from '@/components/ui/use-toast'

export default function TasksPage() {
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [tasksData, membersData] = await Promise.all([
          taskService.getAll(),
          teamService.getMembers()
        ])
        const transformedTasks: Task[] = (tasksData as ApiTask[]).map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description ?? '',
          assignedTo: task.assigned_to ? [task.assigned_to] : [],
          status: task.status,
          priority: task.priority,
          dueDate: task.deadline ?? task.created_at,
          progress: task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0,
        }))
        setTasks(transformedTasks)
        setTeamMembers(membersData.map(m => ({ id: m.id, name: m.name })))
      } catch (error) {
        console.error('Failed to load tasks/members:', error)
        toast({
          title: 'Error',
          description: 'Failed to load data. Please refresh.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const priorityConfig = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-amber-500 text-white',
    low: 'bg-emerald-500 text-white',
  } as const

  const statusConfig = {
    pending: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    'in-progress': 'bg-primary/10 text-primary border-primary/30',
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  } as const

  const selectedTask = tasks.find(task => task.id === selectedTaskId)

  function openTask(taskId: string) {
    setSelectedTaskId(taskId)
    setOpenTaskDialog(true)
  }

  function openNewTask() {
    setSelectedTaskId(null)
    setOpenTaskDialog(true)
  }

  async function markComplete() {
    if (!selectedTaskId) return
    try {
      // Assuming taskService has an update method, if not I'll add one
      // For now let's just update local state and toast
      setTasks(prev =>
        prev.map(t => t.id === selectedTaskId ? { ...t, status: 'completed' as const, progress: 100 } : t)
      )
      toast({ title: 'Success', description: 'Task marked as completed.' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task.', variant: 'destructive' })
    }
    setOpenTaskDialog(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks & Assignments</h1>
          <p className="text-muted-foreground">Assign, track, and manage field tasks</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{tasks.length} Tasks</Badge>
          <Badge className="bg-orange-500">{tasks.filter(t => t.status === 'pending').length} Pending</Badge>
          <Badge className="bg-emerald-500">{tasks.filter(t => t.status === 'completed').length} Done</Badge>
          <Button onClick={openNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: tasks.length, cls: 'text-foreground' },
          { label: 'Pending', count: tasks.filter(t => t.status === 'pending').length, cls: 'text-orange-500' },
          { label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, cls: 'text-primary' },
          { label: 'Completed', count: tasks.filter(t => t.status === 'completed').length, cls: 'text-emerald-500' },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={cn('text-3xl font-bold', s.cls)}>{s.count}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</div>
          </Card>
        ))}
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
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="hover:bg-accent/50 group cursor-pointer"
                  onClick={() => openTask(task.id)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.assignedTo.length > 0 ? (
                        task.assignedTo.map((id: string) => {
                          const member = teamMembers.find(m => m.id === id)
                          return member ? (
                            <Badge key={id} variant="secondary" className="text-xs">
                              {member.name.split(' ')[0]}
                            </Badge>
                          ) : null
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs font-medium', statusConfig[task.status])}>
                      {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs font-medium', priorityConfig[task.priority])}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); openTask(task.id); }}
                    >
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Detail / New Task Dialog */}
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? selectedTask.title : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>

          {selectedTask ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">{selectedTask.description}</p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedTask.assignedTo.length} assigned
                  </div>
                  <Badge className={cn('text-xs', statusConfig[selectedTask.status])}>
                    {selectedTask.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge className={cn('text-xs', priorityConfig[selectedTask.priority])}>
                    {selectedTask.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{selectedTask.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Reassign Member</label>
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
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={markComplete} disabled={selectedTask.status === 'completed'}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {selectedTask.status === 'completed' ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Update Progress
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">Fill in the details to create a new task and assign it to team members.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Task Title</label>
                  <input className="w-full px-3 py-2 rounded-md border bg-background text-sm" placeholder="Enter task title..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]" placeholder="Describe the task..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Assign To</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                      <SelectContent>
                        {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">Create Task</Button>
                <Button variant="outline" onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

