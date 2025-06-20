
export interface Service {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateServiceDto {
  name: string
  description: string
  isActive?: boolean
}

export interface UpdateServiceDto {
  name?: string
  description?: string
  isActive?: boolean
}
