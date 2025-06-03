export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export type RoleValue = (typeof Role)[keyof typeof Role]

export const Status = {
  Active: 'Active',
  Inactive: 'Inactive',
} as const

type StatusValue = (typeof Status)[keyof typeof Status]

export const Sex = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other',
} as const

type SexValue = (typeof Sex)[keyof typeof Sex]

export interface TUser {
  uuid: string
  username: string
  roles: RoleValue[]
  status: StatusValue
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  email: string | null
  sex: SexValue | null
  age: number | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
  }
}

export interface CreateRequest {
  username: string
  password: string
  email?: string
}

export interface CreateResponse {
  message: string
}

export interface FindRequest {
  username?: string
}

export interface FindResponse {
  data: {
    user: TUser
  }
}

export interface FindAllRequest {
  username?: string
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

export type UpdateRequest = Pick<TUser, 'username'> & Partial<Pick<TUser, 'status' | 'email'>>

export interface UpdateResponse {
  message: string
}

export type RemoveRequest = Pick<TUser, 'username'>

export interface RemoveResponse {
  message: string
}
