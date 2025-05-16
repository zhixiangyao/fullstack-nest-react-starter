import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { IS_ROLE_KEY, Role } from '~/common/decorators/role.decorator'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // `getAllAndOverride` retrieves metadata from both the class and the method, with the method's metadata overriding the class's metadata.
    // That is to say, if a method has the @Role(['ADMIN']) decorator, then the @Role('USER') decorator on the class will be overridden.
    const roles = this.reflector.getAllAndOverride<Parameters<typeof Role>[0]>(IS_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<Request>()
    const payload = request.user

    if (Array.isArray(roles) && payload && payload.username) {
      const user = await this.userService.find(payload.username)

      if (!roles.includes(user.role)) {
        throw new ForbiddenException('您没有权限！')
      }
    }

    return true
  }
}
