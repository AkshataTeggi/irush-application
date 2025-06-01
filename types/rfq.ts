// RFQ Types based on the actual API response structure
export interface RFQFile {
  id: string
  filename: string
  path: string
  storageType: string
  modelType: string
  modelId: string
  version: number
  isActive: boolean
  metadata: any
  originalname: string
  mimetype: string
  size: number
  createdAt: string
  updatedAt: string
}

export interface RFQService {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface RFQSpecification {
  specification: {
    id: string
    name: string
    value: string
  }
}

export interface RFQAssembly {
  id: string
  assemblyId: string
  name: string
  value: string
}

export interface RFQCustomer {
  industryType: any
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  website: string
  status: string
  salesmanId: string | null
  creditTermId: string
  taxId: string
  industryId: string
  createdBy: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface RFQ {
  id: string
  title: string
  description: string
  status: string
  quantity: string
  customerId: string
  createdAt: string
  updatedAt: string
  customer: RFQCustomer
  files: RFQFile[]
  services: RFQService[]
  rfqSpecifications: RFQSpecification[]
  rfqAssembly: RFQAssembly[]
}

export interface CreateRFQDto {
  title: string
  description: string
  status?: string
  quantity: string
  customerId: string
  services?: string[]
  files?: { id: string }[]
}

export interface UpdateRFQDto {
  title?: string
  description?: string
  status?: string
  quantity?: string
  customerId?: string
  services?: string[]
  files?: { id: string }[]
  rfqSpecifications?: {
    specificationId: string
    value: string
  }[]
}

export interface RFQSearchParams {
  status?: string
  customerId?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}

// RFQ Status options based on the JSON response
export const RFQ_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export type RFQStatus = (typeof RFQ_STATUSES)[number]["value"]
