import type { BlogTreeNode } from '@prisma/client'

export interface ResponseFindAll {
  data: {
    list: BlogTreeNode[]
    total: number
  }
}
