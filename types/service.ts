// Service Types
export interface Service {
  id: string
  name: string
  description?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateServiceDto {
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateServiceDto {
  name?: string
  description?: string
  isActive?: boolean
}
