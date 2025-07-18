import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { unified } from 'unified'
import './Markdown.css'

async function processMarkdown(markdownText: string) {
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

interface MarkdownProps {
  className?: string
  style?: React.CSSProperties
  html?: string
}

function Markdown({ className, style, html }: MarkdownProps) {
  return (
    <section className={clsx(className, 'markdown')} style={style} dangerouslySetInnerHTML={{ __html: html ?? '' }} />
  )
}

interface MarkdownRawProps {
  className?: string
  style?: React.CSSProperties
  content?: string
}

function MarkdownRaw({ className, style, content }: MarkdownRawProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    content && processMarkdown(content).then(html => setHtml(html))
  }, [content])

  return <section className={clsx(className, 'markdown')} style={style} dangerouslySetInnerHTML={{ __html: html }} />
}

export { Markdown, MarkdownRaw, processMarkdown }
