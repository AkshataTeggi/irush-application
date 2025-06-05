// roles/[id]/assign-permission/page.tsx
"use client";

import { AssignPermissions } from "@/components/roles/permissions/assign-permission";
import { useParams } from "next/navigation";

export default function AssignPermissionPage() {
  const params = useParams();
  const roleId = typeof params.id === "string" ? params.id : "";

  // Just render the component passing the roleId
  return <AssignPermissions roleId={roleId} />;
}

