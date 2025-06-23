import type { User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'passwordHash'>

export interface ResponseRegisterUser {
  message: string
}

export interface ResponseUpdate {
  message: string
}

export interface ResponseRemove {
  message: string
}

export interface ResponseGetUser {
  data: {
    user: UserWithoutPassword
  }
}

export interface ResponseFindAll {
  data: {
    list: UserWithoutPassword[]
  }
}
