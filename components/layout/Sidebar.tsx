"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { FileText, FolderTree, Home, PanelLeftClose, PanelLeftOpen, Tag, User } from "lucide-react"
import { useUIContext } from "@/contexts/UIContext"

const TOOLTIP_CLASSES =
  "pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const t = useTranslations("Sidebar")
  const { sidebarCollapsed, setSidebarCollapsed } = useUIContext()

  const navigation = [
    { name: t("prompts"), href: "/prompts", icon: FileText },
    { name: t("categories"), href: "/categories", icon: FolderTree },
    { name: t("tags"), href: "/tags", icon: Tag },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r gradient-sidebar shadow-lg transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-purple-400/20 transition-all duration-300",
          sidebarCollapsed ? "justify-center gap-1 px-1" : "px-6"
        )}
      >
        <Link
          href="/"
          aria-label={t("appName")}
          className={cn("flex items-center gap-2 text-white", sidebarCollapsed && "justify-center")}
        >
          <div className="rounded-lg bg-white/20 p-1.5">
            <Home className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && <span className="text-lg font-bold text-white">{t("appName")}</span>}
        </Link>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
          title={sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
          className={cn(
            "rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            !sidebarCollapsed && "ml-auto"
          )}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <span key={item.name} className={cn("group relative", sidebarCollapsed && "flex justify-center")}>
              <Link
                href={item.href}
                aria-label={sidebarCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                  sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "bg-white/20 text-white shadow-md backdrop-blur-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {!sidebarCollapsed && item.name}
              </Link>
              {sidebarCollapsed && <span className={TOOLTIP_CLASSES}>{item.name}</span>}
            </span>
          )
        })}
      </nav>
      {status === "authenticated" && session?.user && (
        <div className="border-t border-purple-400/20 p-4">
          <span className={cn("group relative", sidebarCollapsed && "flex justify-center")}>
            <Link
              href="/auth/profile"
              aria-label={sidebarCollapsed ? session.user.name ?? undefined : undefined}
              className={cn(
                "flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",
                pathname.startsWith("/auth/profile")
                  ? "bg-white/20 text-white shadow-md backdrop-blur-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <User className="h-5 w-5" />
              {!sidebarCollapsed && <span className="truncate">{session.user.name}</span>}
            </Link>
            {sidebarCollapsed && <span className={TOOLTIP_CLASSES}>{session.user.name}</span>}
          </span>
        </div>
      )}
    </div>
  )
}
