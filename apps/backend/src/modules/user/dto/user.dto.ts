import { $Enums } from '@prisma/client'
import type { User } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['email']

  @IsString()
  @IsNotEmpty()
  readonly password: User['password']
}

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsEnum($Enums.Status)
  @IsOptional()
  readonly status?: User['status']

  @IsString()
  @IsOptional()
  readonly email?: User['email']
}

export class UserRemoveDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']
}

export class UserFindDto {
  @IsString()
  @IsOptional()
  readonly username?: User['username']
}

export class UserFindAllDto {
  @IsNumber()
  @IsOptional()
  readonly pageNo?: number

  @IsNumber()
  @IsOptional()
  readonly pageSize?: number
}
