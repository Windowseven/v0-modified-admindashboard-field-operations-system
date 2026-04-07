'use client'

import { useState } from 'react'
import {
  ToggleLeft,
  ToggleRight,
  Search,
  Plus,
  Settings,
  Users,
  Globe,
  Beaker,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  History,
} from 'lucide-react'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Feature flags
const featureFlags = [
  {
    id: 'ff-001',
    name: 'new_map_ui',
    displayName: 'New Map Interface',
    description: 'Enable the redesigned map interface with improved zone editing',
    enabled: true,
    environment: 'production',
    rollout: 100,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    createdBy: 'Admin',
  },
  {
    id: 'ff-002',
    name: 'realtime_collaboration',
    displayName: 'Real-time Collaboration',
    description: 'Allow multiple users to edit forms simultaneously',
    enabled: true,
    environment: 'beta',
    rollout: 25,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    createdBy: 'Admin',
  },
  {
    id: 'ff-003',
    name: 'ai_form_suggestions',
    displayName: 'AI Form Suggestions',
    description: 'Use AI to suggest form field types and validations',
    enabled: false,
    environment: 'development',
    rollout: 0,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    createdBy: 'Admin',
  },
  {
    id: 'ff-004',
    name: 'offline_mode_v2',
    displayName: 'Offline Mode V2',
    description: 'Enhanced offline capabilities with better sync conflict resolution',
    enabled: true,
    environment: 'production',
    rollout: 100,
    createdAt: '2023-12-15',
    updatedAt: '2024-01-05',
    createdBy: 'Admin',
  },
  {
    id: 'ff-005',
    name: 'advanced_analytics',
    displayName: 'Advanced Analytics',
    description: 'Enable advanced analytics dashboard with custom reports',
    enabled: true,
    environment: 'beta',
    rollout: 50,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-11',
    createdBy: 'Admin',
  },
  {
    id: 'ff-006',
    name: 'team_chat',
    displayName: 'Team Chat',
    description: 'In-app messaging between team members',
    enabled: false,
    environment: 'development',
    rollout: 0,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    createdBy: 'Admin',
  },
  {
    id: 'ff-007',
    name: 'export_pdf',
    displayName: 'PDF Export',
    description: 'Export form submissions and reports as PDF',
    enabled: true,
    environment: 'production',
    rollout: 100,
    createdAt: '2023-11-20',
    updatedAt: '2023-12-01',
    createdBy: 'Admin',
  },
  {
    id: 'ff-008',
    name: 'geofencing_alerts',
    displayName: 'Geofencing Alerts',
    description: 'Trigger alerts when users enter or exit zones',
    enabled: true,
    environment: 'beta',
    rollout: 75,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-14',
    createdBy: 'Admin',
  },
]

const environmentColors = {
  production: 'bg-emerald-500/10 text-emerald-500',
  beta: 'bg-amber-500/10 text-amber-500',
  development: 'bg-blue-500/10 text-blue-500',
}

export default function FeatureFlagsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [flags, setFlags] = useState(featureFlags)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    )
  }

  const filteredFlags = flags.filter(
    (flag) =>
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const enabledCount = flags.filter((f) => f.enabled).length
  const productionCount = flags.filter((f) => f.environment === 'production').length
  const betaCount = flags.filter((f) => f.environment === 'beta').length

  return (
    <>
      <DashboardHeader title="Feature Flags" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                Feature Flags
              </h1>
              <p className="text-muted-foreground">
                Toggle features dynamically without redeployment
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Feature Flag</DialogTitle>
                  <DialogDescription>
                    Add a new feature flag to control feature rollout
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Flag Name</Label>
                    <Input placeholder="e.g., new_dashboard" />
                    <p className="text-xs text-muted-foreground">Use snake_case for flag names</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input placeholder="e.g., New Dashboard" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what this feature flag controls..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select defaultValue="development">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="beta">Beta</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rollout Percentage</Label>
                    <Input type="number" min="0" max="100" defaultValue="0" />
                    <p className="text-xs text-muted-foreground">Percentage of users who will see this feature</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCreateDialog(false)}>
                    Create Flag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ToggleRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{flags.length}</p>
                    <p className="text-sm text-muted-foreground">Total Flags</p>
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
                    <p className="text-2xl font-bold">{enabledCount}</p>
                    <p className="text-sm text-muted-foreground">Enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Globe className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{productionCount}</p>
                    <p className="text-sm text-muted-foreground">In Production</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Beaker className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{betaCount}</p>
                    <p className="text-sm text-muted-foreground">In Beta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search feature flags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Feature Flags List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlags.map((flag) => (
              <Card key={flag.id} className={cn('relative', flag.enabled && 'border-primary/30')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={environmentColors[flag.environment as keyof typeof environmentColors]}
                      >
                        {flag.environment}
                      </Badge>
                      {flag.rollout > 0 && flag.rollout < 100 && (
                        <Badge variant="outline" className="text-xs">
                          {flag.rollout}% rollout
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      {flag.enabled ? (
                        <ToggleRight className="h-5 w-5 text-primary" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h3 className="font-semibold">{flag.displayName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {flag.description}
                    </p>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                      {flag.name}
                    </code>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Updated {flag.updatedAt}
                    </div>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => toggleFlag(flag.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFlags.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <ToggleLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No feature flags found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? 'Try a different search term' : 'Create your first feature flag to get started'}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flag
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
