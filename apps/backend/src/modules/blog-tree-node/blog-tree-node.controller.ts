import type { Request } from 'express'
import type { ResponseFindAll } from './blog-tree-node.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { User } from '~/common/decorators/user.decorator'

import { BlogFindAllDto } from './blog-tree-node.dto'
import { BlogTreeNodeService } from './blog-tree-node.service'

@Controller('blog-tree-node')
export class BlogTreeNodeController {
  constructor(private readonly blogTreeNodeService: BlogTreeNodeService) {}

  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: BlogFindAllDto, @User() user: Request['user']): Promise<ResponseFindAll> {
    const data = await this.blogTreeNodeService.findAll({ ...body, username: user.username })

    return { data }
  }
}
