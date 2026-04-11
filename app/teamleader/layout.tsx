import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TeamLeaderSidebar } from '@/components/teamleader/teamleader-sidebar'

export default function TeamLeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <TeamLeaderSidebar />
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

