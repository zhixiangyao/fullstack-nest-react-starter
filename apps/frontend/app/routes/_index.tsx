import type { MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { formatTime } from 'utils'

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
    <div className="pt-8">
      <div className="max-w-168 mx-auto px-4 lg:px-0">
        <h1 className="text-4xl font-extrabold mb-10 text-center">Latest Blog Posts 📝</h1>

        <main className="flex flex-col gap-2">
          {list.map(item => (
            <Link key={item.id} to={`/blog/${item.slug}`} className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-neutral-600 dark:text-neutral-400">{formatTime(item.createdAt)}</span>
                <span>{item.title}</span>
              </div>

              <span>{item.authorName}</span>
            </Link>
          ))}
        </main>
      </div>
    </div>
  )
}
