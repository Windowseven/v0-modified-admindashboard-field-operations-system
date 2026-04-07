'use client'

import { useState } from 'react'
import {
  HardDrive,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  FileText,
  Image,
  Calendar,
  Play,
  Pause,
  MoreVertical,
  Trash2,
  RotateCcw,
  Shield,
} from 'lucide-react'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

// Backup history
const backupHistory = [
  { id: 'bk-001', type: 'Full', status: 'completed', size: '4.2 GB', date: '2024-01-15 02:00', duration: '45 min', storage: 'AWS S3' },
  { id: 'bk-002', type: 'Incremental', status: 'completed', size: '280 MB', date: '2024-01-14 14:00', duration: '8 min', storage: 'AWS S3' },
  { id: 'bk-003', type: 'Incremental', status: 'completed', size: '320 MB', date: '2024-01-14 02:00', duration: '10 min', storage: 'AWS S3' },
  { id: 'bk-004', type: 'Full', status: 'completed', size: '4.1 GB', date: '2024-01-13 02:00', duration: '42 min', storage: 'AWS S3' },
  { id: 'bk-005', type: 'Incremental', status: 'failed', size: '-', date: '2024-01-12 14:00', duration: '-', storage: 'AWS S3' },
  { id: 'bk-006', type: 'Full', status: 'completed', size: '4.0 GB', date: '2024-01-11 02:00', duration: '40 min', storage: 'AWS S3' },
]

// Backup configuration
const backupConfig = {
  autoBackup: true,
  fullBackupSchedule: 'Daily at 2:00 AM',
  incrementalSchedule: 'Every 12 hours',
  retention: '30 days',
  encryptionEnabled: true,
  compressionEnabled: true,
}

// Data breakdown
const dataBreakdown = [
  { type: 'Database', icon: Database, size: '2.8 GB', items: '45 tables' },
  { type: 'User Files', icon: Image, size: '1.2 GB', items: '12,456 files' },
  { type: 'Form Submissions', icon: FileText, size: '180 MB', items: '284,521 records' },
  { type: 'System Logs', icon: FileText, size: '420 MB', items: '2.1M entries' },
]

export default function BackupPage() {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)

  const startBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(0)
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  return (
    <>
      <DashboardHeader title="Backup & Restore" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                Backup & Restore
              </h1>
              <p className="text-muted-foreground">
                Manage data backups and system recovery options
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={startBackup} 
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <HardDrive className="h-4 w-4 mr-2" />
                    Start Backup
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Backup Progress */}
          {isBackingUp && (
            <Card className="border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium">Backup in Progress</p>
                    <p className="text-sm text-muted-foreground">Creating full system backup...</p>
                  </div>
                  <span className="text-lg font-bold">{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Backup</p>
                    <p className="text-lg font-bold">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <HardDrive className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Backups</p>
                    <p className="text-lg font-bold">28.4 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention</p>
                    <p className="text-lg font-bold">30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-lg font-bold">98.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration & Data Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Backup Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Automated backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                    </div>
                  </div>
                  <Switch checked={backupConfig.autoBackup} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Full Backup Schedule</span>
                    <span className="font-medium">{backupConfig.fullBackupSchedule}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incremental Schedule</span>
                    <span className="font-medium">{backupConfig.incrementalSchedule}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Retention Period</span>
                    <span className="font-medium">{backupConfig.retention}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Encryption</p>
                      <p className="text-sm text-muted-foreground">AES-256 encryption</p>
                    </div>
                  </div>
                  <Switch checked={backupConfig.encryptionEnabled} />
                </div>

                <Button variant="outline" className="w-full">
                  Configure Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Data Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Data Breakdown</CardTitle>
                <CardDescription>Storage usage by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataBreakdown.map((item) => (
                  <div key={item.type} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.type}</span>
                        <span className="text-sm font-medium">{item.size}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.items}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Data Size</span>
                    <span className="text-lg font-bold">4.6 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>Recent backup operations</CardDescription>
                </div>
                <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Restore from Backup</DialogTitle>
                      <DialogDescription>
                        Select a backup point to restore your system. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Backup</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a backup point" />
                          </SelectTrigger>
                          <SelectContent>
                            {backupHistory.filter(b => b.status === 'completed').map((backup) => (
                              <SelectItem key={backup.id} value={backup.id}>
                                {backup.date} - {backup.type} ({backup.size})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Restore Options</Label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" defaultChecked />
                            Database
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" defaultChecked />
                            User Files
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            System Configuration
                          </label>
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-500/50 bg-amber-500/5 p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-amber-500">Warning</p>
                            <p className="text-muted-foreground">
                              Restoring will overwrite current data. Make sure to backup current state first.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive">
                        Start Restore
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Backup ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-mono text-sm">{backup.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{backup.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            backup.status === 'completed' && 'bg-emerald-500/10 text-emerald-500',
                            backup.status === 'failed' && 'bg-red-500/10 text-red-500'
                          )}
                        >
                          {backup.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {backup.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{backup.date}</TableCell>
                      <TableCell>{backup.duration}</TableCell>
                      <TableCell>{backup.storage}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
