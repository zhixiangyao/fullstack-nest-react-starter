import type { Prisma, User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll } from './user.type'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'

import { PasswordService } from './password.service'

interface UserCreateParams {
  username: User['username']
  password: string
  email?: User['email']
}

interface UserUpdateParams {
  username: User['username']
  isActive?: User['isActive']
  email?: User['email']
  lastLogin?: User['lastLogin']
  updatedAt?: User['updatedAt']
}

interface UserFindAllParams {
  username?: User['username']
  pageNo?: number
  pageSize?: number
}

interface UserValidateParams {
  username: User['username']
  password: string
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService) {}

  async create(params: UserCreateParams): Promise<User> {
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

  async update(params: UserUpdateParams) {
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

  async findAll(params: UserFindAllParams): Promise<ResponseFindAll['data']> {
    const { username } = params
    const { pageNo = 1, pageSize = 10 } = params
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const where: Prisma.UserWhereInput = {
      username: { contains: username },
    }

    const list = await this.prisma.user.findMany({
      skip,
      take,
      where,
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

    const total = await this.prisma.user.count({ where })

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

  async validate(params: UserValidateParams): Promise<boolean> {
    const user = await this.find(params.username)

    return await this.passwordService.comparePassword({
      password: params.password,
      hashedPassword: user.hashedPassword,
    })
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
