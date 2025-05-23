import { SetMetadata } from '@nestjs/common'
import type { $Enums } from '@prisma/client'

export const IS_ROLE_KEY = 'isRole'
export const Role = (role: $Enums.Role[]) => SetMetadata(IS_ROLE_KEY, role)
