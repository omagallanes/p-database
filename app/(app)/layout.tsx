import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Topbar } from "@/components/layout/Topbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { UIContextProvider } from "@/contexts/UIContext"
import { parseUIPreferences } from "@/lib/ui-preferences"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  let uiPreferences = { sidebarCollapsed: false, filtersVisible: true }
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { uiPreferences: true },
    })
    uiPreferences = parseUIPreferences(user?.uiPreferences)
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <UIContextProvider initialSidebarCollapsed={uiPreferences.sidebarCollapsed} initialFiltersVisible={uiPreferences.filtersVisible}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </UIContextProvider>
    </div>
  )
}
