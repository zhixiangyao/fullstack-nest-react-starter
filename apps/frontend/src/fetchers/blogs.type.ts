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
  imageUrl: string | null
  tags: string[]
  category: string | null
}

export interface BlogFindAllRequest {
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
