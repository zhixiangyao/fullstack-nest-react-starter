import type { User } from '@prisma/client'
import type { ResponseFind, ResponseFindAll } from './user.type'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'

import { PasswordService } from './password.service'
import { UserCreateDto, UserFindAllDto, UserUpdateDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService) {}

  async find(username: string): Promise<ResponseFind['data']['user'] & Pick<User, 'hashedPassword'>> {
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

  async findAll(data: UserFindAllDto): Promise<ResponseFindAll['data']> {
    const { username, pageNo = 1, pageSize = 10 } = data
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

  async create(data: UserCreateDto): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(data.password)

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        hashedPassword,
        email: data.email,
      },
    })

    return user
  }

  async validate(username: string, password: string): Promise<boolean> {
    const user = await this.find(username)

    return await this.passwordService.comparePassword(password, user.hashedPassword)
  }

  async update(username: string, data: Omit<UserUpdateDto, 'username'>) {
    const user = await this.prisma.user.update({
      where: { username },
      data: {
        isActive: data.isActive,
        email: data.email,
        lastLogin: data.lastLogin,
        updatedAt: data.updatedAt,
      },
    })

    return user
  }

  async remove(username: string): Promise<void> {
    await this.prisma.user.delete({ where: { username } })
  }

  async check(username: string): Promise<void> {
    const user = await this.find(username)

    if (user.isActive === false) {
      throw new ForbiddenException('Your account has been marked as inactive!')
    }
  }

  async has(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } })

    return !!user
  }
}
