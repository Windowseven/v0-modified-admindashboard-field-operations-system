'use client'

import { useState } from 'react'
import { TestTube, RefreshCw, CheckCircle2, Play, Trash2, Users, FileText, Database, Zap, RotateCcw, Copy, AlertTriangle } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const testUsers = [
  { name: 'Test Admin', email: 'test.admin@sandbox.fieldsync.io', role: 'Admin', status: 'active', created: '2 days ago' },
  { name: 'Test Supervisor', email: 'test.sup@sandbox.fieldsync.io', role: 'Supervisor', status: 'active', created: '2 days ago' },
  { name: 'Test Leader Alpha', email: 'test.leader.a@sandbox.fieldsync.io', role: 'Team Leader', status: 'active', created: '2 days ago' },
  { name: 'Test Leader Beta', email: 'test.leader.b@sandbox.fieldsync.io', role: 'Team Leader', status: 'active', created: '2 days ago' },
  { name: 'Test Worker 1', email: 'test.worker1@sandbox.fieldsync.io', role: 'Field Worker', status: 'active', created: '2 days ago' },
]

const testRuns = [
  { id: 'RUN-089', suite: 'Authentication Flow', tests: 24, passed: 24, failed: 0, duration: '8.2s', time: '14:30', status: 'passed' },
  { id: 'RUN-088', suite: 'GPS Tracking', tests: 18, passed: 17, failed: 1, duration: '12.4s', time: '14:15', status: 'partial' },
  { id: 'RUN-087', suite: 'Form Submission', tests: 31, passed: 31, failed: 0, duration: '15.7s', time: '13:45', status: 'passed' },
  { id: 'RUN-086', suite: 'Offline Sync', tests: 15, passed: 12, failed: 3, duration: '22.1s', time: '13:00', status: 'failed' },
  { id: 'RUN-085', suite: 'Role-Based Access', tests: 42, passed: 42, failed: 0, duration: '18.3s', time: '12:30', status: 'passed' },
]

const testSuites = [
  { name: 'Authentication Flow', tests: 24, description: 'Login, OTP, password reset, token refresh' },
  { name: 'GPS Tracking', tests: 18, description: 'Location updates, history, real-time streaming' },
  { name: 'Form Submission', tests: 31, description: 'Individual/group modes, validation, drafts' },
  { name: 'Offline Sync', tests: 15, description: 'Pending syncs, conflicts, retry logic' },
  { name: 'Role-Based Access', tests: 42, description: 'Admin, Supervisor, Leader, Worker permissions' },
  { name: 'Team Management', tests: 19, description: 'Create, assign, remove, deactivate teams' },
  { name: 'Zone Operations', tests: 22, description: 'Geofencing, overlap detection, assignment' },
  { name: 'Notifications', tests: 14, description: 'Push, email, in-app, broadcast notifications' },
]

const roleColors: Record<string, string> = {
  Admin: 'bg-primary/10 text-primary',
  Supervisor: 'bg-blue-500/10 text-blue-500',
  'Team Leader': 'bg-emerald-500/10 text-emerald-500',
  'Field Worker': 'bg-amber-500/10 text-amber-500',
}

const runStatusColors: Record<string, string> = {
  passed: 'bg-emerald-500/10 text-emerald-500',
  partial: 'bg-amber-500/10 text-amber-500',
  failed: 'bg-destructive/10 text-destructive',
}

