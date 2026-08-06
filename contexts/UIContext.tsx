"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface UIPreferences {
  sidebarCollapsed: boolean
  filtersVisible: boolean
}

interface UIContextType {
  sidebarCollapsed: boolean
  filtersVisible: boolean
  activeFilterCount: number
  setSidebarCollapsed: (collapsed: boolean) => void
  setFiltersVisible: (visible: boolean) => void
  setActiveFilterCount: (count: number) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIContextProvider({ children, initialSidebarCollapsed = false, initialFiltersVisible = true }: {
  children: ReactNode
  initialSidebarCollapsed?: boolean
  initialFiltersVisible?: boolean
}) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(initialSidebarCollapsed)
  const [filtersVisible, setFiltersVisibleState] = useState<boolean>(initialFiltersVisible)
  const [activeFilterCount, setActiveFilterCountState] = useState<number>(0)

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed)

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/api/user/preferences`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uiPreferences: { sidebarCollapsed: collapsed } }),
    }).catch((error) => {
      console.error("Failed to update sidebar preference:", error)
    })
  }, [])

  const setFiltersVisible = useCallback((visible: boolean) => {
    setFiltersVisibleState(visible)

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/api/user/preferences`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uiPreferences: { filtersVisible: visible } }),
    }).catch((error) => {
      console.error("Failed to update filters preference:", error)
    })
  }, [])

  const setActiveFilterCount = useCallback((count: number) => {
    setActiveFilterCountState(count)
  }, [])

  return (
    <UIContext.Provider value={{ sidebarCollapsed, filtersVisible, activeFilterCount, setSidebarCollapsed, setFiltersVisible, setActiveFilterCount }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUIContext() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUIContext must be used within UIContextProvider')
  }
  return context
}
