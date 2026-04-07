'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Shield,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Activity,
  Layers,
  UserCog,
  FileSearch,
  Wrench,
  Server,
  Database,
  HardDrive,
  Zap,
  RefreshCw,
  Bug,
  Lock,
  Globe,
  Gauge,
  AlertTriangle,
  History,
  ToggleLeft,
  TestTube,
  Wifi,
  Power,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// System Overview - Big Picture
const overviewNavItems = [
  {
    title: 'System Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    badge: null,
  },
  {
    title: 'Real-Time Activity',
    icon: Activity,
    href: '/dashboard/activity',
    badge: 'Live',
    badgeVariant: 'default' as const,
  },
]

// Global Management - Platform Control
const globalManagementItems = [
  {
    title: 'Global Users',
    icon: Users,
    href: '/dashboard/users',
    subItems: [
      { title: 'All Users', href: '/dashboard/users' },
      { title: 'Supervisors', href: '/dashboard/users/supervisors' },
      { title: 'Team Leaders', href: '/dashboard/users/team-leaders' },
      { title: 'Field Workers', href: '/dashboard/users/workers' },
    ],
  },
  {
    title: 'Projects Overview',
    icon: FolderKanban,
    href: '/dashboard/projects',
    subItems: [
      { title: 'All Projects', href: '/dashboard/projects' },
      { title: 'Active Projects', href: '/dashboard/projects/active' },
      { title: 'Archived', href: '/dashboard/projects/archived' },
    ],
  },
  {
    title: 'Form Templates',
    icon: FileSearch,
    href: '/dashboard/forms',
    subItems: [
      { title: 'Global Templates', href: '/dashboard/forms' },
      { title: 'Template Library', href: '/dashboard/forms/library' },
    ],
  },
]

// Analytics & Insights
const analyticsNavItems = [
  {
    title: 'System Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    title: 'Audit & Logs',
    icon: History,
    href: '/dashboard/audit',
    badge: null,
  },
]

// Security & Monitoring
const securityNavItems = [
  {
    title: 'Security Center',
    icon: Shield,
    href: '/dashboard/security',
    subItems: [
      { title: 'Overview', href: '/dashboard/security' },
      { title: 'Threat Detection', href: '/dashboard/security/threats' },
      { title: 'Session Manager', href: '/dashboard/security/sessions' },
      { title: 'Access Policies', href: '/dashboard/security/policies' },
    ],
  },
  {
    title: 'System Alerts',
    icon: AlertTriangle,
    href: '/dashboard/alerts',
    badge: '5',
    badgeVariant: 'destructive' as const,
  },
]

// System Maintenance - Dedicated Section
const maintenanceNavItems = [
  {
    title: 'System Health',
    icon: Gauge,
    href: '/dashboard/maintenance',
  },
  {
    title: 'Server Status',
    icon: Server,
    href: '/dashboard/maintenance/server',
  },
  {
    title: 'Database',
    icon: Database,
    href: '/dashboard/maintenance/database',
  },
  {
    title: 'Backup & Restore',
    icon: HardDrive,
    href: '/dashboard/maintenance/backup',
  },
  {
    title: 'Error Tracking',
    icon: Bug,
    href: '/dashboard/maintenance/errors',
  },
  {
    title: 'Rate Limiting',
    icon: Zap,
    href: '/dashboard/maintenance/rate-limits',
  },
  {
    title: 'Sync Monitor',
    icon: RefreshCw,
    href: '/dashboard/maintenance/sync',
  },
  {
    title: 'Storage',
    icon: HardDrive,
    href: '/dashboard/maintenance/storage',
  },
  {
    title: 'API Monitor',
    icon: Globe,
    href: '/dashboard/maintenance/api',
  },
  {
    title: 'Feature Flags',
    icon: ToggleLeft,
    href: '/dashboard/maintenance/features',
  },
  {
    title: 'Test Environment',
    icon: TestTube,
    href: '/dashboard/maintenance/sandbox',
  },
]

// System Configuration
const configNavItems = [
  {
    title: 'Notifications',
    icon: Bell,
    href: '/dashboard/notifications',
    badge: '3',
    badgeVariant: 'secondary' as const,
  },
  {
    title: 'Broadcast',
    icon: Wifi,
    href: '/dashboard/broadcast',
  },
  {
    title: 'System Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
  {
    title: 'Emergency Control',
    icon: Power,
    href: '/dashboard/emergency',
    badge: null,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { theme, setTheme } = useTheme()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 items-center justify-center border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Field Sync</span>
              <span className="text-[10px] text-muted-foreground">System Admin</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className={cn(
                            'ml-auto h-5 px-1.5 text-[10px]',
                            item.badgeVariant === 'default' && 'animate-pulse-glow bg-primary'
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Global Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {globalManagementItems.map((item) => (
                <Collapsible key={item.href} asChild defaultOpen={pathname.startsWith(item.href)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href}
                            >
                              <Link href={subItem.href}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Audit</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Security */}
        <SidebarGroup>
          <SidebarGroupLabel>Security</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityNavItems.map((item) => 
                'subItems' in item ? (
                  <Collapsible key={item.href} asChild defaultOpen={pathname.startsWith(item.href)}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant}
                            className="ml-auto h-5 px-1.5 text-[10px]"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* System Maintenance - Dedicated Section */}
        <SidebarGroup>
          <Collapsible defaultOpen={pathname.startsWith('/dashboard/maintenance')}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:text-foreground flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5" />
                System Maintenance
                <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {maintenanceNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="ml-auto h-5 px-1.5 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      SA
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">System Admin</span>
                    <span className="truncate text-xs text-muted-foreground">admin@fieldsync.io</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
