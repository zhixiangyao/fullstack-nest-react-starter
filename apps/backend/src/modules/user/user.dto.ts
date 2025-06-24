import type { User } from '@prisma/client'
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['email']

  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsOptional()
  readonly email?: User['email']
}

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  readonly username: User['username']

  @IsBoolean()
  @IsOptional()
  readonly isActive?: User['isActive']

  @IsString()
  @IsOptional()
  readonly email?: User['email']

  @IsDate()
  @IsOptional()
  readonly lastLogin?: User['lastLogin']

  @IsDate()
  @IsOptional()
  readonly updatedAt?: User['updatedAt']
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
  @IsString()
  @IsOptional()
  readonly username?: User['username']

  @IsInt()
  @IsOptional()
  readonly pageNo = 1

  @IsInt()
  @IsOptional()
  readonly pageSize = 20
}
