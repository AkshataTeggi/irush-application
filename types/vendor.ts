export interface Vendor {
  id: string
  company: string
  phone: string
  email: string
  website: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface CreateVendorDto {
  company: string
  phone: string
  email: string
  website: string
  address: string
}

export interface UpdateVendorDto {
  company?: string
  phone?: string
  email?: string
  website?: string
  address?: string
}
