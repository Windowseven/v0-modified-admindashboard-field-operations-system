'use client'

import { useState } from 'react'
import {
  User, Lock, Bell, MapPin, Shield, LogOut,
  Save, Eye, EyeOff, CheckCircle2, Smartphone,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { mockUserProfile } from '@/lib/mock-user'

export default function UserSettingsPage() {
  const [locationSharing, setLocationSharing] = useState(mockUserProfile.locationSharingEnabled)
  const [notifications, setNotifications] = useState(mockUserProfile.notificationsEnabled)
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <DashboardHeader
        title="Settings"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Settings' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Profile card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Profile Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xl font-bold text-primary shrink-0">
                  {mockUserProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold">{mockUserProfile.name}</p>
                  <p className="text-sm text-muted-foreground">{mockUserProfile.email}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">Field Agent</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                  <Input defaultValue={mockUserProfile.name} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</Label>
                  <Input defaultValue={mockUserProfile.phone} className="h-10" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</Label>
                  <Input defaultValue={mockUserProfile.email} type="email" className="h-10" disabled />
                </div>
              </div>

              {/* Read-only field info */}
              <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                {[
                  { label: 'Assigned Zone', value: mockUserProfile.assignedZone },
                  { label: 'Project', value: mockUserProfile.assignedProject },
                  { label: 'Team', value: mockUserProfile.teamName },
                  { label: 'Team Leader', value: mockUserProfile.teamLeader },
                  { label: 'Device ID', value: mockUserProfile.deviceId },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-right max-w-[60%] truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              <Button onClick={handleSave} className={cn('gap-2 w-full sm:w-auto', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
                {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Password</Label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-10 pr-10" />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</Label>
                <Input type="password" placeholder="••••••••" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" className="h-10" />
              </div>
              <Button variant="outline" className="gap-2">
                <Lock className="h-4 w-4" /> Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Privacy & Location
              </CardTitle>
              <CardDescription>Control how your data is shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: 'location',
                  label: 'Location Sharing',
                  desc: 'Allow your team leader to see your real-time GPS position',
                  icon: MapPin,
                  value: locationSharing,
                  set: setLocationSharing,
                  warn: !locationSharing,
                },
                {
                  id: 'notifs',
                  label: 'Push Notifications',
                  desc: 'Receive task assignments, alerts, and messages',
                  icon: Bell,
                  value: notifications,
                  set: setNotifications,
                  warn: false,
                },
              ].map((pref) => (
                <div key={pref.id} className={cn(
                  'flex items-start justify-between gap-4 rounded-lg p-3 border',
                  pref.warn ? 'border-amber-500/30 bg-amber-500/5' : 'border-border'
                )}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <pref.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                      {pref.warn && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                          Your team can't see your position
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => pref.set(!pref.value)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
                      pref.value ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  >
                    <span className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                      pref.value ? 'translate-x-5' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Device & Session */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" /> Device & Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-xs">
                {[
                  { label: 'Device ID', value: mockUserProfile.deviceId },
                  { label: 'App Version', value: 'FieldSync v1.0.0' },
                  { label: 'Last Sync', value: 'Just now' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
                <LogOut className="h-4 w-4" /> End Session & Sign Out
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
