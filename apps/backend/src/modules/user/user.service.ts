import type { User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll } from './user.type'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'

import { PasswordService } from './password.service'

type FindAllParams = {
  pageNo?: number
  pageSize?: number
} & Partial<Pick<User, 'username'>>

type CreateParams = Pick<User, 'username'>
  & Partial<Pick<User, 'email'>> & {
    password: string
  }

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService) {}

  async find(username: User['username']): Promise<ResponseFind['data']['user'] & Pick<User, 'hashedPassword'>> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        blogs: true,
      },
    })

    const userWithoutBlogs = deleteProperty(user, 'blogs')

    return {
      ...userWithoutBlogs,
      roles: user.roles.map(userRole => userRole.role),
      blogsTotal: user.blogs.length,
    }
  }

  async findAll(params: FindAllParams): Promise<ResponseFindAll['data']> {
    const { username, pageNo = 1, pageSize = 10 } = params
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const list = await this.prisma.user.findMany({
      skip,
      take,
      where: {
        username: {
          contains: username,
        },
      },
      orderBy: { username: 'asc' },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        blogs: true,
      },
    })

    const total = await this.prisma.user.count({
      where: {
        username: {
          contains: username,
        },
      },
    })

    return {
      list: list.map((user) => {
        const userWithoutPasswordHashAndBlogs = deleteProperty(deleteProperty(user, 'hashedPassword'), 'blogs')

        return {
          ...userWithoutPasswordHashAndBlogs,
          roles: userWithoutPasswordHashAndBlogs.roles.map(userRole => userRole.role),
          blogsTotal: user.blogs.length,
        } satisfies ResponseFindAll['data']['list'][number]
      }),
      total,
      pageNo,
      pageSize,
    }
  }

  async create(params: CreateParams): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(params.password)

    const user = await this.prisma.user.create({
      data: {
        username: params.username,
        hashedPassword,
        email: params.email,
      },
    })

    return user
  }

  async validate(params: Pick<User, 'username'> & { password: string }): Promise<boolean> {
    const user = await this.find(params.username)

    return await this.passwordService.comparePassword({ password: params.password, hashedPassword: user.hashedPassword })
  }

  async update(params: Pick<User, 'username'> & Partial<Pick<User, 'isActive' | 'email' | 'lastLogin' | 'updatedAt'>>) {
    const user = await this.prisma.user.update({
      where: { username: params.username },
      data: {
        isActive: params.isActive,
        email: params.email,
        lastLogin: params.lastLogin,
        updatedAt: params.updatedAt,
      },
    })

    return user
  }

  async remove(username: User['username']): Promise<void> {
    await this.prisma.user.delete({ where: { username } })
  }

  async check(username: User['username']): Promise<void> {
    const user = await this.find(username)

    if (user.isActive === false) {
      throw new ForbiddenException('Your account has been marked as inactive!')
    }
  }

  async has(username: User['username']): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } })

    return !!user
  }
}
