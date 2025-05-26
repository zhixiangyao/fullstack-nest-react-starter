export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface TUser {
  userId: number
  username: string
  role: Role
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  status: Status
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
