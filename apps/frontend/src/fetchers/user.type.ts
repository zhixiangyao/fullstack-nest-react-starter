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

export interface CreateRequest { username: string, password: string }

export interface CreateResponse { message: string }

export interface GetCurrentUserInfoResponse {
  data: {
    user: TUser
  }
}

export interface FindAllRequest {
  pageNo?: number
  pageSize?: number
}

export interface FindAllResponse {
  data: {
    list: TUser[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export type UpdateRequest = Pick<TUser, 'username' | 'status'>

export interface UpdateResponse { message: string }

export type RemoveRequest = Pick<TUser, 'username'>

export interface RemoveResponse { message: string }
