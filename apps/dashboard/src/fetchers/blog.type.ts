export interface Blog {
  id: number
  title: string
  content: string
  slug: string
  published: boolean
  views: number
  createdAt: Date
  updatedAt: Date
  authorUuid: string
  authorName: string
  imageUrl: string | null
  tags: string[]
  category: string | null
}

export interface BlogCreateRequest {
  title: Blog['title']
  content: Blog['content']
  slug: Blog['slug']
  published: Blog['published']
  tags: Blog['tags']
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
