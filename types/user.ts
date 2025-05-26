import { ReactNode } from "react"

// User Types
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
  role?: {
    description: ReactNode
    departmentId: ReactNode
    isActive: any
    createdAt: string | number | Date
    updatedAt: string | number | Date
    deletedAt: any
    createdBy: string
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
}

export interface CreateUserDto {
  name: string
  username: string
  employeeId: string
  email: string
  password: string
  phone: string
  status: string
  roleId: string
  isActive?: boolean
}

export interface UpdateUserDto {
  name?: string
  username?: string
  employeeId?: string
  email?: string
  password?: string
  phone?: string
  status?: string
  roleId?: string
  isActive?: boolean
}
