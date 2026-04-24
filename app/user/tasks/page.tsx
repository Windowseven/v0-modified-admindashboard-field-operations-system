'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ClipboardList, MapPin, Clock, FileText, ChevronRight,
  CheckCircle2, Circle, Loader2, AlertCircle, Filter,
  Users, User,
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { http } from '@/lib/api/httpClient'
import { syncService } from '@/lib/api/syncService'
import { useAuth } from '@/lib/auth/AuthContext'

export type TaskStatus = 'pending' | 'in-progress' | 'completed'

const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted/60' },
  'in-progress': { label: 'In Progress', icon: Loader2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
}

const priorityConfig = {
  high: { label: 'High', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  medium: { label: 'Medium', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  low: { label: 'Low', dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
}

export default function UserTasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res: any = await http.get('/tasks')
      if (res.status === 'success') {
        setTasks(res.data.tasks)
      }
    } catch (error) {
      console.error('[Tasks] Fetch failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

    // Real update via Sync Service
    await syncService.enqueue('task_update', `Update task: ${task.title}`, {
      task_id: taskId,
      status: newStatus
    })
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  const summary = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <>
      <DashboardHeader
        title="My Tasks"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'My Tasks' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-sm text-muted-foreground">Your assigned work for this session</p>
          </div>

          {/* Summary pills */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Pending', value: summary.pending, color: 'text-muted-foreground', bg: 'bg-muted/60' },
              { label: 'In Progress', value: summary.inProgress, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Completed', value: summary.completed, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((s) => (
              <Card key={s.label} className="cursor-pointer" onClick={() => setFilter(
                s.label === 'In Progress' ? 'in-progress' : s.label.toLowerCase() as any
              )}>
                <CardContent className="p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Task cards */}
          <div className="space-y-3">
            {filtered.map((task) => {
              const sc = statusConfig[task.status as TaskStatus] || statusConfig.pending
              const pc = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium
              const StatusIcon = sc.icon
              return (
                <Card key={task.id} className={cn(
                  'transition-shadow hover:shadow-md',
                  task.status === 'in-progress' && 'border-amber-500/30'
                )}>
                  <CardContent className="p-4 space-y-3">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0 mt-0.5', sc.bg)}>
                        <StatusIcon className={cn('h-4 w-4', sc.color, task.status === 'in-progress' && 'animate-spin')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-sm font-semibold leading-tight',
                            task.status === 'completed' && 'line-through text-muted-foreground'
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className={cn('h-2 w-2 rounded-full', pc.dot)} />
                            <span className={cn('text-[10px] font-medium', pc.text)}>{pc.label}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {task.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {task.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        {task.mode === 'group' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {task.mode === 'group' ? 'Group task' : 'Individual'}
                      </span>
                    </div>

                    {/* Actions */}
                    {task.status !== 'completed' && (
                      <div className="flex gap-2 pt-1">
                        {task.linkedForm && (
                          <Button asChild size="sm" className="flex-1 gap-2 h-9">
                            <Link href={`/user/forms/${task.linkedForm}`}>
                              <FileText className="h-3.5 w-3.5" /> Open Form
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id, task.status === 'pending' ? 'in-progress' : 'completed')}
                          className={cn(
                            'h-9',
                            task.linkedForm ? '' : 'flex-1',
                            task.status === 'pending' ? 'gap-2' : 'gap-2'
                          )}
                        >
                          {task.status === 'pending' ? (
                            <><Loader2 className="h-3.5 w-3.5" /> Mark In Progress</>
                          ) : (
                            <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark Complete</>
                          )}
                        </Button>
                      </div>
                    )}

                    {task.status === 'completed' && task.completedAt && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Completed at {task.completedAt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <ClipboardList className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold text-lg">No tasks</p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter !== 'all' ? 'Try a different filter' : 'No tasks assigned yet'}
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  )
}

