import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { FileText, CheckCircle, Clock, Download, Eye, Edit3 } from 'lucide-react'

const mockFormsData = [
  {
    id: 'form-1',
    title: 'Household Survey v2.1',
    submittedBy: 'Jane Smith',
    status: 'submitted',
    timestamp: '2024-04-15 14:23',
    zone: 'Alpha North',
    actions: 2,
  },
  {
    id: 'form-2',
    title: 'Asset Inventory',
    submittedBy: 'Mike Johnson',
    status: 'draft',
    timestamp: '2024-04-15 13:45',
    zone: 'Alpha South',
    actions: 0,
  },
  {
    id: 'form-3',
    title: 'Household Survey v2.1',
    submittedBy: 'Sarah Lee',
    status: 'pending-review',
    timestamp: '2024-04-15 12:10',
    zone: 'Alpha North',
    actions: 1,
  },
  // Add more
]

export default function FormsPage() {
  const statusConfig = {
    submitted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    'pending-review': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    draft: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
  } as const

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Submissions</h1>
          <p className="text-muted-foreground">Track form progress and review submissions</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">47 Total</Badge>
          <Badge className="bg-primary">12 Pending</Badge>
          <Badge variant="outline">3 Drafts</Badge>
        </div>
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
                {mockFormsData.map((form) => (
                  <TableRow key={form.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <div className="font-semibold">{form.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">JS</span>
                        </div>
                        <span>{form.submittedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", (statusConfig as any)[form.status])}>
                        {form.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>{form.zone}</TableCell>
                    <TableCell className="text-sm">{form.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
            <CardTitle className="text-2xl">47</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Total Forms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-emerald-600 font-bold">42</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wide">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-500 font-bold">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-orange-500 uppercase font-semibold tracking-wide">Pending Review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

