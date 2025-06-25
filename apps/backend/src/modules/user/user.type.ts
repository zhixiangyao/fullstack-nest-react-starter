import type { Role, User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'hashedPassword'>

export interface ResponseCreate {
  message: string
}

export interface ResponseUpdate {
  message: string
}

export interface ResponseRemove {
  message: string
}

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
