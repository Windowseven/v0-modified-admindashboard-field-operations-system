'use client'

import * as React from 'react'
import { use } from 'react'
import {
  FolderOpen, Save, AlertTriangle, Pause, Archive,
  Trash2, Play, Settings2, Globe, Clock, Users,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { getProjectById } from '@/lib/mock-projects'

export default function ProjectSettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const project = getProjectById(projectId)
  const projectName = project?.name ?? 'Project Settings'
  const base = `/supervisor/projects/${projectId}`

  return (
    <>
      <DashboardHeader
        title="Project Settings"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor/projects' }}
        breadcrumbs={[
          { label: 'My Projects', href: '/supervisor/projects' },
          { label: projectName, href: base },
          { label: 'Project Settings' },
        ]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Project Settings</h1>
            <p className="text-muted-foreground">Configure settings for <span className="font-medium text-foreground">{projectName}</span></p>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general"><Settings2 className="h-4 w-4 mr-1.5 hidden sm:inline" />General</TabsTrigger>
              <TabsTrigger value="collection"><Globe className="h-4 w-4 mr-1.5 hidden sm:inline" />Collection</TabsTrigger>
              <TabsTrigger value="danger"><AlertTriangle className="h-4 w-4 mr-1.5 hidden sm:inline" />Danger Zone</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Update the core details of this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input defaultValue={project?.name ?? 'Urban Survey — Nairobi'} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={3} defaultValue={project?.description ?? 'A comprehensive household and infrastructure survey.'} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input defaultValue={project?.location ?? 'Nairobi, Kenya'} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" defaultValue="2026-03-01" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date / Deadline</Label>
                      <Input type="date" defaultValue="2026-06-30" />
                    </div>
                  </div>
                  <Button>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection">
              <Card>
                <CardHeader>
                  <CardTitle>Data Collection Settings</CardTitle>
                  <CardDescription>Configure how field data is collected and submitted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Default Submission Mode</Label>
                    <Select defaultValue="individual">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual — each agent submits separately</SelectItem>
                        <SelectItem value="group">Group — team submits as a unit</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Default mode applied to new forms unless overridden per form.</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {[
                      { label: 'Require GPS on form submission', desc: 'Agents must have active GPS to submit forms', default: true },
                      { label: 'Allow offline submissions', desc: 'Submissions are queued and uploaded when back online', default: true },
                      { label: 'Enable zone boundary enforcement', desc: 'Agents cannot submit forms outside their assigned zone', default: false },
                      { label: 'Require photo evidence', desc: 'Agents must attach at least one photo per submission', default: false },
                      { label: 'Real-time sync alerts', desc: 'Notify supervisor when submissions arrive in real time', default: true },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                        <Switch defaultChecked={s.default} />
                      </div>
                    ))}
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" /> Save Collection Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger">
              <div className="space-y-4">
                <Card className="border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-500 flex items-center gap-2">
                      <Pause className="h-5 w-5" /> Pause Project
                    </CardTitle>
                    <CardDescription>Temporarily suspend all field activity for this project. Members will not be able to submit forms until the project is resumed.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10">
                      <Pause className="h-4 w-4 mr-2" /> Pause This Project
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="h-5 w-5 text-muted-foreground" /> Archive Project
                    </CardTitle>
                    <CardDescription>Archive this project. It will be moved out of your active workspace but all data will be preserved. Archived projects can be unarchived later.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="text-muted-foreground">
                      <Archive className="h-4 w-4 mr-2" /> Archive Project
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <Trash2 className="h-5 w-5" /> Delete Project
                    </CardTitle>
                    <CardDescription>Permanently delete this project and all associated data including teams, zones, forms, submissions, and audit logs. This action cannot be undone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete This Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </>
  )
}
