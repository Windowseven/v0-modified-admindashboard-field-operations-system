import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { UserSidebar } from '@/components/user/user-sidebar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

