import type { ResponseFindAll } from './blog.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { User } from '~/common/decorators/user.decorator'

import { BlogFindAllDto } from './blog.dto'
import { BlogService } from './blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: BlogFindAllDto, @User() user: Request['user']): Promise<ResponseFindAll> {
    const data = await this.blogService.findAll({ ...body, username: user.username })

    return { data }
  }
}
