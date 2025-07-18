import type { Blog, User } from '~/types'

async function fetchPost<T>(url: string, body: BodyInit | null | undefined) {
  const baseURL = 'http://localhost:5088'

  const response = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })

  const result = await response.json()

  return result as T
}

export async function fetchUserFind(data: { username?: string }) {
  const result = fetchPost<{ data: { user: User | null } }>('/api/user/find', JSON.stringify(data))

  return result
}

export async function fetchBlogFind(data: { slug?: string }) {
  const result = fetchPost<{ data: { blog: Blog | null } }>('/api/blog/find', JSON.stringify(data))

  return result
}

export async function fetchBlogFindAll(data?: { uuid?: string }) {
  const result = await fetchPost<{ data: { list: Blog[] } }>(
    '/api/blog/find-all',
    JSON.stringify({ uuid: data?.uuid, pageSize: 10000, published: true }),
  )

  return result
}
