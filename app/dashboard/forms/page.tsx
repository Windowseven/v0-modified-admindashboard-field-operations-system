'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Copy,
  Pencil,
  Trash2,
  Eye,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface Form {
  id: string
  name: string
  description: string
  fields: number
  submissions: number
  status: 'active' | 'draft' | 'archived'
  assignedTeams: string[]
  createdAt: string
  lastModified: string
}

const forms: Form[] = [
  {
    id: '1',
    name: 'Community Census Form',
    description: 'Standard census data collection form for household surveys',
    fields: 24,
    submissions: 1247,
    status: 'active',
    assignedTeams: ['Alpha', 'Beta', 'Gamma'],
    createdAt: '2024-01-15',
    lastModified: '2024-03-01',
  },
  {
    id: '2',
    name: 'Health Assessment Survey',
    description: 'Health and wellness screening questionnaire',
    fields: 18,
    submissions: 856,
    status: 'active',
    assignedTeams: ['Alpha', 'Delta'],
    createdAt: '2024-01-20',
    lastModified: '2024-02-28',
  },
  {
    id: '3',
    name: 'Community Feedback Form',
    description: 'General feedback and suggestions collection',
    fields: 12,
    submissions: 432,
    status: 'active',
    assignedTeams: ['Beta'],
    createdAt: '2024-02-01',
    lastModified: '2024-02-15',
  },
  {
    id: '4',
    name: 'Event Registration',
    description: 'Registration form for community events',
    fields: 8,
    submissions: 0,
    status: 'draft',
    assignedTeams: [],
    createdAt: '2024-03-01',
    lastModified: '2024-03-02',
  },
  {
    id: '5',
    name: 'Emergency Contact Form',
    description: 'Emergency contact information collection',
    fields: 15,
    submissions: 2341,
    status: 'archived',
    assignedTeams: ['Alpha', 'Beta', 'Gamma', 'Delta'],
    createdAt: '2023-12-01',
    lastModified: '2024-01-30',
  },
  {
    id: '6',
    name: 'Volunteer Sign-up',
    description: 'Volunteer registration and availability form',
    fields: 10,
    submissions: 189,
    status: 'active',
    assignedTeams: ['Gamma'],
    createdAt: '2024-02-10',
    lastModified: '2024-02-25',
  },
]

function getStatusBadge(status: Form['status']) {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      )
    case 'draft':
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Clock className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      )
    case 'archived':
      return (
        <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
          <AlertCircle className="mr-1 h-3 w-3" />
          Archived
        </Badge>
      )
  }
}

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [activeTab, setActiveTab] = React.useState('all')

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && form.status === 'active') ||
      (activeTab === 'drafts' && form.status === 'draft') ||
      (activeTab === 'archived' && form.status === 'archived')
    return matchesSearch && matchesStatus && matchesTab
  })

  const totalSubmissions = forms.reduce((acc, f) => acc + f.submissions, 0)
  const activeForms = forms.filter((f) => f.status === 'active').length
  const draftForms = forms.filter((f) => f.status === 'draft').length

  return (
    <>
      <DashboardHeader
        title="Forms & Tasks"
        breadcrumbs={[{ label: 'Forms' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Forms & Tasks
              </h1>
              <p className="text-muted-foreground">
                Create, manage, and track form submissions
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Form
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Form</DialogTitle>
                  <DialogDescription>
                    Start building a new dynamic form
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="formName">Form Name</Label>
                    <Input id="formName" placeholder="Community Survey" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="formDesc">Description</Label>
                    <Textarea id="formDesc" placeholder="Describe the purpose of this form" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="formType">Form Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="census">Census</SelectItem>
                          <SelectItem value="survey">Survey</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="registration">Registration</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="formMode">Submission Mode</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Open Form Builder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{forms.length}</p>
                  <p className="text-xs text-muted-foreground">Total Forms</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeForms}</p>
                  <p className="text-xs text-muted-foreground">Active Forms</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{draftForms}</p>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Send className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSubmissions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Submissions</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs and Filters */}
          <div className="flex flex-col gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Forms</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search forms..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Forms Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <Card
                key={form.id}
                className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{form.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {form.fields} fields
                          </p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {form.description}
                  </p>

                  <div className="flex items-center justify-between">
                    {getStatusBadge(form.status)}
                    <span className="text-sm font-medium">
                      {form.submissions.toLocaleString()} submissions
                    </span>
                  </div>

                  {form.assignedTeams.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {form.assignedTeams.map((team) => (
                        <Badge key={team} variant="outline" className="text-xs">
                          {team}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span>Created {form.createdAt}</span>
                    <span>Modified {form.lastModified}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
