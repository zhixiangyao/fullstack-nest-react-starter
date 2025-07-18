import type { User } from 'database'

export interface ResponseSignIn {
  data: {
    token: string
  }
}

export type JwtSignPayload = Pick<User, 'uuid' | 'username'>
