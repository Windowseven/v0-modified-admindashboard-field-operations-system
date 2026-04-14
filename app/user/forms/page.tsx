'use client'

import Link from 'next/link'
import {
  FileText, Clock, CheckCircle2, Circle, Edit3,
  ChevronRight, MapPin, AlertCircle,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { mockUserForms, type FormStatus } from '@/lib/mock-user'

const statusConfig: Record<FormStatus, { label: string; color: string; bg: string; borderColor: string }> = {
  'not-started': { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted/60', borderColor: '' },
  draft: { label: 'Draft Saved', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  submitted: { label: 'Submitted', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
}

export default function UserFormsPage() {
  const pending = mockUserForms.filter((f) => f.status !== 'submitted')
  const submitted = mockUserForms.filter((f) => f.status === 'submitted')

  return (
    <>
      <DashboardHeader
        title="Forms"
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[{ label: 'Forms' }]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
            <p className="text-sm text-muted-foreground">Collect and submit field data</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'To Do', value: mockUserForms.filter(f => f.status === 'not-started').length, color: 'text-muted-foreground' },
              { label: 'Drafts', value: mockUserForms.filter(f => f.status === 'draft').length, color: 'text-amber-500' },
              { label: 'Submitted', value: submitted.length, color: 'text-emerald-500' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Forms */}
          {pending.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Pending
              </h2>
              {pending.map((form) => {
                const sc = statusConfig[form.status]
                const totalSteps = form.steps.length
                const draftProgress = form.draftStep > 0 && totalSteps > 0
                  ? Math.round((form.draftStep / totalSteps) * 100)
                  : 0
                return (
                  <Card key={form.id} className={cn('transition-shadow hover:shadow-md', sc.borderColor)}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0 mt-0.5', sc.bg)}>
                          <FileText className={cn('h-4 w-4', sc.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-tight">{form.title}</p>
                            <Badge className={cn('text-[10px] px-1.5 border-0 shrink-0', sc.bg, sc.color)}>
                              {sc.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {form.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {form.zone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Due {form.deadline}
                        </span>
                        {totalSteps > 0 && (
                          <span className="flex items-center gap-1">
                            <Circle className="h-3 w-3" /> {totalSteps} step{totalSteps !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {form.status === 'draft' && totalSteps > 0 && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">Step {form.draftStep} of {totalSteps}</span>
                          </div>
                          <Progress value={draftProgress} className="h-1.5" />
                        </div>
                      )}

                      <Button asChild size="sm" className="w-full gap-2 h-9">
                        <Link href={`/user/forms/${form.id}`}>
                          <Edit3 className="h-3.5 w-3.5" />
                          {form.status === 'draft' ? 'Resume Draft' : 'Start Form'}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </section>
          )}

          {/* Submitted Forms */}
          {submitted.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Submitted
              </h2>
              {submitted.map((form) => (
                <Card key={form.id} className="opacity-80">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{form.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted at {form.submittedAt} · {form.zone}
                        </p>
                      </div>
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 shrink-0">
                        Submitted
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

        </div>
      </main>
    </>
  )
}
