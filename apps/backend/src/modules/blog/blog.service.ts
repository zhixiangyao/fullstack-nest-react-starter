import type { Blog, User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll } from './blog.type'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/modules/prisma/prisma.service'

interface BlogCreateParams {
  uuid: User['uuid']
  title: Blog['title']
  content: Blog['content']
  slug: Blog['slug']
  published: Blog['published']
  tags: Blog['tags']
  imageUrl?: Blog['imageUrl']
  category?: Blog['category']
}

interface BlogUpdateParams {
  username: User['username']
  id: Blog['id']
  title?: Blog['title']
  content?: Blog['content']
  slug?: Blog['slug']
  published?: Blog['published']
  tags?: Blog['tags']
  imageUrl?: Blog['imageUrl']
  category?: Blog['category']
}

interface BlogFindParams {
  username: User['username']
  id: Blog['id']
}

interface BlogFindAllParams {
  username: User['username']
  published?: Blog['published']
  pageNo?: number
  pageSize?: number
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: BlogCreateParams): Promise<Blog> {
    const blog = await this.prisma.blog.create({
      data: {
        title: params.title,
        content: params.content,
        slug: params.slug,
        authorUuid: params.uuid,
        published: params.published,
        tags: params.tags,
        imageUrl: params.imageUrl,
        category: params.category,
      },
    })

    return blog
  }

  async update(params: BlogUpdateParams): Promise<Blog> {
    const blog = await this.prisma.blog.update({
      where: {
        author: {
          username: params.username,
        },
        id: params.id,
      },
      data: {
        title: params.title,
        content: params.content,
        slug: params.slug,
        published: params.published,
        tags: params.tags,
        imageUrl: params.imageUrl,
        category: params.category,
      },
    })

    return blog
  }

  async find(params: BlogFindParams): Promise<ResponseFind['data']['blog']> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        author: {
          username: params.username,
        },
        id: params.id,
      },
    })

    return blog
  }

  async findAll(params: BlogFindAllParams): Promise<ResponseFindAll['data']> {
    const { pageNo = 1, pageSize = 10, username, published } = params
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const list = await this.prisma.blog.findMany({
      skip,
      take,
      where: {
        published,
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
