import type { ResponseCreate, ResponseFindAll } from './blog.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { User } from '~/common/decorators/user.decorator'

import { BlogCreateDto, BlogFindAllDto } from './blog.dto'
import { BlogService } from './blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @Header('content-type', 'application/json')
  async create(@Body() body: BlogCreateDto, @User() user: Request['user']): Promise<ResponseCreate> {
    await this.blogService.create({ ...body, uuid: user.uuid })

    return { message: 'Registration successful!' }
  }

  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: BlogFindAllDto, @User() user: Request['user']): Promise<ResponseFindAll> {
    const data = await this.blogService.findAll({ ...body, username: user.username })

    return { data }
  }
}
