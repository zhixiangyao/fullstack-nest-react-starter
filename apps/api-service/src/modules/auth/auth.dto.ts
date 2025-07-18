import type { User } from 'database'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
