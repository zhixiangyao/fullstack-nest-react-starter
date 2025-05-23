import { Body, Controller, Header, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthSignInDto } from './dto/auth.dto'
import type { ResponseSignIn } from './type'

import { Public } from '~/common/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @Header('Content-Type', 'application/json')
  async signIn(@Body() authSignInDto: AuthSignInDto): Promise<ResponseSignIn> {
    const { token } = await this.authService.signIn(authSignInDto.username, authSignInDto.password)

    return { data: { token } }
  }
}
