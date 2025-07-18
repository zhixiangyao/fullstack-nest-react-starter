import type { Role as _Role } from 'database'
import type { User } from './user.type'

export interface Role extends _Role {
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
