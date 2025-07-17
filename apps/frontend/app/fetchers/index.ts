async function fetchPost<T>(url: string, body: BodyInit | null | undefined) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })

  const result = await response.json()

  return result as T
}

interface Blog {
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

export async function fetchBlogPost(slug?: string) {
  const url = `http://localhost:5088/api/blog/find`
  const body = JSON.stringify({ slug })
  return fetchPost<{ data: { blog: Blog | null } }>(url, body)
}
