import { CreatePermissionForm } from "@/components/roles/permissions/create-permission";
import { PermissionHeader } from "@/components/roles/permissions/permission-header";

export default function CreatePermissionPage() {
  return (
    <div className="p-6">
      <PermissionHeader/>
      <CreatePermissionForm />
    </div>
  );
}
