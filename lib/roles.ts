// roles.ts
import { Role } from "@/types/department"
import { CreateRoleDto, AssignPermissionsDto, Permission } from "@/types/role"
import { API_BASE_URL } from "./constants"


export async function fetchRoles(): Promise<Role[]> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles`)
  if (!res.ok) throw new Error("Failed to fetch roles")
  return res.json()
}



export async function fetchRoleById(roleId: string): Promise<Role> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}`)
  if (!res.ok) throw new Error("Failed to fetch role")
  return res.json()
}

export async function createRole(data: CreateRoleDto): Promise<Role> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create role")
  return res.json()
}

export async function deleteRole(roleId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete role")
}

export async function updateRoleDepartment(roleId: string, departmentId: string): Promise<Role> {
  const res = await fetch(`${API_BASE_URL}/authorization/${roleId}/update-department`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departmentId }),
  })
  if (!res.ok) throw new Error("Failed to update department")
  return res.json()
}

export async function removeDepartmentFromRole(roleId: string): Promise<Role> {
  const res = await fetch(`${API_BASE_URL}/authorization/${roleId}/remove-department`, {
    method: "PATCH",
  })
  if (!res.ok) throw new Error("Failed to remove department from role")
  return res.json()
}

export async function assignPermissionsToRole(roleId: string, permissions: AssignPermissionsDto): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(permissions),
  })
  if (!res.ok) throw new Error("Failed to assign permissions to role")
}

export async function getPermissionsForRole(roleId: string): Promise<Permission[]> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}/permissions`)
  if (!res.ok) throw new Error("Failed to fetch permissions for role")
  return res.json()
}

export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}/permissions/${permissionId}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to remove permission from role")
}


export async function updateRole(
  roleId: string,
  data: Partial<Pick<Role, "name" | "description" | "isActive">>
): Promise<Role> {
  const res = await fetch(`${API_BASE_URL}/authorization/roles/${roleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update role")
  return res.json()
}


// Permissions APIs
export async function fetchPermissions(): Promise<Permission[]> {
  const res = await fetch(`${API_BASE_URL}/authorization/permissions`)
  if (!res.ok) throw new Error("Failed to fetch permissions")
  return res.json()
}

export async function createPermission(data: { name: string; description?: string }): Promise<Permission> {
  const res = await fetch(`${API_BASE_URL}/authorization/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create permission")
  return res.json()
}

export async function deletePermission(permissionId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/authorization/permissions/${permissionId}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete permission")
}



