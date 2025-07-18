import type { Blog } from '~/types'
import { Link } from '@remix-run/react'

import { formatTime } from 'utils'

function BlogList({ list }: { list: Blog[] }) {
  return list.map(item => (
    <div key={item.id} className="flex justify-between items-start">
      <div className="flex gap-2">
        <span className="text-neutral-600 dark:text-neutral-400 w-24 shrink-0">{formatTime(item.createdAt)}</span>
        <Link to={`/blog/${item.slug}`}>{item.title}</Link>
      </div>

      <Link className="shrink-0 text-sm opacity-80" to={`/author/${item.authorName}`}>{item.authorName}</Link>
    </div>
  ))
}

export { BlogList }
