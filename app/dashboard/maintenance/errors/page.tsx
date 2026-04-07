'use client'

import { useState } from 'react'
import {
  Bug,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Copy,
  MoreVertical,
  Eye,
  Archive,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// Error trend data
const errorTrendData = [
  { time: '00:00', errors: 12, warnings: 24 },
  { time: '04:00', errors: 8, warnings: 18 },
  { time: '08:00', errors: 25, warnings: 42 },
  { time: '12:00', errors: 18, warnings: 35 },
  { time: '16:00', errors: 22, warnings: 38 },
  { time: '20:00', errors: 15, warnings: 28 },
]

// Error by category
const errorsByCategory = [
  { category: 'API', count: 42 },
  { category: 'Database', count: 18 },
  { category: 'Auth', count: 12 },
  { category: 'WebSocket', count: 8 },
  { category: 'File Upload', count: 5 },
]

// Error list
const errors = [
  {
    id: 'err-001',
    level: 'critical',
    message: 'Database connection timeout',
    source: 'api/users/[id]',
    count: 24,
    firstSeen: '2 hours ago',
    lastSeen: '5 min ago',
    stack: `Error: Database connection timeout
    at Database.query (/app/lib/db.ts:45:12)
    at UserService.getUser (/app/services/user.ts:23:18)
    at GET (/app/api/users/[id]/route.ts:15:24)`,
    metadata: { userId: '1234', endpoint: '/api/users/1234' },
  },
  {
    id: 'err-002',
    level: 'error',
    message: 'Failed to process form submission',
    source: 'api/forms/submit',
    count: 12,
    firstSeen: '6 hours ago',
    lastSeen: '1 hour ago',
    stack: `Error: Failed to process form submission
    at FormService.submit (/app/services/form.ts:89:10)
    at POST (/app/api/forms/submit/route.ts:32:18)`,
    metadata: { formId: 'form-456', projectId: 'proj-789' },
  },
  {
    id: 'err-003',
    level: 'warning',
    message: 'WebSocket reconnection attempt',
    source: 'lib/websocket',
    count: 156,
    firstSeen: '1 day ago',
    lastSeen: '10 min ago',
    stack: `Warning: WebSocket reconnection attempt
    at WebSocketClient.reconnect (/app/lib/websocket.ts:78:8)`,
    metadata: { attempts: 3, delay: '1000ms' },
  },
  {
    id: 'err-004',
    level: 'error',
    message: 'File upload size exceeded',
    source: 'api/upload',
    count: 8,
    firstSeen: '3 hours ago',
    lastSeen: '45 min ago',
    stack: `Error: File upload size exceeded
    at validateFileSize (/app/lib/upload.ts:23:10)
    at POST (/app/api/upload/route.ts:18:12)`,
    metadata: { maxSize: '10MB', actualSize: '15.2MB' },
  },
  {
    id: 'err-005',
    level: 'info',
    message: 'Rate limit approaching threshold',
    source: 'middleware/rate-limit',
    count: 45,
    firstSeen: '12 hours ago',
    lastSeen: '30 min ago',
    stack: `Info: Rate limit approaching threshold
    at RateLimiter.check (/app/middleware/rate-limit.ts:56:14)`,
    metadata: { currentRate: 850, limit: 1000 },
  },
]

const levelConfig = {
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  error: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
}

export default function ErrorTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['critical', 'error', 'warning', 'info'])
  const [expandedErrors, setExpandedErrors] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedErrors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filteredErrors = errors.filter(
    (error) =>
      selectedLevels.includes(error.level) &&
      (error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.source.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const criticalCount = errors.filter((e) => e.level === 'critical').length
  const errorCount = errors.filter((e) => e.level === 'error').length
  const warningCount = errors.filter((e) => e.level === 'warning').length

  return (
    <>
      <DashboardHeader title="Error Tracking" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-balance">
                Error Tracking
              </h1>
              <p className="text-muted-foreground">
                Monitor and debug system errors in real-time
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className={cn(criticalCount > 0 && 'border-red-500/50')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{criticalCount}</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{errorCount}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{warningCount}</p>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <TrendingDown className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">-18%</p>
                    <p className="text-sm text-muted-foreground">vs Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Error Trend</CardTitle>
                <CardDescription>Errors and warnings over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={errorTrendData}>
                      <defs>
                        <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" fill="url(#errorGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="warnings" stroke="#f59e0b" fill="url(#warnGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
                <CardDescription>Error distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorsByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis type="category" dataKey="category" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Error Log</CardTitle>
                  <CardDescription>All tracked errors and exceptions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search errors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {['critical', 'error', 'warning', 'info'].map((level) => (
                        <DropdownMenuCheckboxItem
                          key={level}
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={(checked) => {
                            setSelectedLevels((prev) =>
                              checked ? [...prev, level] : prev.filter((l) => l !== level)
                            )
                          }}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredErrors.map((error) => {
                  const config = levelConfig[error.level as keyof typeof levelConfig]
                  const Icon = config.icon
                  const isExpanded = expandedErrors.includes(error.id)

                  return (
                    <Collapsible key={error.id} open={isExpanded} onOpenChange={() => toggleExpanded(error.id)}>
                      <div className={cn('rounded-lg border border-border', isExpanded && 'border-primary/50')}>
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-start gap-4 p-4">
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', config.bg)}>
                              <Icon className={cn('h-5 w-5', config.color)} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {error.level}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{error.source}</span>
                              </div>
                              <p className="font-medium">{error.message}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{error.count} occurrences</span>
                                <span>First: {error.firstSeen}</span>
                                <span>Last: {error.lastSeen}</span>
                              </div>
                            </div>
                            <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t border-border p-4 space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-2">Stack Trace</p>
                              <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                                {error.stack}
                              </pre>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Metadata</p>
                              <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                                {JSON.stringify(error.metadata, null, 2)}
                              </pre>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                              <Button variant="outline" size="sm">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </Button>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View in Logs
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
