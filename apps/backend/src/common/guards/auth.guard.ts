import process from 'node:process'
import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { IS_PUBLIC_KEY, Public } from '~/common/decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<Parameters<typeof Public>[0]>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.#extractTokenFromHeader(request)

    if (isPublic && !token) {
      // 💡 See this condition
      return true
    }

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload: Request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.AUTH_SECRET,
      })
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload
    }
    catch {
      throw new UnauthorizedException()
    }
    return true
  }

  #extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
