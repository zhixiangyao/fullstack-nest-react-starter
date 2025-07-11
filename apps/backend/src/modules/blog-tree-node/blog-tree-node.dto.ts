import { BlogTreeNode } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class BlogFindAllDto {
  @IsString()
  @IsOptional()
  readonly id?: BlogTreeNode['id']
}
