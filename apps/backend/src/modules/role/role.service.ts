import type { ResponseFindAll } from './role.type'
import { Injectable } from '@nestjs/common'

import { deleteProperty } from 'utils'

import { PrismaService } from '~/modules/prisma/prisma.service'
import { RoleFindAllDto } from './role.dto'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(data: RoleFindAllDto) {
    const { pageNo = 1, pageSize = 10 } = data
    const skip = (pageNo - 1) * pageSize
    const take = pageSize

    const list = await this.prisma.role.findMany({
      skip,
      take,
      orderBy: { name: 'asc' },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })

    const total = await this.prisma.role.count()

    return {
      list: list.map((role) => {
        return {
          ...role,
          users: role.users.map(user => deleteProperty(user.user, 'hashedPassword')),
        } satisfies ResponseFindAll['data']['list'][number]
      }),
      total,
      pageNo,
      pageSize,
    }
  }
}
