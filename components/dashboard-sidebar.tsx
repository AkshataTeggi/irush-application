"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  TicketCheck,
  Users,
  FileSpreadsheet,
  UserRound,
  FileQuestionIcon as FileQuote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUser, logout } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    href: "/dashboard/tickets",
    icon: TicketCheck,
  },
  {
    title: "Departments",
    href: "/dashboard/departments",
    icon: Building,
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: ShieldCheck,
  },
  {
    title: "RFQ",
    href: "/dashboard/rfq",
    icon: FileSpreadsheet,
  },
  {
    title: "Customer",
    href: "/dashboard/customer",
    icon: UserRound,
  },
  {
    title: "Quote",
    href: "/dashboard/quote",
    icon: FileQuote,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
]

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser({
        email: userData.email,
        role: userData.role || "User",
      })
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email
      .split("@")[0]
      .split(".")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2)
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b py-4">
          <div className="flex items-center px-2">
            <div className="flex items-center gap-2 font-semibold text-xl">
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground">
                iR
              </div>
              <span>iRUSH</span>
            </div>
            <div className="ml-auto md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <div className="mt-auto">
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          {user && (
            <div className="flex items-center gap-2 p-2">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user.email}</span>
                <span className="text-xs text-muted-foreground truncate">{user.role}</span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
