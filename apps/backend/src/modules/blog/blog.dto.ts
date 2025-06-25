import { Blog } from '@prisma/client'
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class BlogCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly title: Blog['title']

  @IsString()
  @IsNotEmpty()
  readonly content: Blog['content']

  @IsString()
  @IsNotEmpty()
  readonly slug: Blog['slug']

  @IsBoolean()
  @IsNotEmpty()
  readonly published: Blog['published']

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly tags: Blog['tags']

  @IsString()
  @IsOptional()
  readonly imageUrl?: Blog['imageUrl']

  @IsString()
  @IsOptional()
  readonly category?: Blog['category']
}

export class UserUpdateDto extends BlogCreateDto {
  @IsInt()
  @IsOptional()
  readonly id: Blog['id']
}

export class BlogFindDto {
  @IsInt()
  @IsOptional()
  readonly id: Blog['id']
}

export class BlogFindAllDto {
  @IsInt()
  @IsOptional()
  readonly pageNo = 1

  @IsInt()
  @IsOptional()
  readonly pageSize = 20
}
