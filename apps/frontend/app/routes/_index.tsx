import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { BLogList } from '~/components/BlogList'
import { fetchBlogFindAll } from '~/fetchers'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader() {
  const res = await fetchBlogFindAll()
  return res.data.list
}

export default function Index() {
  const list = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Latest Blog Posts 📝</h1>

        {list.length === 0
          ? (
              <p className="text-center text-gray-600 text-lg">No blog posts found. Check back soon!</p>
            )
          : (
              <BLogList list={list} />
            )}
      </div>
    </div>
  )
}
