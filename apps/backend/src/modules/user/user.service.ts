import type { Role, User } from '@prisma/client'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'
import { PasswordService } from './password.service'

import { UserCreateDto, UserFindAllDto, UserUpdateDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService) {}

  async find(username: string): Promise<User & { roles: Role[] }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    return { ...user, roles: user.roles.map(userRole => userRole.role) }
  }

  async findAll(data: UserFindAllDto) {
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
            role: true, // 包含角色本身的详细信息
          },
        },
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
      list: list.map<Omit<User, 'passwordHash'> & { roles: Role[] }>((user) => {
        const userWithoutPasswordHash = deleteProperty(user, 'passwordHash')

        return { ...userWithoutPasswordHash, roles: userWithoutPasswordHash.roles.map(userRole => userRole.role) }
      }),
      total,
      pageNo,
      pageSize,
    }
  }

  async create(data: UserCreateDto): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(data.password)

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        email: data.email,
      },
    })

    return user
  }

  async validate(username: string, password: string): Promise<boolean> {
    const user = await this.find(username)

    return await this.passwordService.comparePassword(password, user.passwordHash)
  }

  async update(username: string, data: Omit<UserUpdateDto, 'username'>) {
    const user = await this.prisma.user.update({
      where: { username },
      data: {
        enable: data.enable,
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

    if (user.enable === false) {
      throw new ForbiddenException('您的账户已被禁用！')
    }
  }

  async has(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } })

    return !!user
  }
}
