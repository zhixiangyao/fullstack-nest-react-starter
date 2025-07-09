import clsx from 'clsx'
import { useEffect, useState } from 'react'
import rehypeStringify from 'rehype-stringify'
import remarkCodeTitle from 'remark-code-title'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import './Markdown.css'

async function processMarkdown(markdownText: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkEmoji)
    .use(remarkCodeTitle)
    .use(remarkRehype)
    .use(rehypeStringify)
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
