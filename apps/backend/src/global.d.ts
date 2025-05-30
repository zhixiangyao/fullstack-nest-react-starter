import type { JwtSignPayload } from '~/modules/auth/type'

type User = JwtSignPayload & { iat: number, exp: number }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // from .env file
      DATABASE_URL: string
      AUTH_SECRET: string
      // from `cross-env NODE_ENV=xxx` in package.json
      NODE_ENV: string
    }
  }

  interface Request {
    user: User
  }
}

declare module 'express' {
  interface Request {
    user: User
  }
}

export {}
