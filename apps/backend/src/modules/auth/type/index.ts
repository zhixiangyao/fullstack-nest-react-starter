import type { User } from '@prisma/client'

export interface ResponseSignIn {
  data: {
    token: string
  }
}

export type Payload = Pick<User, 'userId' | 'username'>
