import type { BlogCreateRequest, BlogCreateResponse, BlogFindAllRequest, BlogFindAllResponse } from './blogs.type'

import { fetchPost } from '~/utils/fetch'

export async function blogCreate(data: BlogCreateRequest) {
  const result = await fetchPost<BlogCreateResponse>('/api/blog/create', JSON.stringify(data))

  return result
}

export async function blogFindAll(data: BlogFindAllRequest) {
  const result = await fetchPost<BlogFindAllResponse>('/api/blog/find-all', JSON.stringify(data))

  return result
}
