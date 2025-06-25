import type { FormItemProps } from 'antd'
import type { Blog } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { App as AntdApp, Form } from 'antd'
import { useState } from 'react'

import * as fetchers from '~/fetchers'
import { CACHE_KEY_BLOG_FIND_ALL } from './useBlogList'

type TType = 'add' | 'edit'

const rules = {
  title: [{ required: true, message: 'Please input the Title!' }],
  content: [{ required: true, message: 'Please input the Content!' }],
  slug: [{ required: true, message: 'Please input the Slug!' }],
  imageUrl: [{ required: true, message: 'Please input the Image Url!' }],
  tags: [{ required: true, message: 'Please input the Tags!' }],
  category: [{ required: true, message: 'Please input the Category!' }],
} satisfies Partial<Record<keyof Blog, FormItemProps['rules']>>

export function useDrawerUpdate() {
  const { message } = AntdApp.useApp()
  const { refreshAsync } = useRequest(fetchers.blogFindAll, {
    cacheKey: CACHE_KEY_BLOG_FIND_ALL,
    manual: true,
  })
  const [type, setType] = useState<TType>('add')
  const [form] = Form.useForm<Blog>()
  const [blog, setBlog] = useState<Blog>()
  const [open, setOpen] = useState(false)
  const [loading] = useState(false)

  const handleOpenAdd = useMemoizedFn(() => {
    setOpen(true)

    form.setFieldsValue({
      published: false,
    })
  })

  const handleOpenEdit = useMemoizedFn(async () => {
    setType('edit')
    setOpen(true)

    form.setFieldsValue({
      published: false,
    })
  })

  const handleClose = useMemoizedFn(() => {
    form.resetFields()
    setType('add')
    setBlog(void 0)
    setOpen(false)
  })

  const handleFinish = useMemoizedFn(async (values: Blog) => {
    try {
      if (type === 'add') {
        await fetchers.blogCreate({
          title: values.title,
          content: values.content,
          slug: values.slug,
          published: values.published,
          tags: values.tags,
          imageUrl: values.imageUrl,
          category: values.category,
        })
        message.success('Add successful!')
      }
      refreshAsync()
      handleClose()
    }
    catch (error) {
      console.log(error)
    }
  })

  return {
    type,
    rules,
    form,
    blog,
    open,
    loading,
    handleClose,
    handleOpenAdd,
    handleOpenEdit,
    handleFinish,
  }
}

export type TUseDrawerUpdateReturnType = ReturnType<typeof useDrawerUpdate>
