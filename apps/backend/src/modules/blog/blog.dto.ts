import { IsInt, IsOptional } from 'class-validator'

export class BlogFindAllDto {
  @IsInt()
  @IsOptional()
  readonly pageNo = 1

  @IsInt()
  @IsOptional()
  readonly pageSize = 20
}
