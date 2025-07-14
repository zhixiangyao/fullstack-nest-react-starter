import type { User } from '@prisma/client'

export interface ResponseSignIn {
  data: {
    token: string
  }
}

export type JwtSignPayload = Pick<User, 'uuid' | 'username'>
