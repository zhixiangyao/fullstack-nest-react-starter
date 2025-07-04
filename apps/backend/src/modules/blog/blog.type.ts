import type { Blog } from '@prisma/client'

export interface ResponseCreate {
  message: string
}

export interface ResponseSwitch extends ResponseCreate {}

export interface ResponseUpdate extends ResponseCreate {}

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

export interface ResponseFindAllTags {
  data: {
    list: Blog['tags']
    total: number
  }
}
