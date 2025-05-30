import type { Payload } from './type'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    if ((await this.userService.validate(username, password)) === false) {
      throw new UnauthorizedException()
    }

    await this.userService.check(username)

    const { uuid } = await this.userService.update(username, { lastLogin: dayjs().toDate() })

    const payload: Payload = { uuid, username }

    return { token: await this.jwtService.signAsync(payload) }
  }
}
