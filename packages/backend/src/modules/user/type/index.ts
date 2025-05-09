import type { User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'password'>

export interface ResponseRegisterUser {
  message: string
}

export interface ResponseUpdateUser {
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