export default function SandboxPage() {
  const [sandboxActive, setSandboxActive] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [running, setRunning] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)

  const handleSeed = () => {
    setSeeding(true)
    setTimeout(() => setSeeding(false), 2500)
  }

  const handleRunSuite = (name: string) => {
    setRunning(name)
    setTimeout(() => setRunning(null), 3000)
  }

  const handleReset = () => {
    setResetting(true)
    setTimeout(() => setResetting(false), 2000)
  }

  return (
    <>
      <DashboardHeader title="Test Environment" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Test Environment</h1>
              <p className="text-muted-foreground">Isolated sandbox for testing features safely without affecting production</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch id="sandbox-toggle" checked={sandboxActive} onCheckedChange={setSandboxActive} />
                <Label htmlFor="sandbox-toggle" className="text-sm">
                  {sandboxActive ? (
                    <span className="text-emerald-500 font-medium">Sandbox Active</span>
                  ) : (
                    <span className="text-muted-foreground">Sandbox Off</span>
                  )}
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} disabled={resetting}>
                <RotateCcw className={cn('h-4 w-4 mr-2', resetting && 'animate-spin')} /> Reset All
              </Button>
            </div>
          </div>

          {/* Sandbox status warning */}
          {!sandboxActive && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-500">Sandbox is disabled. Test runs and data seeding are paused until you re-enable it.</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Test Users', value: '5', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Test Data Size', value: '1.2 GB', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Test Suites', value: '8', icon: TestTube, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Last Run', value: 'Passed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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

          <Tabs defaultValue="suites">
            <TabsList>
              <TabsTrigger value="suites">Test Suites</TabsTrigger>
              <TabsTrigger value="runs">Run History</TabsTrigger>
              <TabsTrigger value="data">Test Data</TabsTrigger>
              <TabsTrigger value="users">Test Users</TabsTrigger>
            </TabsList>

            {/* Test Suites */}
            <TabsContent value="suites">
              <div className="grid gap-4 sm:grid-cols-2">
                {testSuites.map((suite) => (
                  <Card key={suite.name} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <TestTube className="h-4 w-4 text-primary shrink-0" />
                            <p className="font-semibold text-sm">{suite.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{suite.description}</p>
                          <Badge variant="secondary" className="text-[10px]">{suite.tests} tests</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          disabled={!sandboxActive || running === suite.name}
                          onClick={() => handleRunSuite(suite.name)}
                        >
                          {running === suite.name ? (
                            <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Running</>
                          ) : (
                            <><Play className="h-3.5 w-3.5 mr-1.5" /> Run</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button disabled={!sandboxActive}>
                  <Play className="h-4 w-4 mr-2" /> Run All Suites
                </Button>
                <Button variant="outline" disabled={!sandboxActive}>
                  <Zap className="h-4 w-4 mr-2" /> Run Failed Only
                </Button>
              </div>
            </TabsContent>

            {/* Run History */}
            <TabsContent value="runs">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Run ID</TableHead>
                        <TableHead>Suite</TableHead>
                        <TableHead>Tests</TableHead>
                        <TableHead>Passed</TableHead>
                        <TableHead>Failed</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testRuns.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell><span className="font-mono text-xs">{r.id}</span></TableCell>
                          <TableCell><span className="text-sm font-medium">{r.suite}</span></TableCell>
                          <TableCell>{r.tests}</TableCell>
                          <TableCell><span className="text-emerald-500 font-medium">{r.passed}</span></TableCell>
                          <TableCell><span className={r.failed > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>{r.failed}</span></TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{r.duration}</span></TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{r.time}</span></TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={runStatusColors[r.status]}>
                              {r.status === 'passed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {r.status === 'partial' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {r.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {r.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Data */}
            <TabsContent value="data">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Fake GPS Records', count: '24,500', size: '180 MB', icon: Zap },
                  { label: 'Fake Form Submissions', count: '1,200', size: '48 MB', icon: FileText },
                  { label: 'Fake Audit Logs', count: '8,400', size: '22 MB', icon: Database },
                  { label: 'Fake Users', count: '50', size: '1 MB', icon: Users },
                  { label: 'Fake Sessions', count: '320', size: '4 MB', icon: CheckCircle2 },
                  { label: 'Fake Teams & Zones', count: '12 / 24', size: '2 MB', icon: TestTube },
                ].map((d) => (
                  <Card key={d.label}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <d.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{d.label}</p>
                        <p className="text-xs text-muted-foreground">{d.count} records · {d.size}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSeed} disabled={!sandboxActive || seeding}>
                  {seeding ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Seeding...</> : <><Database className="h-4 w-4 mr-2" /> Seed Test Data</>}
                </Button>
                <Button variant="outline" disabled={!sandboxActive}>
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All Data
                </Button>
              </div>
            </TabsContent>

            {/* Test Users */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Sandbox Users</CardTitle>
                    <CardDescription>Test accounts for each role — isolated from production</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" /> Copy Credentials
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testUsers.map((u) => (
                        <TableRow key={u.email}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell><span className="font-mono text-xs text-muted-foreground">{u.email}</span></TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={roleColors[u.role] ?? ''}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> {u.status}
                            </Badge>
                          </TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{u.created}</span></TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Login As</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </>
  )
}
