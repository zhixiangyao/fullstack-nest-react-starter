import type { ResponseCreate, ResponseFind, ResponseFindAll, ResponseUpdate } from './blog.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { User } from '~/common/decorators/user.decorator'

import { BlogCreateDto, BlogFindAllDto, BlogFindDto, UserUpdateDto } from './blog.dto'
import { BlogService } from './blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @Header('content-type', 'application/json')
  async create(@Body() body: BlogCreateDto, @User() user: Request['user']): Promise<ResponseCreate> {
    await this.blogService.create({ ...body, uuid: user.uuid })

    return { message: 'Create successful!' }
  }

  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() body: UserUpdateDto, @User() user: Request['user']): Promise<ResponseUpdate> {
    await this.blogService.update({ ...body, username: user.username })

    return { message: 'Update successful!' }
  }

  @Post('find')
  @Header('content-type', 'application/json')
  async find(@Body() body: BlogFindDto, @User() user: Request['user']): Promise<ResponseFind> {
    const blog = await this.blogService.find({ ...body, username: user.username })

    return { data: { blog } }
  }

  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: BlogFindAllDto, @User() user: Request['user']): Promise<ResponseFindAll> {
    const data = await this.blogService.findAll({ ...body, username: user.username })

    return { data }
  }
}
