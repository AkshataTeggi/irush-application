

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { DashboardSidebar } from "@/components/dashboard/sidebar"
// import { Button } from "@/components/ui/button"
// import { Menu } from "lucide-react"
// import { useMediaQuery } from "@/hooks/use-media-query"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)
//   const isDesktop = useMediaQuery("(min-width: 768px)")

//   // Automatically close sidebar on mobile
//   useEffect(() => {
//     if (!isDesktop) {
//       setIsSidebarOpen(false)
//     } else {
//       setIsSidebarOpen(true)
//     }
//   }, [isDesktop])

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

//       <div className="flex-1 flex flex-col overflow-hidden">
        

//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   )
// }



// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { DashboardSidebar } from "@/components/dashboard/sidebar"
// import { Button } from "@/components/ui/button"
// import { Menu } from "lucide-react"
// import { useMediaQuery } from "@/hooks/use-media-query"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)
//   const isDesktop = useMediaQuery("(min-width: 768px)")

//   // Automatically close sidebar on mobile
//   useEffect(() => {
//     if (!isDesktop) {
//       setIsSidebarOpen(false)
//     } else {
//       setIsSidebarOpen(true)
//     }
//   }, [isDesktop])

//   return (
//     <div className="flex h-screen overflow-hidden bg-muted/30 dark:bg-slate-950">
//       <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

//       <div className="flex-1 flex flex-col overflow-hidden">
        

//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   )
// }









"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Automatically close sidebar on mobile
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isDesktop])

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30 dark:bg-slate-950">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
