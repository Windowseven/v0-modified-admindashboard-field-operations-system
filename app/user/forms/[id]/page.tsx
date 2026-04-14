'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, FileText,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getFormById } from '@/lib/mock-user'

export default function FormDetailPage() {
  const params = useParams()
  const formId = params.id as string
  const form = getFormById(formId)

  const [currentStep, setCurrentStep] = useState(form?.draftStep || 0)
  const [formData, setFormData] = useState<Record<string, any>>({})

  if (!form) {
    return (
      <>
        <DashboardHeader
          title="Form Not Found"
          rootCrumb={{ label: 'Field', href: '/user/home' }}
          breadcrumbs={[{ label: 'Forms', href: '/user/forms' }, { label: 'Not Found' }]}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h2 className="text-lg font-semibold">Form Not Found</h2>
                <p className="text-sm text-muted-foreground mt-2">The form you're looking for doesn't exist.</p>
                <Button asChild className="mt-4">
                  <Link href="/user/forms">Back to Forms</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

  const currentStepData = form.steps[currentStep]
  const progressPercent = ((currentStep + 1) / form.steps.length) * 100

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleNext = () => {
    if (currentStep < form.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Submit form logic here
    console.log('Submitting form:', formData)
  }

  return (
    <>
      <DashboardHeader
        title={form.title}
        rootCrumb={{ label: 'Field', href: '/user/home' }}
        breadcrumbs={[
          { label: 'Forms', href: '/user/forms' },
          { label: form.title },
        ]}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Form Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant={form.status === 'submitted' ? 'default' : form.status === 'draft' ? 'secondary' : 'outline'}>
                {form.status === 'submitted' ? 'Submitted' : form.status === 'draft' ? 'Draft' : 'Not Started'}
              </Badge>
              {form.deadline && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Due {form.deadline}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step {currentStep + 1} of {form.steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Current Step */}
          {currentStepData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStepData.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </label>

                    {field.type === 'text' && (
                      <Input
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === 'number' && (
                      <Input
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <Textarea
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        rows={4}
                      />
                    )}

                    {field.type === 'dropdown' && (
                      <Select value={formData[field.id] || ''} onValueChange={(v) => handleFieldChange(field.id, v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === 'radio' && (
                      <div className="space-y-2">
                        {field.options?.map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={field.id}
                              value={option}
                              checked={formData[field.id] === option}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {field.type === 'checkbox' && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[field.id] || false}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex gap-3">
              {currentStep === form.steps.length - 1 ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/user/forms">Cancel</Link>
                  </Button>
                  <Button onClick={handleSubmit} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Submit Form
                  </Button>
                </>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Form Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
              <p><strong>Assigned by:</strong> {form.assignedBy}</p>
              {form.linkedTask && <p><strong>Linked to task:</strong> {form.linkedTask}</p>}
              <p><strong>Zone:</strong> {form.zone}</p>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}