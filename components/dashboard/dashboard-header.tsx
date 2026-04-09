'use client'

import * as React from 'react'
import { Bell, Search, Command, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { NotificationsPanel } from './notifications-panel'

interface DashboardHeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  rootCrumb?: { label: string; href: string }
}

const notifications = [
  {
    id: 1,
    title: 'Team Alpha needs assistance',
    description: 'Help request from Zone B',
    time: '2 min ago',
    type: 'alert',
    unread: true,
  },
  {
    id: 2,
    title: 'Form submission completed',
    description: '15 new entries from Team Beta',
    time: '15 min ago',
    type: 'success',
    unread: true,
  },
  {
    id: 3,
    title: 'Zone overlap detected',
    description: 'Teams Alpha and Gamma in same area',
    time: '1 hour ago',
    type: 'warning',
    unread: true,
  },
  {
    id: 4,
    title: 'User went offline',
    description: 'John Doe disconnected from Zone A',
    time: '2 hours ago',
    type: 'info',
    unread: false,
  },
]

export function DashboardHeader({
  title,
  breadcrumbs = [],
  rootCrumb = { label: 'Dashboard', href: '/dashboard' },
}: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const unreadCount = notifications.filter((n) => n.unread).length

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Breadcrumbs */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={rootCrumb.href}>{rootCrumb.label}</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title - Mobile */}
      <h1 className="text-lg font-semibold md:hidden">{title}</h1>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <Button
          variant="outline"
          size="sm"
          className="hidden h-9 w-64 justify-start text-muted-foreground md:flex"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Quick Action */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Action</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New Team</DropdownMenuItem>
            <DropdownMenuItem>New Zone</DropdownMenuItem>
            <DropdownMenuItem>New Form</DropdownMenuItem>
            <DropdownMenuItem>Assign Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Panel */}
        <NotificationsPanel />
      </div>
    </header>
  )
}
