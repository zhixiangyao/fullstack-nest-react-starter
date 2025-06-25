import type { Blog } from '@prisma/client'

export interface ResponseCreate {
  message: string
}

export interface ResponseUpdate {
  message: string
}

export interface ResponseFind {
  data: {
    blog: Blog
  }
}

export interface ResponseFindAll {
  data: {
    list: Blog[]
    total: number
    pageNo: number
    pageSize: number
  }
}
