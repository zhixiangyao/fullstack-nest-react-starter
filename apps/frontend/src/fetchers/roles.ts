import type { RoleFindAllRequest, RoleFindAllResponse } from './roles.type'

import { fetchPost } from '~/utils/fetch'

export async function roleFindAll(data: RoleFindAllRequest) {
  const result = await fetchPost<RoleFindAllResponse>('/api/role/find-all', JSON.stringify(data))

  return result
}
