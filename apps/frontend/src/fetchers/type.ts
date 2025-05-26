export enum EnumRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum EnumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum EnumSex {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export interface TUser {
  uuid: string
  username: string
  roles: EnumRole[]
  status: EnumStatus
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  email: string | null
  sex: EnumSex | null
  age: number | null
}

export interface LoginRequest { username: string, password: string }

export interface LoginResponse {
  data: {
    token: string
  }
}

export interface RegisterRequest { username: string, password: string }

export interface RegisterResponse { message: string }

export interface GetCurrentUserInfoResponse {
  data: {
    user: TUser
  }
}

export interface GetUserListRequest {
  pageNo?: number
  pageSize?: number
}

export interface GetUserListResponse {
  data: {
    list: TUser[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export type UpdateUserRequest = Pick<TUser, 'username' | 'status'>

export interface UpdateUserResponse { message: string }

export type DeleteUserRequest = Pick<TUser, 'username'>

export interface DeleteUserResponse { message: string }
