import type { Blog, User } from 'database'

export interface ResponseCreate {
  message: string
}

export interface ResponseSwitch extends ResponseCreate {}

export interface ResponseUpdate extends ResponseCreate {}

export interface ResponseRemove extends ResponseCreate {}

export interface ResponseFind {
  data: {
    blog: Blog & { authorName: User['username'] }
  }
}

export interface ResponseFindAll {
  data: {
    list: ResponseFind['data']['blog'][]
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
