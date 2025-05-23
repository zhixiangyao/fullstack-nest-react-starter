import type { Payload } from '~/modules/auth/type'

declare global {
  namespace NodeJS {
    // from .env file
    interface ProcessEnv {
      DATABASE_URL: string
      AUTH_SECRET: string
      NODE_ENV: string // from `cross-env NODE_ENV=xxx` in package.json
    }
  }

  interface Request {
    user: Payload & { iat: number, exp: number }
  }
}

declare module 'express' {
  interface Request {
    user: Payload & { iat: number, exp: number }
  }
}

export {}
