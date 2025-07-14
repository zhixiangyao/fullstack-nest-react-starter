import type { User } from '@prisma/client'
import type { JwtSignPayload } from './auth.type'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

import { UserService } from '~/modules/user/user.service'

interface AuthSignInParams {
  username: User['username']
  password: string
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async login(params: AuthSignInParams) {
    if ((await this.userService.validate(params)) === false) {
      throw new UnauthorizedException('Password error or account error!')
    }

    await this.userService.check(params.username)

    // Login should not change updatedAt.
    // "User" changes will trigger prima to automatically update "updatedAt", so this needs to be done here.
    const { updatedAt } = await this.userService.find(params.username)
    const lastLogin = dayjs().toDate()
    const { uuid, username } = await this.userService.update({ username: params.username, lastLogin, updatedAt })
    const payload: JwtSignPayload = { uuid, username }

    return { token: await this.jwtService.signAsync(payload) }
  }
}
