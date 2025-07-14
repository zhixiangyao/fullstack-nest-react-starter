import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

export const Public = (p = true) => SetMetadata(IS_PUBLIC_KEY, p)
