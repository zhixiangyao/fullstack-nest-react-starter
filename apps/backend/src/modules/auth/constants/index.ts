import process from 'node:process'

export const jwtConstants = {
  secret: process.env.AUTH_SECRET,
}
