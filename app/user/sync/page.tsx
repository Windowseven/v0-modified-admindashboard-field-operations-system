'use client'

import { useState } from 'react'
import {
  Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle,
  Clock, FileText, MapPin, ClipboardList, RotateCcw,
} from 'lucide-react'
import { DashboardHeader } from '@/components/shared/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { db } from '@/lib/db/syncDatabase'
import { syncService } from '@/lib/api/syncService'
import { useLiveQuery } from 'dexie-react-hooks'

export type SyncStatus = 'synced' | 'pending' | 'failed'

const statusConfig: Record<SyncStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  synced: { label: 'Synced', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  failed: { label: 'Failed', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
}

const typeIcon: Record<string, React.ElementType> = {
  form_submission: FileText,
  location_update: MapPin,
  task_update: ClipboardList,
}

export default function UserSyncPage() {
  const [syncing, setSyncing] = useState(false)
  
  const items = useLiveQuery(() => db.syncQueue.orderBy('timestamp').reverse().toArray()) || []

  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncService.processQueue()
    } finally {
      setTimeout(() => setSyncing(false), 800) // Small delay for visual feedback
    }
  }

  const handleRetry = async (id: string) => {
    await db.syncQueue.update(id, { status: 'pending' })
    handleSync()
  }

  const currentSummary = {
    synced: items.filter((i) => i.status === 'synced').length,
    pending: items.filter((i) => i.status === 'pending').length,
    failed: items.filter((i) => i.status === 'failed').length,
  }

  const allSynced = currentSummary.pending === 0 && currentSummary.failed === 0
  const hasFailed = currentSummary.failed > 0

  return (
    <>
      <DashboardHeader
        title="Sync Status"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Sync Status' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Offline Sync</h1>
            <p className="text-sm text-muted-foreground">Your local data & sync status</p>
          </div>

          {/* Overall status banner */}
          <Card className={cn(
            'border-2',
            allSynced ? 'border-emerald-500/25 bg-emerald-500/5'
            : hasFailed ? 'border-destructive/25 bg-destructive/5'
            : 'border-amber-500/25 bg-amber-500/5'
          )}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {allSynced
                  ? <Wifi className="h-6 w-6 text-emerald-500" />
                  : hasFailed
                  ? <WifiOff className="h-6 w-6 text-destructive" />
                  : <RefreshCw className={cn('h-6 w-6 text-amber-500', syncing && 'animate-spin')} />}
                <div>
                  <p className={cn(
                    'font-bold text-sm',
                    allSynced ? 'text-emerald-700 dark:text-emerald-400'
                    : hasFailed ? 'text-destructive'
                    : 'text-amber-700 dark:text-amber-400'
                  )}>
                    {allSynced ? 'All data synced' : hasFailed ? 'Sync errors detected' : 'Pending sync'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentSummary.synced} synced · {currentSummary.pending} pending · {currentSummary.failed} failed
                  </p>
                </div>
              </div>
              {!allSynced && (
                <Button
                  size="sm"
                  onClick={handleSync}
                  disabled={syncing}
                  className="gap-2 shrink-0"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', syncing && 'animate-spin')} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Synced', value: currentSummary.synced, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Pending', value: currentSummary.pending, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Failed', value: currentSummary.failed, color: 'text-destructive', bg: 'bg-destructive/10' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Item list */}
          <div className="space-y-2">
            {items.map((item) => {
              const sc = statusConfig[item.status]
              const StatusIcon = sc.icon
              const TypeIcon = typeIcon[item.type] || FileText
              return (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 shrink-0">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.label}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                        <span>{item.timestamp}</span>
                        <span>·</span>
                        <span>{item.size}</span>
                        {item.retries > 0 && (
                          <><span>·</span><span className="text-destructive">{item.retries} retries</span></>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn('text-[10px] px-1.5 border-0 gap-1', sc.bg, sc.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {sc.label}
                      </Badge>
                      {item.status === 'failed' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleRetry(item.id!)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Data is stored locally and synced when a connection is available. You can always work offline.
          </p>

        </div>
      </main>
    </>
  )
}

