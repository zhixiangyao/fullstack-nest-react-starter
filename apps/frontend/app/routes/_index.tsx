import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { BlogList } from '~/components/BlogList'
import { fetchBlogFindAll } from '~/fetchers'

export const meta: MetaFunction = () => {
  return [{ title: 'Index' }, { name: 'description', content: 'Welcome to Index!' }]
}

export async function loader() {
  const res = await fetchBlogFindAll()

  return {
    list: res.data.list,
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="py-8 max-w-168 mx-auto px-4 lg:px-0">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Latest Blog Posts 📝</h1>

      <main className="flex flex-col gap-2">
        <BlogList list={data.list} />
      </main>
    </div>
  )
}
