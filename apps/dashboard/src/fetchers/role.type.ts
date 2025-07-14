import type { User } from './user.type'

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
