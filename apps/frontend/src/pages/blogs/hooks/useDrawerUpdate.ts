import type { FormItemProps } from 'antd'
import type { Blog } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Form } from 'antd'
import { useRef, useState } from 'react'
import { isValidHttpUrl } from 'utils'

import * as fetchers from '~/fetchers'

type TType = 'add' | 'edit'

const rules = {
  title: [{ required: true, message: 'Please input the Title!' }],
  content: [{ required: true, message: 'Please input the Content!' }],
  slug: [{ required: true, message: 'Please input the Slug!' }],
  imageUrl: [
    {
      validator(rule, value) {
        if (value && !isValidHttpUrl(value))
          return Promise.reject(new Error('Please input a valid Image Url!'))
        return Promise.resolve()
      },
    },
  ],
  tags: [],
  category: [],
} satisfies Partial<Record<keyof Blog, FormItemProps['rules']>>

interface Prams {
  refresh: () => void
}

function useDrawerUpdate({ refresh }: Prams) {
  const { message } = AntdApp.useApp()
  const [type, setType] = useState<TType>('add')
  const [form] = Form.useForm<Blog>()
  const blogId = useRef<Blog['id']>()
  const [blog, setBlog] = useState<Blog>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const handleOpenAdd = useMemoizedFn(() => {
    setOpen(true)

    form.setFieldsValue({
      published: false,
      tags: [],
    })
  })

  const handleOpenEdit = useMemoizedFn(async (id: Blog['id']) => {
    try {
      setLoading(true)
      setOpen(true)
      setType('edit')
      blogId.current = id

      const { data } = await fetchers.blogFind({ id })
      setBlog(data.blog)
      form.setFieldsValue({
        title: data.blog.title,
        content: data.blog.content,
        slug: data.blog.slug,
        published: data.blog.published,
        tags: data.blog.tags,
        imageUrl: data.blog.imageUrl,
        category: data.blog.category,
      })
    }
    finally {
      setLoading(false)
    }
  })

  const handleClose = useMemoizedFn(() => {
    form.resetFields()
    setType('add')
    setBlog(void 0)
    setOpen(false)
  })

  const handleFinish = useMemoizedFn(async (values: Blog) => {
    try {
      setLoadingConfirm(true)
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
      if (type === 'edit' && typeof blogId.current === 'number') {
        await fetchers.blogUpdate({
          id: blogId.current,
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
      refresh()
      handleClose()
    }
    finally {
      setLoadingConfirm(false)
    }
  })

  return {
    type,
    rules,
    form,
    blog,
    open,
    loading,
    loadingConfirm,
    handleClose,
    handleOpenAdd,
    handleOpenEdit,
    handleFinish,
  }
}

export { useDrawerUpdate }

export type TUseDrawerUpdateReturnType = ReturnType<typeof useDrawerUpdate>
