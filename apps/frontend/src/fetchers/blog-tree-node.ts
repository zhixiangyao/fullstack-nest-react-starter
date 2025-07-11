import type { BlogTreeNodeFindAllRequest, BlogTreeNodeFindAllResponse } from './blog-tree-node.type'

import { fetchPost } from '~/utils/fetch'

export async function blogTreeNodeFindAll(data: BlogTreeNodeFindAllRequest) {
  const result = await fetchPost<BlogTreeNodeFindAllResponse>('/api/blog-tree-node/find-all', JSON.stringify(data))

  return result
}
