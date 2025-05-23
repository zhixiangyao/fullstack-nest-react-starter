import { Body, Controller, Get, Header, HttpException, HttpStatus, Post, Request } from '@nestjs/common'
import { $Enums, Status } from '@prisma/client'

import { UserService } from './user.service'
import { RegisterUserDto, UserPageDto, UserUpdateDto } from './dto/user.dto'
import type { ResponseFindAll, ResponseGetUser, ResponseRegisterUser, ResponseUpdateUser } from './type'

import { deleteProperty } from '~/utils/object'
import { Role } from '~/common/decorators/role.decorator'
import { Public } from '~/common/decorators/public.decorator'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @Header('content-type', 'application/json')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<ResponseRegisterUser> {
    if (await this.userService.has(registerUserDto.username)) {
      throw new HttpException('此用户已被注册', HttpStatus.BAD_REQUEST)
    }

    await this.userService.create(registerUserDto.username, registerUserDto.password)

    return { message: '注册成功' }
  }

  @Role([$Enums.Role.ADMIN])
  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() userUpdateDto: UserUpdateDto, @Request() req: Request): Promise<ResponseUpdateUser> {
    const user = req.user

    if (user.username === userUpdateDto.username) {
      throw new HttpException('不可修改自身', HttpStatus.BAD_REQUEST)
    }

    if (!(await this.userService.has(userUpdateDto.username))) {
      throw new HttpException('未知的 username 值', HttpStatus.BAD_REQUEST)
    }

    if (userUpdateDto.status !== Status.Active && userUpdateDto.status !== Status.Inactive) {
      throw new HttpException('未知的 status 值', HttpStatus.BAD_REQUEST)
    }

    await this.userService.update(userUpdateDto.username, { status: userUpdateDto.status })

    return { message: '更新成功' }
  }

  @Get()
  @Header('content-type', 'application/json')
  async getUser(@Request() req: Request): Promise<ResponseGetUser> {
    await this.userService.check(req.user.username)

    const user = await this.userService.find(req.user.username)

    const userWithoutPassword = deleteProperty(user, 'password')

    return { data: { user: userWithoutPassword } }
  }

  @Role([$Enums.Role.ADMIN])
  @Post('page')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() userPageDto: UserPageDto): Promise<ResponseFindAll> {
    const data = await this.userService.findAll(userPageDto)

    return { data }
  }
}
