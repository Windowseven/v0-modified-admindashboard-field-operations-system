'use client'

import * as React from 'react'
import {
  User, Lock, Bell, FolderOpen, Shield, Save, Eye, EyeOff,
  Mail, Phone, Globe, Camera, AlertTriangle, Pause,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function SupervisorSettingsPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)

  return (
    <>
      <DashboardHeader
        title="Settings"
        rootCrumb={{ label: 'Supervisor', href: '/supervisor' }}
        breadcrumbs={[{ label: 'Project Overview', href: '/supervisor' }, { label: 'Settings' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your personal profile, project settings, and notifications</p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-1.5 hidden sm:inline" />Profile</TabsTrigger>
              <TabsTrigger value="project"><FolderOpen className="h-4 w-4 mr-1.5 hidden sm:inline" />Project</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5 hidden sm:inline" />Alerts</TabsTrigger>
              <TabsTrigger value="security"><Lock className="h-4 w-4 mr-1.5 hidden sm:inline" />Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details visible to team members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">JN</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" /> Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input defaultValue="Jane" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input defaultValue="Njoroge" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" defaultValue="jane.njoroge@fieldsync.io" type="email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" defaultValue="+254 712 345 678" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role / Title</Label>
                    <Input defaultValue="Field Survey Supervisor" />
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea rows={3} defaultValue="Supervising urban survey operations across Nairobi county." />
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" /> Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Tab */}
            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                  <CardDescription>Configure settings for Urban Survey — Nairobi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input defaultValue="Urban Survey — Nairobi" />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Description</Label>
                    <Textarea rows={3} defaultValue="A comprehensive household and infrastructure survey across 12 zones in Nairobi County, Kenya." />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" defaultValue="2026-03-01" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" defaultValue="2026-06-30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Submission Mode (Default)</Label>
                    <Select defaultValue="individual">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Default mode applied to new forms unless overridden.</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {[
                      { label: 'Require GPS on form submission', desc: 'Agents must have active GPS to submit forms', default: true },
                      { label: 'Allow offline submissions', desc: 'Submissions are queued and uploaded when online', default: true },
                      { label: 'Enable zone boundary enforcement', desc: 'Agents cannot submit outside their assigned zone', default: false },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                        <Switch defaultChecked={s.default} />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-amber-500 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Danger Zone
                    </p>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                      <div>
                        <p className="text-sm font-medium">Pause Project</p>
                        <p className="text-xs text-muted-foreground">Temporarily suspend all field activity</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-amber-500 border-amber-500/30">
                        <Pause className="h-4 w-4 mr-2" /> Pause
                      </Button>
                    </div>
                  </div>

                  <Button><Save className="h-4 w-4 mr-2" /> Save Project Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose which events you want to be notified about</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      group: 'Field Alerts',
                      items: [
                        { label: 'Help requests from agents', desc: 'When a field agent requests assistance' },
                        { label: 'Inactive agent warning', desc: 'Agent has not moved for 30+ minutes' },
                        { label: 'GPS signal loss', desc: 'Agent device loses GPS tracking' },
                        { label: 'Zone boundary breach', desc: 'Agent moves outside assigned zone' },
                      ]
                    },
                    {
                      group: 'Task & Form Events',
                      items: [
                        { label: 'Form batch submitted', desc: 'A team submits a batch of forms' },
                        { label: 'Task completed', desc: 'A task is marked as done' },
                        { label: 'Task overdue', desc: 'A task has passed its deadline' },
                      ]
                    },
                    {
                      group: 'Team & User Events',
                      items: [
                        { label: 'New member joined', desc: 'Someone joins via invite link' },
                        { label: 'Team leader messages', desc: 'Direct messages from team leaders' },
                      ]
                    },
                  ].map(group => (
                    <div key={group.group}>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{group.group}</p>
                      <div className="space-y-3">
                        {group.items.map(item => (
                          <div key={item.label} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label>Notification Delivery</Label>
                    <div className="space-y-2">
                      {[{ label: 'In-app notifications', checked: true }, { label: 'Email digest (daily)', checked: true }, { label: 'SMS alerts (critical only)', checked: false }].map(d => (
                        <div key={d.label} className="flex items-center justify-between">
                          <span className="text-sm">{d.label}</span>
                          <Switch defaultChecked={d.checked} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button><Save className="h-4 w-4 mr-2" /> Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Keep your account secure with a strong password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(p => !p)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input type={showNew ? 'text' : 'password'} placeholder="••••••••" className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNew(p => !p)}>
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button><Shield className="h-4 w-4 mr-2" /> Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Devices currently signed into your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'Nairobi, Kenya', time: 'Current session', current: true },
                      { device: 'FieldSync Mobile App', location: 'Nairobi, Kenya', time: '2 hours ago', current: false },
                    ].map(session => (
                      <div key={session.device} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{session.device}</p>
                            {session.current && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px]">Current</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs">Revoke</Button>
                        )}
                      </div>
                    ))}
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
