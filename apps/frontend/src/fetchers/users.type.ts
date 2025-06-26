import type { Role } from './roles.type'

export interface User {
  uuid: string
  username: string
  roles: Omit<Role, 'users'>[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  email: string | null
  blogsTotal: number
}

export interface UserLoginRequest {
  username: User['username']
  password: string
}

export interface UserLoginResponse {
  data: {
    token: string
  }
}

export interface UserCreateRequest extends UserLoginRequest {
  email?: User['email']
}

export interface UserCreateResponse {
  message: string
}

export interface UserSwitchRequest {
  username: User['username']
  isActive: User['isActive']
}

export interface UserSwitchResponse extends UserCreateResponse {}

export interface UserUpdateRequest extends UserSwitchRequest {
  email?: User['email']
}

export interface UserUpdateResponse extends UserCreateResponse {}

export type UserRemoveRequest = Pick<User, 'username'>

export interface UserRemoveResponse extends UserCreateResponse {}

export interface UserFindRequest {
  username?: User['username']
}

export interface UserFindResponse {
  data: {
    user: User
  }
}

export interface UserFindAllRequest {
  username?: User['username']
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
