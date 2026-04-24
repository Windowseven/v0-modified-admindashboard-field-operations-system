'use client'

import { useState } from 'react'
import { Power, AlertTriangle, Shield, MapPin, Lock, WifiOff, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ControlState = {
  trackingDisabled: boolean
  platformLocked: boolean
  registrationBlocked: boolean
  maintenanceMode: boolean
}

const systemStatus = {
  uptime: '14d 6h 23m',
  activeUsers: 189,
  activeSessions: 234,
  activeProjects: 7,
}

const recentEmergencyActions = [
  { action: 'Maintenance mode enabled', by: 'admin', time: '3 days ago', duration: '45 min' },
  { action: 'Live tracking disabled globally', by: 'admin', time: '2 weeks ago', duration: '12 min' },
  { action: 'Platform locked', by: 'admin', time: '1 month ago', duration: '5 min' },
]

export default function EmergencyPage() {
  const [controls, setControls] = useState<ControlState>({
    trackingDisabled: false,
    platformLocked: false,
    registrationBlocked: false,
    maintenanceMode: false,
  })
  const [confirmShutdown, setConfirmShutdown] = useState(false)
  const [reason, setReason] = useState('')
  const [activating, setActivating] = useState<string | null>(null)

  const toggle = (key: keyof ControlState) => {
    setActivating(key)
    setTimeout(() => {
      setControls(prev => ({ ...prev, [key]: !prev[key] }))
      setActivating(null)
    }, 1200)
  }

  const anyActive = Object.values(controls).some(Boolean)

  return (
    <>
      <DashboardHeader title="Emergency Control" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Emergency Control</h1>
              <Badge variant="destructive" className="text-xs">GOD MODE</Badge>
            </div>
            <p className="text-muted-foreground">
              Super admin controls for platform-wide emergency actions. All actions are logged and irreversible without manual reversal.
            </p>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive text-sm">Extreme Caution Required</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Actions on this page affect all users across all projects in real time. Every action is permanently recorded in the audit log with your IP address and timestamp.
              </p>
            </div>
          </div>

          {/* Active Status */}
          {anyActive && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-500 font-medium">
                Emergency controls are currently active. The platform is operating in a restricted state.
              </p>
            </div>
          )}

          {/* System Snapshot */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'System Uptime', value: systemStatus.uptime, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Active Users', value: systemStatus.activeUsers, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Active Sessions', value: systemStatus.activeSessions, icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Active Projects', value: systemStatus.activeProjects, icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', s.bg)}>
                      <s.icon className={cn('h-6 w-6', s.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Emergency Controls Grid */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Disable Live Tracking */}
            <Card className={cn('border-2 transition-colors', controls.trackingDisabled ? 'border-amber-500/50 bg-amber-500/5' : 'border-border')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', controls.trackingDisabled ? 'bg-amber-500/20' : 'bg-muted')}>
                      <MapPin className={cn('h-5 w-5', controls.trackingDisabled ? 'text-amber-500' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Disable Live Tracking</CardTitle>
                      <CardDescription className="text-xs mt-0.5">Stop all GPS updates globally</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={controls.trackingDisabled}
                    onCheckedChange={() => toggle('trackingDisabled')}
                    disabled={activating === 'trackingDisabled'}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Immediately halts all GPS location updates from all {systemStatus.activeUsers} active field workers. Use during a tracking system failure or security incident.
                </p>
                {controls.trackingDisabled && (
                  <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Tracking Disabled
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Block New Registrations */}
            <Card className={cn('border-2 transition-colors', controls.registrationBlocked ? 'border-amber-500/50 bg-amber-500/5' : 'border-border')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', controls.registrationBlocked ? 'bg-amber-500/20' : 'bg-muted')}>
                      <XCircle className={cn('h-5 w-5', controls.registrationBlocked ? 'text-amber-500' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Block Registrations</CardTitle>
                      <CardDescription className="text-xs mt-0.5">Prevent new account creation</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={controls.registrationBlocked}
                    onCheckedChange={() => toggle('registrationBlocked')}
                    disabled={activating === 'registrationBlocked'}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blocks all new user registrations system-wide. Existing accounts can still log in and operate normally.
                </p>
                {controls.registrationBlocked && (
                  <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Registrations Blocked
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card className={cn('border-2 transition-colors', controls.maintenanceMode ? 'border-blue-500/50 bg-blue-500/5' : 'border-border')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', controls.maintenanceMode ? 'bg-blue-500/20' : 'bg-muted')}>
                      <WifiOff className={cn('h-5 w-5', controls.maintenanceMode ? 'text-blue-500' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Maintenance Mode</CardTitle>
                      <CardDescription className="text-xs mt-0.5">Show maintenance screen to all users</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={controls.maintenanceMode}
                    onCheckedChange={() => toggle('maintenanceMode')}
                    disabled={activating === 'maintenanceMode'}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Redirects all {systemStatus.activeUsers} active users to a maintenance page. Admin remains accessible. Use before deploying updates.
                </p>
                {controls.maintenanceMode && (
                  <Badge variant="secondary" className="mt-2 bg-blue-500/10 text-blue-500">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Maintenance Mode On
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Lock Platform */}
            <Card className={cn('border-2 transition-colors', controls.platformLocked ? 'border-destructive/50 bg-destructive/5' : 'border-border')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', controls.platformLocked ? 'bg-destructive/20' : 'bg-muted')}>
                      <Lock className={cn('h-5 w-5', controls.platformLocked ? 'text-destructive' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Lock Platform</CardTitle>
                      <CardDescription className="text-xs mt-0.5">Force-logout all users immediately</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={controls.platformLocked}
                    onCheckedChange={() => toggle('platformLocked')}
                    disabled={activating === 'platformLocked'}
                    className="data-[state=checked]:bg-destructive"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Immediately invalidates all {systemStatus.activeSessions} active sessions and locks the platform. Only admin can re-enter. Use for security emergencies.
                </p>
                {controls.platformLocked && (
                  <Badge variant="secondary" className="mt-2 bg-destructive/10 text-destructive">
                    <Lock className="h-3 w-3 mr-1" /> Platform Locked
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Shutdown */}
          <Card className="border-2 border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <Power className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-base text-destructive">Emergency System Shutdown</CardTitle>
                  <CardDescription>Completely shut down all platform services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will immediately terminate all running services, disconnect all {systemStatus.activeUsers} users, and take the platform completely offline. Requires manual restart from the server.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="shutdown-reason">Reason for shutdown (required)</Label>
                <Textarea
                  id="shutdown-reason"
                  placeholder="Describe the emergency reason for this shutdown..."
                  className="resize-none"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              {!confirmShutdown ? (
                <Button
                  variant="destructive"
                  disabled={!reason.trim()}
                  onClick={() => setConfirmShutdown(true)}
                >
                  <Power className="h-4 w-4 mr-2" /> Initiate Shutdown
                </Button>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/40 bg-destructive/5">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-destructive">Are you absolutely sure?</p>
                    <p className="text-xs text-muted-foreground">This will take the entire platform offline immediately.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setConfirmShutdown(false)}>Cancel</Button>
                    <Button size="sm" variant="destructive">
                      <Power className="h-3.5 w-3.5 mr-1.5" /> Confirm Shutdown
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Emergency Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Emergency Actions</CardTitle>
              <CardDescription>Logged history of emergency control usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEmergencyActions.map((action, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Power className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground">By {action.by} · Duration: {action.duration}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{action.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}

