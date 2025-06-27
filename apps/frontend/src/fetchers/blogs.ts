import type {
  BlogCreateRequest,
  BlogCreateResponse,
  BlogFindAllRequest,
  BlogFindAllResponse,
  BlogFindAllTagsResponse,
  BlogFindRequest,
  BlogFindResponse,
  BlogSwitchRequest,
  BlogSwitchResponse,
  BlogUpdateRequest,
  BlogUpdateResponse,
} from './blogs.type'

import { fetchPost } from '~/utils/fetch'

export async function blogCreate(data: BlogCreateRequest) {
  const result = await fetchPost<BlogCreateResponse>('/api/blog/create', JSON.stringify(data))

  return result
}

export async function blogSwitch(data: BlogSwitchRequest) {
  const result = await fetchPost<BlogSwitchResponse>('/api/blog/switch', JSON.stringify(data))

  return result
}

export async function blogUpdate(data: BlogUpdateRequest) {
  const result = await fetchPost<BlogUpdateResponse>('/api/blog/update', JSON.stringify(data))

  return result
}

export async function blogFind(data: BlogFindRequest) {
  const result = await fetchPost<BlogFindResponse>('/api/blog/find', JSON.stringify(data))

  return result
}

export async function blogFindAll(data: BlogFindAllRequest) {
  const result = await fetchPost<BlogFindAllResponse>('/api/blog/find-all', JSON.stringify(data))

  return result
}

export async function blogFindAllTags() {
  const result = await fetchPost<BlogFindAllTagsResponse>('/api/blog/find-all-tags', void 0)

  return result
}
