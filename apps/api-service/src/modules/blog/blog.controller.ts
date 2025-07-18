import type { Request } from 'express'
import type {
  ResponseCreate,
  ResponseFind,
  ResponseFindAll,
  ResponseFindAllTags,
  ResponseRemove,
  ResponseSwitch,
  ResponseUpdate,
} from './blog.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { Public } from '~/common/decorators/public.decorator'
import { User } from '~/common/decorators/user.decorator'

import { BlogCreateDto, BlogFindAllDto, BlogFindDto, BlogRemoveDto, BlogSwitchDto, BlogUpdateDto } from './blog.dto'
import { BlogService } from './blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @Header('content-type', 'application/json')
  async create(@Body() body: BlogCreateDto, @User() user: Request['user']): Promise<ResponseCreate> {
    const uuid = user.uuid
    await this.blogService.create({ ...body, uuid })

    return { message: 'Create successful!' }
  }

  @Post('switch')
  @Header('content-type', 'application/json')
  async switch(@Body() body: BlogSwitchDto, @User() user: Request['user']): Promise<ResponseSwitch> {
    const uuid = user.uuid
    await this.blogService.update({ ...body, uuid })

    return { message: 'Update successful!' }
  }

  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() body: BlogUpdateDto, @User() user: Request['user']): Promise<ResponseUpdate> {
    const uuid = user.uuid
    await this.blogService.update({ ...body, uuid })

    return { message: 'Update successful!' }
  }

  @Post('remove')
  @Header('content-type', 'application/json')
  async remove(@Body() body: BlogRemoveDto, @User('uuid') uuid: string): Promise<ResponseRemove> {
    await this.blogService.remove({ ...body, uuid })

    return { message: 'Remove successful!' }
  }

  @Public()
  @Post('find')
  @Header('content-type', 'application/json')
  async find(@Body() body: BlogFindDto, @User() user: Request['user']): Promise<ResponseFind> {
    const uuid = user.uuid
    const blog = await this.blogService.find({ ...body, uuid })

    return { data: { blog } }
  }

  @Public()
  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: BlogFindAllDto, @User() user: Request['user']): Promise<ResponseFindAll> {
    const uuid = body.uuid ?? user.uuid
    const data = await this.blogService.findAll({ ...body, uuid })

    return { data }
  }

  @Public()
  @Post('find-all-tags')
  @Header('Content-Type', 'application/json')
  async findAllTags(@User() user: Request['user']): Promise<ResponseFindAllTags> {
    const uuid = user.uuid
    const data = await this.blogService.findAllTags({ uuid })

    return { data }
  }
}
