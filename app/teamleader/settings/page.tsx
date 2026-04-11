import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockTeamMembers } from '@/lib/mock-teamleader'
import { Settings, Bell, User, Globe, Shield, Clock, LogOut } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-xl font-bold text-primary-foreground">TL</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Team Leader Settings</h1>
          <p className="text-muted-foreground">Profile, notifications, and session control</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Team Leader" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="tl@fieldsync.io" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Current Team</Label>
              <Select defaultValue="team-alpha">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team-alpha">Team Alpha</SelectItem>
                  <SelectItem value="team-beta">Team Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-4">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Help Requests</Label>
                <p className="text-xs text-muted-foreground">Get notified when team requests help</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Zone Alerts</Label>
                <p className="text-xs text-muted-foreground">Alert when members leave zones</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Task Updates</Label>
                <p className="text-xs text-muted-foreground">Task completion notifications</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full mt-2">Test Notifications</Button>
          </CardContent>
        </Card>
      </div>

      {/* Session & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Settings
          </CardTitle>
          <CardDescription>Current field session controls</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Session Duration</Label>
              <div className="text-2xl font-bold text-primary">04:23:17</div>
              <p className="text-xs text-muted-foreground mt-1">Active since 09:30 AM</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm">Auto-pause after idle</span>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Privacy Mode</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Tracking</SelectItem>
                  <SelectItem value="reduced">Reduced Location</SelectItem>
                  <SelectItem value="off">Privacy Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Export Session Logs
              </Button>
              <Button variant="destructive" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Team Leader</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You are managing Team Alpha</p>
            <Badge className="mt-2">Primary Leader</Badge>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl">Zone Alpha</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Primary operational zone</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">04h 23m</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Session active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

