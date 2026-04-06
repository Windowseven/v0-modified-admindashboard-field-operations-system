'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Users,
  MapPin,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Shield,
  Radio,
  UserCog,
  Layers,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Activity,
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

const mainNavItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    badge: null,
  },
  {
    title: 'Live Tracking',
    icon: Radio,
    href: '/dashboard/tracking',
    badge: 'Live',
    badgeVariant: 'default' as const,
  },
  {
    title: 'Map & Zones',
    icon: Map,
    href: '/dashboard/map',
    badge: null,
  },
]

const managementNavItems = [
  {
    title: 'Team Management',
    icon: Users,
    href: '/dashboard/teams',
    subItems: [
      { title: 'All Teams', href: '/dashboard/teams' },
      { title: 'Team Leaders', href: '/dashboard/teams/leaders' },
      { title: 'Members', href: '/dashboard/teams/members' },
    ],
  },
  {
    title: 'Zone Management',
    icon: MapPin,
    href: '/dashboard/zones',
    subItems: [
      { title: 'All Zones', href: '/dashboard/zones' },
      { title: 'Assignments', href: '/dashboard/zones/assignments' },
      { title: 'Boundaries', href: '/dashboard/zones/boundaries' },
    ],
  },
  {
    title: 'Forms & Tasks',
    icon: FileText,
    href: '/dashboard/forms',
    subItems: [
      { title: 'Form Builder', href: '/dashboard/forms/builder' },
      { title: 'Templates', href: '/dashboard/forms/templates' },
      { title: 'Submissions', href: '/dashboard/forms/submissions' },
    ],
  },
]

const analyticsNavItems = [
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    title: 'Activity Log',
    icon: Activity,
    href: '/dashboard/activity',
  },
]

const systemNavItems = [
  {
    title: 'User Management',
    icon: UserCog,
    href: '/dashboard/users',
  },
  {
    title: 'Roles & Permissions',
    icon: Shield,
    href: '/dashboard/roles',
  },
  {
    title: 'Notifications',
    icon: Bell,
    href: '/dashboard/notifications',
    badge: '3',
    badgeVariant: 'destructive' as const,
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
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
              <span className="text-[10px] text-muted-foreground">Mission Control</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
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

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
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
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
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

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
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
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
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
                    Settings
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
