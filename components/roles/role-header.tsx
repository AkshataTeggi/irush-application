// import { Plus } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export function RolesHeader() {
//   return (
//     <div className="flex justify-between items-center">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Roles Management</h1>
//       </div>
//       <Button asChild>
//         <Link href="/dashboard/roles/create">
//           <Plus className="mr-2 h-4 w-4" />
//           Add Roles
//         </Link>
//       </Button>
//     </div>
//   )
// }











"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface RolesHeaderProps {
  activeTab: "roles" | "permissions";
  onRefresh?: () => void;
}

export function RolesHeader({ activeTab, onRefresh }: RolesHeaderProps) {
  const router = useRouter();

  const handleAddClick = () => {
    if (activeTab === "roles") {
      router.push("/dashboard/roles/create");
    } else if (activeTab === "permissions") {
      router.push("/dashboard/permission");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {activeTab === "roles" ? "Roles" : "Permissions"}
      </h1>
      <div className="flex space-x-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "roles" ? "Add Role" : "Add Permission"}
        </Button>
      </div>
    </div>
  );
}
