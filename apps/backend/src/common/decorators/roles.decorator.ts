import { SetMetadata } from '@nestjs/common'
import { Role } from '@prisma/client'

export const IS_ROLES_KEY = 'isRole'

export const Roles = (roleNames: Role['name'][]) => SetMetadata(IS_ROLES_KEY, roleNames)
