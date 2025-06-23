import type { JwtSignPayload } from './auth.type'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    if ((await this.userService.validate(username, password)) === false) {
      throw new UnauthorizedException('密码错误或者账号错误')
    }

    await this.userService.check(username)

    // Login should not change updatedAt.
    // "User" changes will trigger prima to automatically update "updatedAt", so this needs to be done here.
    const { updatedAt } = await this.userService.find(username)
    const lastLogin = dayjs().toDate()
    const { uuid } = await this.userService.update(username, { lastLogin, updatedAt })
    const payload: JwtSignPayload = { uuid, username }

    return { token: await this.jwtService.signAsync(payload) }
  }
}
