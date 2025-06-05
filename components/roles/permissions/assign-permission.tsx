"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  fetchRoleById,
  fetchPermissions,
  getPermissionsForRole,
  assignPermissionsToRole,
} from "@/lib/roles";
import type { Permission } from "@/types/role";

interface AssignPermissionsProps {
  roleId: string;
  onSuccess?: () => void; // Optional callback after successful save
  onCancel?: () => void;  // Optional callback on cancel
}

export function AssignPermissions({ roleId, onSuccess, onCancel }: AssignPermissionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [roleName, setRoleName] = useState("");
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const role = await fetchRoleById(roleId);
        const permissions = await fetchPermissions();
        const assigned = await getPermissionsForRole(roleId);

        setRoleName(role.name);
        setAllPermissions(permissions);
        setSelectedPermissions(assigned.map((p) => p.id));
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [roleId, toast]);

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

 const handleSubmit = async () => {
  try {
    const payload = selectedPermissions
      .filter(id => id) // ensure valid strings only
      .map(id => ({ id }));

    await assignPermissionsToRole(roleId, payload);

    toast({
      title: 'Success',
      description: 'Permissions updated successfully',
    });
    router.push('/dashboard/roles');
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to assign permissions',
      variant: 'destructive',
    });
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Permissions to: {roleName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPermissions.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
              <span>{permission.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => (onCancel ? onCancel() : router.back())} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
