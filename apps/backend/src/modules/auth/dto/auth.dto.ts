import { IsNotEmpty, IsString } from 'class-validator'

export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
