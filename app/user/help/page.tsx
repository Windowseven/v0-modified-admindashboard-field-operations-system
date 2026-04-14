'use client'

import { useState } from 'react'
import {
  HelpCircle, Users, Calendar, Send, CheckCircle2,
  XCircle, Clock, MessageCircle, Plus,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { mockHelpRequests, type HelpRequestType, type HelpRequestStatus } from '@/lib/mock-user'

const requestTypeConfig: Record<HelpRequestType, { label: string; icon: React.ElementType; color: string; bg: string; desc: string }> = {
  help: { label: 'Request Help', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Need assistance with a task' },
  meeting: { label: 'Request Meeting', icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', desc: 'Meet with a team member' },
  assistance: { label: 'Request Assistance', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Need someone nearby' },
}

const statusConfig: Record<HelpRequestStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  accepted: { label: 'Accepted', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  rejected: { label: 'Declined', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
}

export default function UserHelpPage() {
  const [selectedType, setSelectedType] = useState<HelpRequestType | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!selectedType || !message.trim()) return
    setSent(true)
    setMessage('')
    setSelectedType(null)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <>
      <DashboardHeader
        title="Request Help"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Request Help' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Help & Interaction</h1>
            <p className="text-sm text-muted-foreground">Contact your team leader or request assistance</p>
          </div>

          {/* Sent confirmation */}
          {sent && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Request sent!</p>
                  <p className="text-xs text-muted-foreground">Your team leader will respond shortly.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Request */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                New Request
              </CardTitle>
              <CardDescription>What kind of help do you need?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type selector */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(Object.entries(requestTypeConfig) as [HelpRequestType, typeof requestTypeConfig[HelpRequestType]][]).map(([type, cfg]) => {
                  const Icon = cfg.icon
                  const isSelected = selectedType === type
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(isSelected ? null : type)}
                      className={cn(
                        'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', cfg.bg)}>
                        <Icon className={cn('h-4 w-4', cfg.color)} />
                      </div>
                      <p className={cn('text-xs font-semibold', isSelected && 'text-primary')}>{cfg.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{cfg.desc}</p>
                    </button>
                  )
                })}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Message</Label>
                <Textarea
                  placeholder={
                    selectedType === 'help'
                      ? 'Describe what you need help with...'
                      : selectedType === 'meeting'
                      ? 'What do you want to discuss?'
                      : 'Describe the assistance you need...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleSend}
                disabled={!selectedType || !message.trim()}
                className="w-full gap-2 h-11"
              >
                <Send className="h-4 w-4" />
                Send Request
              </Button>
            </CardContent>
          </Card>

          {/* Request History */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Recent Requests
            </h2>
            {mockHelpRequests.map((req) => {
              const tc = requestTypeConfig[req.type]
              const sc = statusConfig[req.status]
              const StatusIcon = sc.icon
              return (
                <Card key={req.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', tc.bg)}>
                        <tc.icon className={cn('h-4 w-4', tc.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold">{tc.label}</p>
                          <Badge className={cn('text-[10px] px-1.5 border-0 gap-1 shrink-0', sc.bg, sc.color)}>
                            <StatusIcon className="h-3 w-3" /> {sc.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{req.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Sent at {req.sentAt}</p>
                      </div>
                    </div>

                    {req.responseNote && (
                      <div className={cn(
                        'rounded-lg p-3 text-xs border-l-2',
                        req.status === 'accepted'
                          ? 'bg-emerald-500/5 border-emerald-500'
                          : 'bg-muted/50 border-muted-foreground'
                      )}>
                        <p className="font-semibold mb-0.5">{req.responseFrom} replied:</p>
                        <p className="text-muted-foreground">{req.responseNote}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">at {req.responseAt}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </section>

        </div>
      </main>
    </>
  )
}
