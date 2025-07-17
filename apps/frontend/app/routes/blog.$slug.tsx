import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { lazy, memo, Suspense } from 'react'

import { fetchBlogPost } from '~/fetchers'

const Markdown = memo(lazy(() => import('markdown').then(({ Markdown }) => ({ default: Markdown }))))

export const meta: MetaFunction = () => {
  return [{ title: 'Blog Post' }, { name: 'description', content: 'Welcome to the blog!' }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const blog = await fetchBlogPost(params.slug)
  return blog.data.blog
}

export default function Blog() {
  const blog = useLoaderData<typeof loader>()
  return (
    <div className="min-h-full min-w-full flex flex-col items-center overflow-y-auto px-4">
      <div>{blog?.title}</div>

      <Suspense fallback={<div>Loading...</div>}>
        <Markdown className="w-[1280px]">{blog?.content}</Markdown>
      </Suspense>
    </div>
  )
}
