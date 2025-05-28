// Industry Types
export interface Industry {
  id: string
  name: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateIndustryDto {
  name: string
  description?: string
  status?: string
}

export interface UpdateIndustryDto {
  name?: string
  description?: string
  status?: string
}

export interface IndustrySearchParams {
  query?: string
  status?: string
  page?: number
  limit?: number
}
