import type { Prisma, User } from '@prisma/client'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { $Enums } from '@prisma/client'
import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'
import { PasswordService } from './password.service'

import { UserCreateDto, UserFindAllDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService) {}

  async find(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    return user
  }

  async findAll(body: UserFindAllDto) {
    const { username, pageNo = 1, pageSize = 10 } = body
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
    })

    const total = await this.prisma.user.count({
      where: {
        username: {
          contains: username,
        },
      },
    })

    return {
      list: list.map(user => deleteProperty(user, 'passwordHash')),
      total,
      pageNo,
      pageSize,
    }
  }

  async create(body: UserCreateDto): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(body.password)

    const user = await this.prisma.user.create({
      data: {
        username: body.username,
        passwordHash,
        roles: [$Enums.Role.USER],
        email: body.email,
      },
    })

    return user
  }

  async validate(username: string, password: string): Promise<boolean> {
    const user = await this.find(username)

    return await this.passwordService.comparePassword(password, user.passwordHash)
  }

  async update(username: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { username },
      data,
    })

    return user
  }

  async remove(username: string): Promise<void> {
    await this.prisma.user.delete({ where: { username } })
  }

  async check(username: string) {
    const user = await this.find(username)

    if (user.enable === false) {
      throw new ForbiddenException('您的账户已被禁用！')
    }
  }

  async has(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } })

    return !!user
  }
}
