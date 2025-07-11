import type { BlogTreeNode, Prisma, User } from '@prisma/client'
import type { ResponseFindAll } from './blog-tree-node.type'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/modules/prisma/prisma.service'

interface BlogFindAllParams {
  username: User['username']
  id?: BlogTreeNode['id']
}

@Injectable()
export class BlogTreeNodeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: BlogFindAllParams): Promise<ResponseFindAll['data']> {
    const { username, id } = params

    const where: Prisma.BlogTreeNodeWhereInput = {
      id,
      author: { username },
    }

    const list = await this.prisma.blogTreeNode.findMany({
      where,
    })

    const total = await this.prisma.blogTreeNode.count({ where })

    return {
      list,
      total,
    }
  }
}
