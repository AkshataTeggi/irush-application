export interface Tax {
  id: string
  name: string
  rate: number
  description?: string
  county?: string
  country?: string
  city?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTaxDto {
  name: string
  rate: number
  description?: string
  county?: string
  country?: string
  city?: string
  isActive: boolean
}

export interface UpdateTaxDto {
  name?: string
  rate?: number
  description?: string
  county?: string
  country?: string
  city?: string
  isActive?: boolean
}

