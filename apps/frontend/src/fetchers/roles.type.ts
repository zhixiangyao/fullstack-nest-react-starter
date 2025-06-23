import type { User } from './users.type'

export interface Role {
  id: number
  name: string
  users: Omit<User, 'roles'>[]
}

export interface RoleFindAllRequest {
  pageNo?: number
  pageSize?: number
}

export interface RoleFindAllResponse {
  data: {
    list: Role[]
    total: number
    pageNo: number
    pageSize: number
  }
}
