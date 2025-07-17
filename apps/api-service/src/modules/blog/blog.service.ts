import type { Blog, Prisma, User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll, ResponseFindAllTags } from './blog.type'
import { Injectable } from '@nestjs/common'

import { deleteProperty } from 'utils'
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
  uuid: User['uuid']
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
  uuid?: User['uuid']
  id?: Blog['id']
  slug?: Blog['slug']
}

interface BlogFindAllParams {
  uuid?: User['uuid']
  title?: Blog['title']
  published?: Blog['published']
  tags?: Blog['tags']
  order?: 'desc' | 'asc'
  field?: keyof Pick<Blog, 'createdAt' | 'updatedAt'>
  pageNo?: number
  pageSize?: number
}

interface BlogFindAllTagsParams {
  uuid?: User['uuid']
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
        author: { uuid: params.uuid },
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

  async remove(params: { id: Blog['id'], uuid: User['uuid'] }): Promise<void> {
    await this.prisma.blog.delete({ where: { id: params.id, author: { uuid: params.uuid } } })
  }

  async find(params: BlogFindParams): Promise<ResponseFind['data']['blog']> {
    const _blog = await this.prisma.blog.findUnique({
      where: {
        author: { uuid: params.uuid },
        id: params.id,
        slug: params.slug,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    })

    const authorName = _blog.author.username
    const blogWithoutAuthor = deleteProperty(_blog, 'author')

    return { ...blogWithoutAuthor, authorName }
  }

  async findAll(params: BlogFindAllParams): Promise<ResponseFindAll['data']> {
    const { title, published, tags, order, field } = params
    const { pageNo = 1, pageSize = 10 } = params
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const where: Prisma.BlogWhereInput = {
      title: { contains: title },
      published,
      tags: tags ? { hasSome: tags } : void 0,
      author: { uuid: params.uuid },
    }
    let orderBy: Partial<Record<BlogFindAllParams['field'], BlogFindAllParams['order']>> = { createdAt: 'desc' }

    if (order && field) {
      orderBy = { [field]: order }
    }

    const list = await this.prisma.blog.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    })

    const total = await this.prisma.blog.count({ where })

    return {
      list: list.map((_blog) => {
        const authorName = _blog.author.username
        const blogWithoutAuthor = deleteProperty(_blog, 'author')

        return {
          ...blogWithoutAuthor,
          authorName,
        } satisfies ResponseFindAll['data']['list'][number]
      }),
      total,
      pageNo,
      pageSize,
    }
  }

  async findAllTags(params: BlogFindAllTagsParams): Promise<ResponseFindAllTags['data']> {
    const where: Prisma.BlogWhereInput = { author: { uuid: params.uuid } }

    const list = await this.prisma.blog.findMany({
      where,
      select: {
        tags: true,
      },
    })

    const total = await this.prisma.blog.count({ where })

    return {
      list: list.reduce<Blog['tags']>((acc, cur) => {
        cur.tags.forEach(tag => !acc.includes(tag) && acc.push(tag))
        return acc
      }, []),
      total,
    }
  }
}
