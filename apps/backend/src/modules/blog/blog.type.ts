import type { Blog } from '@prisma/client'

export interface ResponseFindAll {
  data: {
    list: Blog[]
    total: number
    pageNo: number
    pageSize: number
  }
}
