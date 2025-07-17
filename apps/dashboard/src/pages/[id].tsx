import { useRequest } from 'ahooks'
import { Spin } from 'antd'
import { MarkdownRaw } from 'markdown'
import { useEffect } from 'react'
import { useParams } from 'react-router'

import * as fetchers from '~/fetchers'

function Blog() {
  const params = useParams()
  const { loading, data, run } = useRequest(fetchers.blogFind, { manual: true, cacheKey: fetchers.blogFind.name })

  useEffect(() => {
    params.id && run({ id: Number(params.id) })
  }, [params.id, run])

  return (
    <Spin spinning={loading}>

      <main className="min-h-full min-w-full flex justify-center overflow-y-auto px-4">
        <MarkdownRaw className="w-[1280px]" content={data?.data.blog.content} />
      </main>
    </Spin>
  )
}

export { Blog }
