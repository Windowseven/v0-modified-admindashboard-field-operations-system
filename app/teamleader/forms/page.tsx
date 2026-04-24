"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { FileText, CheckCircle, Download, Eye, Edit3, Loader2 } from 'lucide-react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api/swr-fetcher'

type SubmissionRow = {
  id: string
  form_title?: string
  form_id?: string
  user_name?: string
  user_id?: string
  status?: string
  submitted_at?: string
  zone_name?: string
  zone_id?: string
}

type FormRow = {
  id: string
  title: string
  submittedBy: string
  initials: string
  status: 'submitted' | 'pending-review' | 'draft'
  timestamp: string
  zone: string
}

const statusConfig = {
  submitted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  'pending-review': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  draft: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
} as const

export default function FormsPage() {
  const { data: projectsData } = useSWR('/projects', fetcher)
  const activeProjectId = projectsData?.projects?.[0]?.id || projectsData?.[0]?.id
  const { data: submissionsData, isLoading } = useSWR(
    activeProjectId ? `/projects/${activeProjectId}/submissions` : null,
    fetcher
  )
  const [selectedForm, setSelectedForm] = useState<FormRow | null>(null)
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending-review' | 'draft'>('all')
  const submissions: SubmissionRow[] = submissionsData?.submissions || []

  const formsData: FormRow[] = submissions.map((submission) => ({
    id: submission.id,
    title: submission.form_title || submission.form_id || 'Untitled Form',
    submittedBy: submission.user_name || submission.user_id || 'Unknown',
    initials: String(submission.user_name || submission.user_id || 'U')
      .split(' ')
      .map((part: string) => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    status:
      submission.status === 'approved'
        ? 'submitted'
        : submission.status === 'pending'
          ? 'pending-review'
          : 'draft',
    timestamp: submission.submitted_at
      ? new Date(submission.submitted_at).toLocaleString()
      : '—',
    zone: submission.zone_name || submission.zone_id || '—',
  }))

  const filtered = filter === 'all' ? formsData : formsData.filter((f) => f.status === filter)
  const pendingCount = formsData.filter((f) => f.status === 'pending-review').length
  const draftCount = formsData.filter((f) => f.status === 'draft').length

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading submissions...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Submissions</h1>
          <p className="text-muted-foreground">Track form progress and review submissions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{formsData.length} Total</Badge>
          <Badge className="bg-orange-500">{pendingCount} Pending</Badge>
          <Badge variant="outline">{draftCount} Drafts</Badge>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'submitted', 'pending-review', 'draft'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
          <CardDescription>Latest form activity from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((form) => (
                  <TableRow key={form.id} className="hover:bg-accent/50 cursor-pointer" onClick={() => setSelectedForm(form)}>
                    <TableCell className="font-medium">
                      <div className="font-semibold">{form.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{form.initials}</span>
                        </div>
                        <span>{form.submittedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', statusConfig[form.status])}>
                        {form.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>{form.zone}</TableCell>
                    <TableCell className="text-sm">{form.timestamp}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedForm(form)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Submission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{formsData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Total Forms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-emerald-600 font-bold">
              {formsData.filter((f) => f.status === 'submitted').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wide">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-500 font-bold">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-orange-500 uppercase font-semibold tracking-wide">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Form Detail Dialog */}
      <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedForm?.title}</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Submitted By</p>
                  <p className="font-medium">{selectedForm.submittedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Zone</p>
                  <p className="font-medium">{selectedForm.zone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedForm.timestamp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={cn('text-xs mt-1', statusConfig[selectedForm.status])}>
                    {selectedForm.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

