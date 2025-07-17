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
