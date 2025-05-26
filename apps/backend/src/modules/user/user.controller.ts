import { Body, Controller, Get, Header, HttpException, HttpStatus, Post, Request } from '@nestjs/common'
import { $Enums, Status } from '@prisma/client'
import { deleteProperty } from 'utils'

import { UserService } from './user.service'
import { RegisterUserDto, UserDeleteDto, UserPageDto, UserUpdateDto } from './dto/user.dto'
import type { ResponseFindAll, ResponseGetUser, ResponseRegisterUser, ResponseUpdateUser } from './type'

import { Roles } from '~/common/decorators/roles.decorator'
import { Public } from '~/common/decorators/public.decorator'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @Header('content-type', 'application/json')
  async register(@Body() body: RegisterUserDto): Promise<ResponseRegisterUser> {
    if (await this.userService.has(body.username)) {
      throw new HttpException('此用户已被注册', HttpStatus.BAD_REQUEST)
    }

    await this.userService.create(body.username, body.password)

    return { message: '注册成功' }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() body: UserUpdateDto, @Request() req: Request): Promise<ResponseUpdateUser> {
    const user = req.user

    if (user.username === body.username) {
      throw new HttpException('不可修改自身', HttpStatus.BAD_REQUEST)
    }

    if (!(await this.userService.has(body.username))) {
      throw new HttpException('未知的 username 值', HttpStatus.BAD_REQUEST)
    }

    if (body.status !== Status.Active && body.status !== Status.Inactive) {
      throw new HttpException('未知的 status 值', HttpStatus.BAD_REQUEST)
    }

    await this.userService.update(body.username, { status: body.status })

    return { message: '更新成功' }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('delete')
  @Header('content-type', 'application/json')
  async delete(@Body() body: UserDeleteDto, @Request() req: Request): Promise<ResponseUpdateUser> {
    const user = req.user

    if (user.username === body.username) {
      throw new HttpException('不可删除自身', HttpStatus.BAD_REQUEST)
    }

    if (!(await this.userService.has(body.username))) {
      throw new HttpException('未知的 username 值', HttpStatus.BAD_REQUEST)
    }

    await this.userService.delete(body.username)

    return { message: '删除成功!' }
  }

  @Get()
  @Header('content-type', 'application/json')
  async getUser(@Request() req: Request): Promise<ResponseGetUser> {
    await this.userService.check(req.user.username)

    const user = await this.userService.find(req.user.username)

    const userWithoutPassword = deleteProperty(user, 'password')

    return { data: { user: userWithoutPassword } }
  }

  @Roles([$Enums.Role.ADMIN])
  @Post('page')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: UserPageDto): Promise<ResponseFindAll> {
    const data = await this.userService.findAll(body)

    return { data }
  }
}
