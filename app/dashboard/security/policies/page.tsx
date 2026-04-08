'use client'

import { useState } from 'react'
import { Lock, Shield, Key, Clock, RefreshCw, CheckCircle2, Save } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function PoliciesPage() {
  const [saved, setSaved] = useState(false)

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: '8',
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
    maxAge: '90',
    historyCount: '5',
  })

  const [sessionPolicy, setSessionPolicy] = useState({
    tokenExpiry: '24',
    refreshExpiry: '7',
    maxDevices: '3',
    forceLogoutOnSuspicion: true,
    requireReauthOnSensitive: true,
  })

  const [rateLimitPolicy, setRateLimitPolicy] = useState({
    loginAttempts: '10',
    otpAttempts: '5',
    lockoutDuration: '15',
    globalApiLimit: '1000',
  })

  const [otherPolicy, setOtherPolicy] = useState({
    emailVerificationRequired: true,
    twoFactorEnabled: false,
    geoRestrictionEnabled: false,
    allowedCountries: 'KE,TZ,UG,RW,GH,NG',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <DashboardHeader title="Access Policies" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Access Policies</h1>
              <p className="text-muted-foreground">Password rules, session management, rate limits, and security settings</p>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Saved
                </Badge>
              )}
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save All Policies
              </Button>
            </div>
          </div>

          <Tabs defaultValue="password">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="password"><Key className="h-3.5 w-3.5 mr-1.5" />Password</TabsTrigger>
              <TabsTrigger value="session"><Clock className="h-3.5 w-3.5 mr-1.5" />Sessions</TabsTrigger>
              <TabsTrigger value="ratelimit"><Shield className="h-3.5 w-3.5 mr-1.5" />Rate Limits</TabsTrigger>
              <TabsTrigger value="other"><Lock className="h-3.5 w-3.5 mr-1.5" />Other</TabsTrigger>
            </TabsList>

            {/* Password Policy */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password Policy</CardTitle>
                  <CardDescription>Rules applied to all user passwords across the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Minimum Length</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" min="6" max="32" value={passwordPolicy.minLength} onChange={(e) => setPasswordPolicy(p => ({ ...p, minLength: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">characters</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password Max Age</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" min="0" max="365" value={passwordPolicy.maxAge} onChange={(e) => setPasswordPolicy(p => ({ ...p, maxAge: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">days (0 = never expires)</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password History</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" min="0" max="24" value={passwordPolicy.historyCount} onChange={(e) => setPasswordPolicy(p => ({ ...p, historyCount: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">previous passwords remembered</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-sm font-medium">Complexity Requirements</p>
                    {[
                      { label: 'Require uppercase letters (A–Z)', key: 'requireUppercase' as const },
                      { label: 'Require numbers (0–9)', key: 'requireNumbers' as const },
                      { label: 'Require symbols (!@#$...)', key: 'requireSymbols' as const },
                    ].map((r) => (
                      <div key={r.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <Label className="cursor-pointer font-normal">{r.label}</Label>
                        <Switch checked={passwordPolicy[r.key]} onCheckedChange={(v) => setPasswordPolicy(p => ({ ...p, [r.key]: v }))} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Session Policy */}
            <TabsContent value="session">
              <Card>
                <CardHeader>
                  <CardTitle>Session & Token Policy</CardTitle>
                  <CardDescription>Control how long sessions last and how many devices users can use</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Access Token Expiry</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={sessionPolicy.tokenExpiry} onChange={(e) => setSessionPolicy(p => ({ ...p, tokenExpiry: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">hours</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Refresh Token Expiry</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={sessionPolicy.refreshExpiry} onChange={(e) => setSessionPolicy(p => ({ ...p, refreshExpiry: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Max Concurrent Devices</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" min="1" max="10" value={sessionPolicy.maxDevices} onChange={(e) => setSessionPolicy(p => ({ ...p, maxDevices: e.target.value }))} className="w-24" />
                        <span className="text-sm text-muted-foreground">per user</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-border">
                    {[
                      { label: 'Force logout on suspicious activity', key: 'forceLogoutOnSuspicion' as const },
                      { label: 'Require re-authentication for sensitive actions', key: 'requireReauthOnSensitive' as const },
                    ].map((r) => (
                      <div key={r.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <Label className="cursor-pointer font-normal">{r.label}</Label>
                        <Switch checked={sessionPolicy[r.key]} onCheckedChange={(v) => setSessionPolicy(p => ({ ...p, [r.key]: v }))} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rate Limit Policy */}
            <TabsContent value="ratelimit">
              <Card>
                <CardHeader>
                  <CardTitle>Rate Limit Policy</CardTitle>
                  <CardDescription>Configure thresholds for API protection and account lockouts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Max Login Attempts', key: 'loginAttempts' as const, suffix: 'before lockout' },
                      { label: 'Max OTP Attempts', key: 'otpAttempts' as const, suffix: 'before block' },
                      { label: 'Lockout Duration', key: 'lockoutDuration' as const, suffix: 'minutes' },
                      { label: 'Global API Limit', key: 'globalApiLimit' as const, suffix: 'req / min' },
                    ].map((r) => (
                      <div key={r.key} className="space-y-1.5">
                        <Label>{r.label}</Label>
                        <div className="flex items-center gap-2">
                          <Input type="number" value={rateLimitPolicy[r.key]} onChange={(e) => setRateLimitPolicy(p => ({ ...p, [r.key]: e.target.value }))} className="w-24" />
                          <span className="text-sm text-muted-foreground">{r.suffix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Policy */}
            <TabsContent value="other">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication & Access Settings</CardTitle>
                  <CardDescription>Additional platform security configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Require email verification on registration', key: 'emailVerificationRequired' as const },
                    { label: 'Enable two-factor authentication (platform-wide)', key: 'twoFactorEnabled' as const },
                    { label: 'Enable geographic restrictions', key: 'geoRestrictionEnabled' as const },
                  ].map((r) => (
                    <div key={r.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <Label className="cursor-pointer font-normal">{r.label}</Label>
                      <Switch checked={otherPolicy[r.key]} onCheckedChange={(v) => setOtherPolicy(p => ({ ...p, [r.key]: v }))} />
                    </div>
                  ))}
                  {otherPolicy.geoRestrictionEnabled && (
                    <div className="space-y-1.5 pl-1">
                      <Label>Allowed Country Codes (comma-separated)</Label>
                      <Input value={otherPolicy.allowedCountries} onChange={(e) => setOtherPolicy(p => ({ ...p, allowedCountries: e.target.value }))} placeholder="e.g. KE,TZ,UG,RW" />
                      <p className="text-xs text-muted-foreground">Users outside these countries will be blocked from logging in</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </>
  )
}
