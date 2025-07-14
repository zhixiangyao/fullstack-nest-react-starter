import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator((data: keyof Request['user'], ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const user = request.user ?? {}

  return data ? user[data] : user
})
