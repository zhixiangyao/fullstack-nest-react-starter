import type { Blog } from '@prisma/client'

export interface ResponseCreate {
  message: string
}

export interface ResponseFindAll {
  data: {
    list: Blog[]
    total: number
    pageNo: number
    pageSize: number
  }
}
