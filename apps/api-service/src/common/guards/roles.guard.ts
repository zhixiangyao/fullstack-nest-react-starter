import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { IS_ROLES_KEY, Roles } from '~/common/decorators/roles.decorator'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // `getAllAndOverride` retrieves metadata from both the class and the method, with the method's metadata overriding the class's metadata.
    // That is to say, if a method has the @Role(['ADMIN']) decorator, then the @Role('USER') decorator on the class will be overridden.
    const roles = this.reflector.getAllAndOverride<Parameters<typeof Roles>[0]>(IS_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<Request>()
    const payload = request.user

    if (Array.isArray(roles) && payload && payload.username) {
      const user = await this.userService.find(payload.username)

      if (!roles.some(role => user.roles.map(role => role.name).includes(role))) {
        throw new ForbiddenException('You don\'t have permission!')
      }
    }

    return true
  }
}
