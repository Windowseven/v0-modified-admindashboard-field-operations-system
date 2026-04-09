'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Map,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Radio,
  ClipboardList,
  UserPlus,
  Shield,
  History,
  Layers,
  UsersRound,
  FolderOpen,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type NavItem = {
  title: string
  icon: React.ElementType
  href: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const projectNavItems: NavItem[] = [
  { title: 'Project Overview', icon: LayoutDashboard, href: '/supervisor' },
  { title: 'Live Map', icon: Radio, href: '/supervisor/map', badge: 'Live', badgeVariant: 'default' },
]

const fieldNavItems: NavItem[] = [
  { title: 'Teams', icon: UsersRound, href: '/supervisor/teams' },
  { title: 'Zones', icon: Layers, href: '/supervisor/zones' },
  { title: 'Forms & Tasks', icon: ClipboardList, href: '/supervisor/forms' },
]

const peopleNavItems: NavItem[] = [
  { title: 'Project Users', icon: Users, href: '/supervisor/users' },
  { title: 'Invitations', icon: UserPlus, href: '/supervisor/invitations', badge: '3', badgeVariant: 'secondary' },
]

const insightNavItems: NavItem[] = [
  { title: 'Analytics', icon: BarChart3, href: '/supervisor/analytics' },
  { title: 'Audit Logs', icon: History, href: '/supervisor/audit' },
]

const configNavItems: NavItem[] = [
  { title: 'Notifications', icon: Bell, href: '/supervisor/notifications', badge: '5', badgeVariant: 'destructive' },
  { title: 'Settings', icon: Settings, href: '/supervisor/settings' },
]

function NavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant ?? 'secondary'} className="ml-auto h-5 px-1.5 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function SupervisorSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { theme, setTheme } = useTheme()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/supervisor" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
            FS
          </div>
          {!isCollapsed && (
            <div className="grid leading-tight">
              <span className="font-semibold text-sm">FieldSync</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Supervisor</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Project context pill */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-b border-sidebar-border">
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
            <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary truncate">Urban Survey — Nairobi</p>
              <p className="text-[10px] text-muted-foreground">Active · 42 members</p>
            </div>
            <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>
        </div>
      )}

      <SidebarContent className="overflow-x-hidden">

        <SidebarGroup>
          <SidebarGroupLabel>Project Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectNavItems.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Field Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fieldNavItems.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>People</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {peopleNavItems.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {insightNavItems.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configNavItems.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src="/placeholder-user.jpg" alt="Supervisor" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">SV</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Jane Supervisor</span>
                    <span className="truncate text-xs text-muted-foreground">supervisor@fieldsync.io</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" side="top" align="start" sideOffset={4}>
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/supervisor/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile & Settings
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
