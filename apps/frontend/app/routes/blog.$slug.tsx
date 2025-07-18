import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Markdown, processMarkdown } from 'markdown'

import { fetchBlogFind } from '~/fetchers'

export const meta: MetaFunction = () => {
  return [{ title: 'Blog Post' }, { name: 'description', content: 'Welcome to the blog!' }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetchBlogFind({ slug: params.slug })
  const title = res.data.blog?.title
  const content = res.data.blog?.content
  return {
    title,
    html: content ? await processMarkdown(content) : '',
  }
}

export default function Blog() {
  const blog = useLoaderData<typeof loader>()
  return (
    <div className="pt-8">
      <div className="max-w-168 mx-auto px-4 lg:px-0">
        <Markdown className="max-w-[1280px] w-full" html={blog?.html} />
      </div>
    </div>
  )
}
