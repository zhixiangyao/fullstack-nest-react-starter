import { useRequest } from 'ahooks'
import { Spin } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Markdown } from '~/components/Markdown'

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
        <Markdown className="w-[1280px]">{data?.data.blog.content}</Markdown>
      </main>
    </Spin>
  )
}

export { Blog }
