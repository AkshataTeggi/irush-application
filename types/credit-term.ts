// Credit Term Types
export interface CreditTerm {
  status: string
  id: string
  name: string
  description?: string
  days: number
  isActive: boolean
  createdBy?: string | null
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCreditTermDto {
  name: string
  description?: string
  days: number
  isActive?: boolean
}

export interface UpdateCreditTermDto {
  name?: string
  description?: string
  days?: number
  isActive?: boolean
}

export interface CreditTermSearchParams {
  query?: string
  isActive?: boolean
  page?: number
  limit?: number
}
