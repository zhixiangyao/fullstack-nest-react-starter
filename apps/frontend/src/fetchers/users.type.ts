import type { Role } from './roles.type'

export interface User {
  uuid: string
  username: string
  roles: Omit<Role, 'users'>[]
  enable: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  email: string | null
}

export interface UserLoginRequest {
  username: string
  password: string
}

export interface UserLoginResponse {
  data: {
    token: string
  }
}

export interface UserCreateRequest {
  username: string
  password: string
  email?: string
}

export interface UserCreateResponse {
  message: string
}

export interface UserFindRequest {
  username?: string
}

export interface UserFindResponse {
  data: {
    user: User
  }
}

export interface UserFindAllRequest {
  username?: string
  pageNo?: number
  pageSize?: number
}

export interface UserFindAllResponse {
  data: {
    list: User[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export type UserUpdateRequest = Pick<User, 'username'> & Partial<Pick<User, 'enable' | 'email'>>

export interface UserUpdateResponse {
  message: string
}

export type UserRemoveRequest = Pick<User, 'username'>

export interface UserRemoveResponse {
  message: string
}
