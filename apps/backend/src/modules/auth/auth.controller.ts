import { Body, Controller, Header, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthSignInDto } from './auth.dto'
import type { ResponseSignIn } from './type'

import { Public } from '~/common/decorators/public.decorator'

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
