import type { $Enums } from '@prisma/client'
import { SetMetadata } from '@nestjs/common'

export const IS_ROLES_KEY = 'isRole'
export const Roles = (roles: $Enums.Role[]) => SetMetadata(IS_ROLES_KEY, roles)
