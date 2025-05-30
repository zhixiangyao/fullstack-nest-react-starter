import type { ResponseFindAll, ResponseGetUser, ResponseRegisterUser, ResponseRemove, ResponseUpdate } from './type'
import { Body, Controller, Header, HttpException, HttpStatus, Post, Request } from '@nestjs/common'
import { $Enums, Prisma } from '@prisma/client'
import { deleteProperty } from 'utils'

import { Public } from '~/common/decorators/public.decorator'
import { Roles } from '~/common/decorators/roles.decorator'

import { User } from '~/common/decorators/user.decorator'
import { UserCreateDto, UserFindAllDto, UserFindDto, UserRemoveDto, UserUpdateDto } from './user.dto'
import { UserService } from './user.service'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  @Header('content-type', 'application/json')
  async create(@Body() body: UserCreateDto): Promise<ResponseRegisterUser> {
    if (await this.userService.has(body.username)) {
      throw new HttpException('此用户已被注册', HttpStatus.BAD_REQUEST)
    }

    await this.userService.create(body.username, body.password)

    return { message: '注册成功' }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() body: UserUpdateDto, @Request() req: Request): Promise<ResponseUpdate> {
    const userUpdateInput: Prisma.UserUpdateInput = {}

    if (body.status) {
      if (req.user.username === body.username && body.status === $Enums.Status.Inactive) {
        throw new HttpException('管理员不可修改状态', HttpStatus.BAD_REQUEST)
      }

      userUpdateInput.status = body.status
    }

    if (body.email) {
      userUpdateInput.email = body.email
    }

    await this.userService.update(body.username, userUpdateInput)

    return { message: '更新成功' }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('remove')
  @Header('content-type', 'application/json')
  async remove(@Body() body: UserRemoveDto, @User('username') username: string): Promise<ResponseRemove> {
    if (username === body.username) {
      throw new HttpException('不可删除自身', HttpStatus.BAD_REQUEST)
    }

    if (!(await this.userService.has(body.username))) {
      throw new HttpException('未知的 username 值', HttpStatus.BAD_REQUEST)
    }

    await this.userService.remove(body.username)

    return { message: '删除成功!' }
  }

  @Post('find')
  @Header('content-type', 'application/json')
  async find(@Body() body: UserFindDto, @User() user: Request['user']): Promise<ResponseGetUser> {
    const username = body.username ?? user.username

    const item = await this.userService.find(username)
    const userWithoutPassword = deleteProperty(item, 'password')

    return { data: { user: userWithoutPassword } }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: UserFindAllDto): Promise<ResponseFindAll> {
    const data = await this.userService.findAll(body)

    return { data }
  }
}
