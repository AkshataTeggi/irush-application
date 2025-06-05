
export type Role = {
  permissions: any
  id: string
  name: string
  description: string | null
  departmentId: string | null
  departmentName?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
}


export type CreateRoleDto = {
  name: string
  departmentId?: string
  description?: string
}

export type AssignPermissionsDto = {
  id: string
}[]




export interface Permission {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
