import type { Role } from 'database'
import { SetMetadata } from '@nestjs/common'

export const IS_ROLES_KEY = 'isRole'

export const Roles = (roleNames: Role['name'][]) => SetMetadata(IS_ROLES_KEY, roleNames)
