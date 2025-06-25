import type { TUseDrawerUpdateReturnType } from '../hooks/useDrawerUpdate'
import type { Blog } from '~/fetchers'
import { Button, Drawer, Form, Input, Switch } from 'antd'
import React from 'react'

import { Tags } from './Tags'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

interface Props {
  rules: TUseDrawerUpdateReturnType['rules']
  form: TUseDrawerUpdateReturnType['form']
  open: TUseDrawerUpdateReturnType['open']
  loading: TUseDrawerUpdateReturnType['loading']
  handleClose: TUseDrawerUpdateReturnType['handleClose']
  handleFinish: TUseDrawerUpdateReturnType['handleFinish']
}

function DrawerUpdate(props: Props) {
  const { rules, form, open, loading } = props
  const { handleClose, handleFinish } = props

  return (
    <Drawer
      height="90%"
      title="Add Blog"
      placement="top"
      onClose={handleClose}
      open={open}
      loading={loading}
      footer={(
        <Button type="primary" onClick={form.submit}>
          Confirm
        </Button>
      )}
    >
      <Form<Blog> {...formItemLayout} name="blog-update" autoComplete="off" onFinish={handleFinish} form={form}>
        <Form.Item<Blog> label="Title" name="title" rules={rules.title}>
          <Input showCount placeholder="Please input the Title" maxLength={100} />
        </Form.Item>

        <Form.Item<Blog> label="Content" name="content" rules={rules.content}>
          <Input.TextArea showCount placeholder="Please input the Content" rows={10} maxLength={50000} />
        </Form.Item>

        <Form.Item<Blog> label="Slug" name="slug" rules={rules.slug}>
          <Input showCount placeholder="Please input the Slug" maxLength={100} />
        </Form.Item>

        <Form.Item<Blog> label="Published" name="published" required>
          <Switch checkedChildren="Published" unCheckedChildren="Unpublished" />
        </Form.Item>

        <Form.Item<Blog> label="Image Url" name="imageUrl" rules={rules.imageUrl}>
          <Input showCount placeholder="Please input the Image Url" maxLength={200} />
        </Form.Item>

        <Form.Item<Blog> label="Tags" name="tags" rules={rules.tags}>
          <Tags placeholder="Input Tag" maxLength={5} />
        </Form.Item>

        <Form.Item<Blog> label="Category" name="category" rules={rules.category}>
          <Input showCount placeholder="Please input the Category" maxLength={50} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { DrawerUpdate }
