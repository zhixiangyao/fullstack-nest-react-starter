import { $Enums } from '@prisma/client'
import type { User } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}

export class UserUpdateDto {
  @IsEnum($Enums.Status)
  @IsNotEmpty()
  readonly status: $Enums.Status

  @IsString()
  @IsNotEmpty()
  readonly username: User['username']
}

export class UserRemoveDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']
}

export class UserFindAllDto {
  @IsNumber()
  @IsOptional()
  readonly pageNo?: number

  @IsNumber()
  @IsOptional()
  readonly pageSize?: number
}
