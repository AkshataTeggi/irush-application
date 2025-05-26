// Customer Types
export interface Salesman {
  id: string
  name: string
}

export interface CreditTerm {
  id: string
  name: string
}

export interface Tax {
  id: string
  name: string
}

export interface IndustryType {
  id: string
  name: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  website?: string
  industry?: string
  userId?: string
  status: string
  salesmanId?: string | null
  creditTermId: string
  taxId: string
  industryId: string
  createdBy?: string | null
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  salesman?: Salesman | null
  creditTerm: CreditTerm
  tax: Tax
  industryType: IndustryType
}

export interface CreateCustomerDto {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  website?: string
  industry?: string
  userId?: string
  creditTermId: string
  taxId: string
  industryId: string
  salesmanId?: string // Only include if not null/undefined
}

export interface UpdateCustomerDto {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  website?: string
  industry?: string
  userId?: string
  creditTermId?: string
  taxId?: string
  industryId?: string
  salesmanId?: string
}

export interface CustomerSearchParams {
  query?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}
