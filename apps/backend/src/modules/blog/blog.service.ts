import type { User } from '@prisma/client'
import type { ResponseFindAll } from './blog.type'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/modules/prisma/prisma.service'

import { BlogFindAllDto } from './blog.dto'

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(data: BlogFindAllDto & Pick<User, 'username'>): Promise<ResponseFindAll['data']> {
    const { pageNo = 1, pageSize = 10, username } = data
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const list = await this.prisma.blog.findMany({
      skip,
      take,
      where: {
        author: {
          username,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const total = await this.prisma.blog.count()

    return {
      list,
      total,
      pageNo,
      pageSize,
    }
  }
}
