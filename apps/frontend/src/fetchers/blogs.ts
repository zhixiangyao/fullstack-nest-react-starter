import type { BlogFindAllRequest, BlogFindAllResponse } from './blogs.type'

import { fetchPost } from '~/utils/fetch'

export async function blogFindAll(data: BlogFindAllRequest) {
  const result = await fetchPost<BlogFindAllResponse>('/api/blog/find-all', JSON.stringify(data))

  return result
}
