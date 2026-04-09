import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SupervisorSidebar } from '@/components/supervisor/supervisor-sidebar'

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SupervisorSidebar />
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
