



// "use client"

// import type React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Menu, ChevronRight, LayoutDashboard, Users, FileText, Building2, LogOut, UserCircle, Briefcase, CreditCard, Factory, Receipt, Store } from "lucide-react"
// import { logout } from "@/lib/auth"
// import { ThemeToggle } from "@/components/theme-toggle"

// interface NavItemProps {
//   href: string
//   icon: React.ReactNode
//   title: string
//   isCollapsed: boolean
// }

// function NavItem({ href, icon, title, isCollapsed }: NavItemProps) {
//   const pathname = usePathname()
//   const isActive = pathname === href

//   return (
//     <Link
//       href={href}
//       className={cn(
//         "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
//         isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground",
//         isCollapsed && "justify-center",
//       )}
//     >
//       {icon}
//       {!isCollapsed && <span>{title}</span>}
//     </Link>
//   )
// }

// interface DashboardSidebarProps {
//   isOpen: boolean
//   setIsOpen: (open: boolean) => void
// }

// export function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
//   return (
//     <div
//       className={cn(
//         "flex flex-col border-r transition-all duration-300 h-screen bg-background dark:border-slate-700",
//         isOpen ? "w-64" : "w-16",
//         "fixed md:relative z-30", // Make it fixed on mobile, relative on desktop
//       )}
//     >
//       <div className="flex h-16 items-center justify-between border-b px-4 dark:border-slate-700">
//         {isOpen && (
//           <Link href="/dashboard" className="font-bold text-xl text-foreground">
//             iRUSH
//           </Link>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsOpen(!isOpen)}
//           className={cn("ml-auto", !isOpen && "mx-auto")}
//           aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//         >
//           {isOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
//         </Button>
//       </div>
//       <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
//         <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} title="Dashboard" isCollapsed={!isOpen} />
//         <NavItem
//           href="/dashboard/departments"
//           icon={<Building2 size={20} />}
//           title="Departments"
//           isCollapsed={!isOpen}
//         />
//         <NavItem href="/dashboard/rfq" icon={<FileText size={20} />} title="RFQ" isCollapsed={!isOpen} />
//         <NavItem href="/dashboard/employees" icon={<Briefcase size={20} />} title="Employees" isCollapsed={!isOpen} />
//         <NavItem href="/dashboard/customers" icon={<Users size={20} />} title="Customers" isCollapsed={!isOpen} />
//          <NavItem href="/dashboard/users" icon={<UserCircle size={20} />} title="Users" isCollapsed={!isOpen} />
//          <NavItem href="/dashboard/credit-terms" icon={<CreditCard size={20} />} title="Credit Terms" isCollapsed={!isOpen} />
//           <NavItem href="/dashboard/industries" icon={<Factory size={20} />} title="Industries" isCollapsed={!isOpen} />
//           <NavItem href="/dashboard/tax" icon={<Receipt size={20} />} title="Tax" isCollapsed={!isOpen} />
//           <NavItem href="/dashboard/vendors" icon={<Store size={20} />} title="Vendors" isCollapsed={!isOpen} />
//       </div>
//       <div className="border-t p-3 dark:border-slate-700">
//         <div className={cn("flex items-center", isOpen ? "justify-between" : "justify-center")}>
//           <Button
//             variant="ghost"
//             className={cn("flex items-center justify-start gap-3 px-3 py-2", !isOpen && "w-full justify-center p-0")}
//             onClick={logout}
//           >
//             <LogOut size={20} />
//             {isOpen && <span>Logout</span>}
//           </Button>
//           <ThemeToggle />
//         </div>
//       </div>
//     </div>
//   )
// }














"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Menu,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  LogOut,
  UserCircle,
  Briefcase,
  Settings,
  Store,
  CreditCard,
  Factory,
  Receipt,
} from "lucide-react"
import { logout } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminOnly } from "@/components/auth/admin-only"
import { useAuth } from "@/hooks/use-auth"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isCollapsed: boolean
  exact?: boolean
}

function NavItem({ href, icon, title, isCollapsed, exact = false }: NavItemProps) {
  const pathname = usePathname()

  // For exact matches (like Dashboard), only match the exact path
  // For other routes, match if pathname starts with the href
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground",
        isCollapsed && "justify-center",
      )}
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </Link>
  )
}

interface DashboardSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
  const { user, isAdmin, isSalesman } = useAuth()

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-all duration-300 h-screen bg-background dark:border-slate-700",
        isOpen ? "w-64" : "w-16",
        "fixed md:sticky top-0 left-0 z-40",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 dark:border-slate-700">
        {isOpen && (
          <Link href="/dashboard" className="font-bold text-xl text-foreground">
            iRUSH
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn("ml-auto", !isOpen && "mx-auto")}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Dashboard - Available to all authenticated users */}
        <NavItem
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          title="Dashboard"
          isCollapsed={!isOpen}
          exact={true}
        />

        {/* Core Business Items - Available to all authenticated users */}
        <NavItem href="/dashboard/rfq" icon={<FileText size={20} />} title="RFQ" isCollapsed={!isOpen} />
        <NavItem href="/dashboard/customers" icon={<Users size={20} />} title="Customers" isCollapsed={!isOpen} />
        <NavItem href="/dashboard/vendors" icon={<Store size={20} />} title="Vendors" isCollapsed={!isOpen} />

        {/* Configuration Items - Admin Only */}
        <AdminOnly>
          <NavItem
            href="/dashboard/credit-terms"
            icon={<CreditCard size={20} />}
            title="Credit Terms"
            isCollapsed={!isOpen}
          />
          <NavItem href="/dashboard/industries" icon={<Factory size={20} />} title="Industries" isCollapsed={!isOpen} />
          <NavItem href="/dashboard/tax" icon={<Receipt size={20} />} title="Tax" isCollapsed={!isOpen} />
        </AdminOnly>

        {/* System Administration - Admin Only */}
        <AdminOnly>
          <NavItem
            href="/dashboard/departments"
            icon={<Building2 size={20} />}
            title="Departments"
            isCollapsed={!isOpen}
          />
          <NavItem href="/dashboard/users" icon={<UserCircle size={20} />} title="Users" isCollapsed={!isOpen} />
          <NavItem href="/dashboard/employees" icon={<Briefcase size={20} />} title="Employees" isCollapsed={!isOpen} />
        </AdminOnly>

        {/* Settings - Available to all users */}
        <NavItem href="/dashboard/settings" icon={<Settings size={20} />} title="Settings" isCollapsed={!isOpen} />
      </div>
      <div className="border-t p-3 dark:border-slate-700">
        <div className={cn("flex flex-col gap-2", !isOpen && "items-center")}>
          {isOpen && user && (
            <div className="text-xs text-muted-foreground px-3">
              <div className="font-medium">{user.email}</div>
              <div className="flex items-center gap-1">
                <span>Role: {user.role || "User"}</span>
                {isAdmin && <span className="text-green-600">• Admin</span>}
                {isSalesman && <span className="text-blue-600">• Salesman</span>}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className={cn("flex items-center justify-start gap-3 px-3 py-2", !isOpen && "w-full justify-center p-0")}
              onClick={logout}
            >
              <LogOut size={20} />
              {isOpen && <span>Logout</span>}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
