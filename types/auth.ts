// Authentication Types
export interface LoginDto {
  email: string
  password: string
}

export interface JwtPayload {
  userId: string
  email: string
  sub: string
  roleId: string
  role: string
  exp: number
}

export interface User {
    
  id: string
  email: string
  roleId: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}
