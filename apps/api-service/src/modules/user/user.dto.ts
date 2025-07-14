import type { User } from '@prisma/client'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsOptional()
  readonly email?: User['email']
}

export class UserSwitchDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsBoolean()
  @IsOptional()
  readonly isActive?: User['isActive']
}

export class UserUpdateDto extends UserSwitchDto {
  @IsString()
  @IsOptional()
  readonly email?: User['email']

  @IsString()
  @IsOptional()
  readonly avatar?: User['avatar']
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

export class UserFindAllDto extends UserFindDto {
  @IsInt()
  @IsOptional()
  readonly pageNo? = 1

  @IsInt()
  @IsOptional()
  readonly pageSize? = 20
}
