import { Blog } from '@prisma/client'
import { IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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

export class BlogSwitchDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: Blog['id']

  @IsBoolean()
  @IsOptional()
  readonly published?: Blog['published']
}

export class BlogUpdateDto extends BlogCreateDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: Blog['id']
}

export class BlogRemoveDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: Blog['id']
}

export class BlogFindDto {
  @IsInt()
  @IsOptional()
  readonly id?: Blog['id']

  @IsString()
  @IsOptional()
  readonly slug?: Blog['slug']
}

export class BlogFindAllDto {
  @IsString()
  @IsOptional()
  readonly title?: Blog['title']

  @IsBoolean()
  @IsOptional()
  readonly published?: Blog['published']

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags?: Blog['tags']

  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly order?: 'desc' | 'asc'

  @IsString()
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt'])
  readonly field?: keyof Pick<Blog, 'createdAt' | 'updatedAt'>

  @IsInt()
  @IsOptional()
  readonly pageNo? = 1

  @IsInt()
  @IsOptional()
  readonly pageSize? = 20
}
