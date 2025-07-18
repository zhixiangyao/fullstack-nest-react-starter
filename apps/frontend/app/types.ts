import type { Blog as _Blog } from 'database'

export interface Blog extends _Blog {
  authorName: string
}
