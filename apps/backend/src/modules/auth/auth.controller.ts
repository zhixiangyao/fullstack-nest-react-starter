import type { ResponseSignIn } from './type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { Public } from '~/common/decorators/public.decorator'
import { AuthSignInDto } from './auth.dto'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @Header('Content-Type', 'application/json')
  async signIn(@Body() body: AuthSignInDto): Promise<ResponseSignIn> {
    const { token } = await this.authService.signIn(body.username, body.password)

    return { data: { token } }
  }
}
