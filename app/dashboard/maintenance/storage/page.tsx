'use client'

import { useState } from 'react'
import { HardDrive, RefreshCw, AlertTriangle, CheckCircle2, FileText, Image, Database, Trash2, Download } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const storageBreakdown = [
  { name: 'GPS Data', value: 4200, color: 'hsl(var(--primary))' },
  { name: 'Form Submissions', value: 2100, color: 'hsl(var(--chart-2))' },
  { name: 'Audit Logs', value: 1800, color: 'hsl(var(--chart-3))' },
  { name: 'Media Files', value: 980, color: 'hsl(var(--chart-4))' },
  { name: 'Backups', value: 760, color: 'hsl(var(--chart-5))' },
  { name: 'Other', value: 360, color: 'hsl(var(--muted))' },
]

const storageGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  used: Math.floor(8000 + i * 120 + Math.random() * 80),
}))

const projectStorage = [
  { project: 'Evangelism Campaign — Nairobi', supervisor: 'Grace Wanjiku', used: '2.4 GB', files: '12,847', percent: 78, status: 'warning' },
  { project: 'Census Survey — Mombasa', supervisor: 'Ahmed Omar', used: '1.8 GB', files: '8,234', percent: 58, status: 'healthy' },
  { project: 'Outreach Program — Kampala', supervisor: 'Esther Namutebi', used: '890 MB', files: '4,123', percent: 28, status: 'healthy' },
  { project: 'Field Study — Dar es Salaam', supervisor: 'Junior Lespikius', used: '3.1 GB', files: '18,492', percent: 92, status: 'critical' },
  { project: 'Survey — Kigali', supervisor: 'Marie Uwase', used: '450 MB', files: '2,341', percent: 14, status: 'healthy' },
]

const largeFiles = [
  { name: 'gps_export_2026_Q1.csv', size: '842 MB', type: 'CSV', project: 'Nairobi Campaign', age: '14 days', path: '/exports/gps/' },
  { name: 'audit_archive_march.zip', size: '634 MB', type: 'Archive', project: 'System', age: '32 days', path: '/archives/' },
  { name: 'media_uploads_batch_7.tar', size: '521 MB', type: 'Archive', project: 'Mombasa Census', age: '8 days', path: '/media/batch/' },
  { name: 'submissions_full_export.json', size: '418 MB', type: 'JSON', project: 'Dar es Salaam', age: '3 days', path: '/exports/' },
  { name: 'backup_2026_03_15.sql', size: '312 MB', type: 'SQL', project: 'System', age: '24 days', path: '/backups/' },
]

const totalUsed = storageBreakdown.reduce((a, b) => a + b.value, 0)
const totalCapacity = 20000
const usedPercent = Math.round((totalUsed / totalCapacity) * 100)

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    healthy: 'bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-500/10 text-amber-500',
    critical: 'bg-destructive/10 text-destructive',
  }
  return (
    <Badge variant="secondary" className={map[status]}>
      {status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {status === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {status}
    </Badge>
  )
}

export default function StoragePage() {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <DashboardHeader title="Storage" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Storage Management</h1>
              <p className="text-muted-foreground">Monitor usage, file distribution, and per-project quotas</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-3 w-3 mr-1" /> {usedPercent}% Used
              </Badge>
              <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500) }} disabled={refreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} /> Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Clean Up
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Used', value: `${(totalUsed / 1000).toFixed(1)} GB`, sub: `of ${totalCapacity / 1000} GB`, icon: HardDrive, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Total Files', value: '46.0K', sub: 'across all projects', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Media Files', value: '980 MB', sub: 'images & documents', icon: Image, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'DB Storage', value: '7.8 GB', sub: 'separate allocation', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg shrink-0', s.bg)}>
                      <s.icon className={cn('h-6 w-6', s.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Pie */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Storage Breakdown</CardTitle>
                <CardDescription>By data category (MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={storageBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                        {storageBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(v: number) => [`${v} MB`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {storageBreakdown.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-medium">{(s.value / 1000).toFixed(1)} GB</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Storage Growth</CardTitle>
                <CardDescription>Total usage over the past 30 days (MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={storageGrowthData}>
                      <defs>
                        <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} interval={4} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`${v} MB`, 'Used']} />
                      <Area type="monotone" dataKey="used" name="Used" stroke="hsl(var(--primary))" fill="url(#storageGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Capacity</CardTitle>
              <CardDescription>Total platform storage allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used: {(totalUsed / 1000).toFixed(1)} GB</span>
                <span className="font-medium">{usedPercent}% of {totalCapacity / 1000} GB</span>
              </div>
              <Progress value={usedPercent} className={cn('h-3', usedPercent > 85 ? '[&>div]:bg-destructive' : usedPercent > 70 ? '[&>div]:bg-amber-500' : '')} />
              <p className="text-xs text-muted-foreground">
                {((totalCapacity - totalUsed) / 1000).toFixed(1)} GB remaining · At current growth rate, capacity reached in ~{Math.round((totalCapacity - totalUsed) / 200)} days
              </p>
            </CardContent>
          </Card>

          {/* Per-project storage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Per-Project Storage</CardTitle>
                <CardDescription>Usage breakdown by active project</CardDescription>
              </div>
              <Button variant="outline" size="sm">Set Limits</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStorage.map((p) => (
                  <div key={p.project} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <p className="text-sm font-medium">{p.project}</p>
                        <p className="text-xs text-muted-foreground">{p.supervisor} · {p.files} files</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-medium">{p.used}</span>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                    <Progress value={p.percent} className={cn('h-2',
                      p.status === 'critical' && '[&>div]:bg-destructive',
                      p.status === 'warning' && '[&>div]:bg-amber-500',
                    )} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Large Files */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Large Files</CardTitle>
                <CardDescription>Files consuming the most storage space</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export Report
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {largeFiles.map((f) => (
                    <TableRow key={f.name}>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.path}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{f.size}</Badge></TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{f.type}</span></TableCell>
                      <TableCell><span className="text-sm">{f.project}</span></TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{f.age}</span></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Archive</Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
