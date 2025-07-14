import type { User } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
