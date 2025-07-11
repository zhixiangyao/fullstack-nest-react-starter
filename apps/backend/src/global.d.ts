import type { JwtSignPayload } from '~/modules/auth/auth.type'

global {
  namespace NodeJS {
    interface ProcessEnv {
      // from.env file
      DATABASE_URL: string
      AUTH_SECRET: string
      // from `cross-env NODE_ENV=xxx` in package.json
      NODE_ENV: string
    }
  }
}

module 'express' {
  interface Request {
    user: JwtSignPayload & { iat: number, exp: number }
  }
}

export {}
