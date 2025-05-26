// Department Types
export interface Role {
  id: string
  name: string
  description: string
  departmentId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
}

export interface Department {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  roles: Role[]
}

export interface CreateDepartmentDto {
  name: string
  description: string
  isActive: boolean
}

export interface UpdateDepartmentDto {
  name?: string
  description?: string
  isActive?: boolean
}
