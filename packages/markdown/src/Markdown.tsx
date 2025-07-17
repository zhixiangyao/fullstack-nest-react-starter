import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { unified } from 'unified'

import './Markdown.css'

export async function processMarkdown(markdownText: string) {
  const file = await unified()
    .use((await import('remark-parse')).default)
    .use((await import('remark-gfm')).default)
    .use((await import('remark-emoji')).default)
    .use((await import('remark-code-title')).default)
    .use((await import('remark-rehype')).default)
    .use((await import('rehype-stringify')).default)
    .process(markdownText)
  return String(file)
}

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: string
}

function Markdown({ className, style, children }: Props) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    children
    && processMarkdown(children).then((html) => {
      setHtml(html)
    })
  }, [children])

  return (
    <section
      className={clsx(className, 'markdown')}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { Markdown }
