import type { Blog, User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll } from './blog.type'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/modules/prisma/prisma.service'

type CreateParams = Pick<Blog, 'title' | 'content' | 'slug' | 'published' | 'tags'>
  & Partial<Pick<Blog, 'imageUrl' | 'category'>>
  & Pick<User, 'uuid'>

type FindAllParams = {
  pageNo?: number
  pageSize?: number
} & Pick<Blog, 'published'> & Pick<User, 'username'>

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateParams): Promise<Blog> {
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

  async update(params: Partial<Omit<CreateParams, 'uuid'>> & Pick<Blog, 'id'> & Pick<User, 'username'>): Promise<Blog> {
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

  async find(params: Pick<Blog, 'id'> & Pick<User, 'username'>): Promise<ResponseFind['data']['blog']> {
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

  async findAll(params: FindAllParams): Promise<ResponseFindAll['data']> {
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
