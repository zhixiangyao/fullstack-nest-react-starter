import type { Role, User } from '@prisma/client'

export interface ResponseFindAll {
  data: {
    list: (Role & { users: Omit<User, 'hashedPassword'>[] })[]
    total: number
    pageNo: number
    pageSize: number
  }
}
