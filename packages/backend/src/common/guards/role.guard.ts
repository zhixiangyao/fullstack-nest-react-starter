import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { IS_ROLE_KEY, Role } from '~/common/decorators/role.decorator'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRole = this.reflector.getAllAndOverride<Parameters<typeof Role>[0]>(IS_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<Request>()
    const payload = request.user

    if (isRole && Array.isArray(isRole) && payload && payload.username) {
      const user = await this.userService.find(payload.username)

      if (!isRole.includes(user.role)) {
        throw new ForbiddenException('您没有权限！')
      }
    }

    return true
  }
}
