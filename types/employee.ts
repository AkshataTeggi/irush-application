// Employee Types
export interface User {
  id: string
  name: string
  username: string
  employeeId: string
  email: string
  password?: string
  phone: string
  status: string
  refreshToken?: string | null
  createdAt: string
  updatedAt: string
  roleId: string
}

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

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  roleId: string
  role?: Role
  user?: User | null
}

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  roleId: string
  createdBy?: string | null
}

export interface UpdateEmployeeDto {
  firstName?: string
  lastName?: string
  email?: string
  isActive?: boolean
  roleId?: string
  updatedBy?: string | null
}
