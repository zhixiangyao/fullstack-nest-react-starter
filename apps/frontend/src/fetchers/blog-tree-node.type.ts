export interface BlogTreeNode {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  authorUuid: string
}

export interface BlogTreeNodeFindAllRequest {
  id?: BlogTreeNode['id']
}

export interface BlogTreeNodeFindAllResponse {
  data: {
    list: BlogTreeNode[]
    total: number
  }
}
