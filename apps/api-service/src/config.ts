import process from 'node:process'
import { config } from 'dotenv'

config({ path: '../../.env' })

export const isDev = process.env.NODE_ENV === 'dev'

export const AUTH_SECRET = process.env.AUTH_SECRET
