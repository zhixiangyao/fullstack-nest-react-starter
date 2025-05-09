import { ForbiddenException, Injectable } from '@nestjs/common'
import { $Enums, Status } from '@prisma/client'
import type { Prisma, User } from '@prisma/client'

import { PasswordService } from './password.service'
import { UserPageDto } from './dto/user.dto'

import { PrismaService } from '~/modules/prisma/prisma.service'
import { deleteProperty } from '~/utils/object'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async find(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    return user
  }

  async findAll(userPageDto: UserPageDto) {
    const { pageNo = 1, pageSize = 10 } = userPageDto
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const list = await this.prisma.user.findMany({ skip, take })

    const total = await this.prisma.user.count()

    return {
      list: list.map(user => deleteProperty(user, 'password')),
      total,
      pageNo,
      pageSize,
    }
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(password)

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: $Enums.Role.USER,
      },
    })

    return user
  }

  async validate(username: string, password: string): Promise<boolean> {
    const user = await this.find(username)

    const hashedPassword = user.password
    return await this.passwordService.comparePassword(password, hashedPassword)
  }

  async update(username: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { username },
      data,
    })

    return user
  }

  async check(username: string) {
    const user = await this.find(username)
    if (user.status === Status.Inactive) {
      throw new ForbiddenException('您的账户已被禁用！')
    }
  }

  async has(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } })
    return !!user
  }
}
