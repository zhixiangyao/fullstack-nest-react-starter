import type {
  ResponseCreate,
  ResponseFind,
  ResponseFindAll,
  ResponseRemove,
  ResponseSwitch,
  ResponseUpdate,
} from './user.type'
import { Body, Controller, Header, HttpException, HttpStatus, Post } from '@nestjs/common'
import { deleteProperty } from 'utils'

import { Public } from '~/common/decorators/public.decorator'
import { Roles } from '~/common/decorators/roles.decorator'
import { User } from '~/common/decorators/user.decorator'

import {
  UserCreateDto,
  UserFindAllDto,
  UserFindDto,
  UserRemoveDto,
  UserSwitchDto,
  UserUpdateDto,
} from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  @Header('content-type', 'application/json')
  async create(@Body() body: UserCreateDto): Promise<ResponseCreate> {
    if (await this.userService.has(body.username)) {
      throw new HttpException('This user has been registered!', HttpStatus.BAD_REQUEST)
    }

    await this.userService.create(body)

    return { message: 'Create successful!' }
  }

  @Roles(['ADMIN'])
  @Post('switch')
  @Header('content-type', 'application/json')
  async switch(@Body() body: UserSwitchDto, @User() user: Request['user']): Promise<ResponseSwitch> {
    if (user.username === body.username && body.isActive !== void 0) {
      throw new HttpException('Users cannot modify their own isActive status!', HttpStatus.BAD_REQUEST)
    }

    await this.userService.update(body)

    return { message: 'Update successful!' }
  }

  @Roles(['ADMIN'])
  @Post('update')
  @Header('content-type', 'application/json')
  async update(@Body() body: UserUpdateDto, @User() user: Request['user']): Promise<ResponseUpdate> {
    if (user.username === body.username && body.isActive !== void 0) {
      throw new HttpException('Users cannot modify their own isActive status!', HttpStatus.BAD_REQUEST)
    }

    await this.userService.update(body)

    return { message: 'Update successful!' }
  }

  @Roles(['ADMIN'])
  @Post('remove')
  @Header('content-type', 'application/json')
  async remove(@Body() body: UserRemoveDto, @User('username') username: string): Promise<ResponseRemove> {
    if (username === body.username) {
      throw new HttpException('Cannot delete itself!', HttpStatus.BAD_REQUEST)
    }

    if (!(await this.userService.has(body.username))) {
      throw new HttpException('Unknown username value!', HttpStatus.BAD_REQUEST)
    }

    await this.userService.remove(body.username)

    return { message: 'Remove successful!' }
  }

  @Post('find')
  @Header('content-type', 'application/json')
  async find(@Body() body: UserFindDto, @User() user: Request['user']): Promise<ResponseFind> {
    const username = body.username ?? user.username

    const _user = await this.userService.find(username)
    const userWithoutPassword = deleteProperty(_user, 'hashedPassword')

    return { data: { user: userWithoutPassword } }
  }

  @Roles(['ADMIN'])
  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: UserFindAllDto): Promise<ResponseFindAll> {
    const data = await this.userService.findAll(body)

    return { data }
  }
}
