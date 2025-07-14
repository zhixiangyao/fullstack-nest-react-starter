import type { Role, User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'hashedPassword'>

export interface ResponseCreate {
  message: string
}

export interface ResponseSwitch extends ResponseCreate {}

export interface ResponseUpdate extends ResponseCreate {}

export interface ResponseRemove extends ResponseCreate {}

export interface ResponseFind {
  data: {
    user: UserWithoutPassword & { roles: Role[], blogsTotal: number }
  }
}

export interface ResponseFindAll {
  data: {
    list: ResponseFind['data']['user'][]
    total: number
    pageNo: number
    pageSize: number
  }
}
