


// "use client";

// import { useState, useEffect } from "react";
// import { RoleError } from "@/components/roles/role-error";
// import { fetchRoles, fetchPermissions } from "@/lib/roles";
// import { Role, Permission } from "@/types/role";
// import { RolesHeader } from "@/components/roles/role-header";
// import { RoleLoading } from "@/components/roles/role-loading";
// import { RoleTabs } from "@/components/roles/role-tabs";

// export default function RolePage() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError(null);
//       const [rolesData, permissionsData] = await Promise.all([
//         fetchRoles(),
//         fetchPermissions(),
//       ]);
//       setRoles(rolesData);
//       setPermissions(permissionsData);
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error("Failed to load data"));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   if (loading) {
//     return <RoleLoading />;
//   }

//   if (error) {
//     return <RoleError error={error} onRetry={loadData} />;
//   }

//   return (
//     <div className="space-y-6">
//       <RolesHeader />
//       <RoleTabs roles={roles} permissions={permissions} onRefresh={loadData} />
//     </div>
//   );
// }














"use client";

import { useState, useEffect } from "react";
import { RoleError } from "@/components/roles/role-error";
import { fetchRoles, fetchPermissions } from "@/lib/roles";
import { Role, Permission } from "@/types/role";
import { RoleTabs } from "@/components/roles/role-tabs";
import { RolesHeader } from "@/components/roles/role-header";

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [rolesData, permissionsData] = await Promise.all([
        fetchRoles(),
        fetchPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <RoleError error={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Pass activeTab and onChange handler to header */}
      <RolesHeader activeTab={activeTab} />

      {/* Pass activeTab and setter to tabs */}
      <RoleTabs
        roles={roles}
        permissions={permissions}
        onRefresh={loadData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
