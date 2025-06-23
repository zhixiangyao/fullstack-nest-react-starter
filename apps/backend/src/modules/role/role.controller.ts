import type { ResponseFindAll } from './role.type'
import { Body, Controller, Header, Post } from '@nestjs/common'

import { Roles } from '~/common/decorators/roles.decorator'
import { RoleFindAllDto } from './role.dto'
import { RoleService } from './role.service'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(['ADMIN'])
  @Post('find-all')
  @Header('Content-Type', 'application/json')
  async findAll(@Body() body: RoleFindAllDto): Promise<ResponseFindAll> {
    const data = await this.roleService.findAll(body)

    return { data }
  }
}
