import type { Blog as _Blog } from 'database'

export interface Blog extends _Blog {
  authorName: string
}

export interface BlogCreateRequest extends Pick<Blog, 'title' | 'content' | 'slug' | 'published' | 'tags'> {
  imageUrl?: Blog['imageUrl']
  category?: Blog['category']
}

export interface BlogCreateResponse {
  message: string
}

export interface BlogSwitchRequest {
  id: Blog['id']
  published: Blog['published']
}

export interface BlogSwitchResponse extends BlogCreateResponse {}

export interface BlogUpdateRequest extends BlogCreateRequest {
  id: Blog['id']
}

export interface BlogUpdateResponse extends BlogCreateResponse {}

export type BlogRemoveRequest = Pick<Blog, 'id'>

export interface BlogRemoveResponse extends BlogCreateResponse {}

export interface BlogFindRequest {
  id: Blog['id']
}

export interface BlogFindResponse {
  data: {
    blog: Blog
  }
}

export interface BlogFindAllRequest {
  title?: Blog['title']
  published?: Blog['published']
  tags?: Blog['tags']
  order?: 'desc' | 'asc'
  field?: string
  pageNo?: number
  pageSize?: number
}

export interface BlogFindAllResponse {
  data: {
    list: Blog[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export interface BlogFindAllTagsResponse {
  data: {
    list: Blog['tags']
    total: number
  }
}
