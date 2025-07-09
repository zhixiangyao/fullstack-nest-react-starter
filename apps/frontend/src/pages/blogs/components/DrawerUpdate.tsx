import type { FormProps } from 'antd'
import type { TUseDrawerUpdateReturnType } from '../hooks/useDrawerUpdate'
import type { Blog } from '~/fetchers'
import { Button, Drawer, Form, Input, Switch } from 'antd'

import { Tags } from './Tags'

const formItemLayout: FormProps = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 12 },
  },
}

interface Props {
  rules: TUseDrawerUpdateReturnType['rules']
  form: TUseDrawerUpdateReturnType['form']
  open: TUseDrawerUpdateReturnType['open']
  loading: TUseDrawerUpdateReturnType['loading']
  loadingConfirm: TUseDrawerUpdateReturnType['loadingConfirm']
  handleClose: TUseDrawerUpdateReturnType['handleClose']
  handleFinish: TUseDrawerUpdateReturnType['handleFinish']
}

function DrawerUpdate(props: Props) {
  const { rules, form, open, loading, loadingConfirm } = props
  const { handleClose, handleFinish } = props

  return (
    <Drawer
      height="100%"
      title="Add Blog"
      placement="top"
      maskClosable={false}
      keyboard={false}
      open={open}
      loading={loading}
      footer={(
        <div className="flex gap-2">
          <Button type="primary" onClick={form.submit} loading={loadingConfirm}>
            Confirm
          </Button>

          <Button onClick={handleClose}>Cancel</Button>
        </div>
      )}
      onClose={handleClose}
    >
      <Form<Blog>
        {...formItemLayout}
        name="blog-update"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loadingConfirm}
      >
        <Form.Item<Blog> label="Title" name="title" rules={rules.title}>
          <Input showCount placeholder="Please input the Title" maxLength={100} />
        </Form.Item>

        <Form.Item<Blog> label="Content" name="content" rules={rules.content}>
          <Input.TextArea showCount placeholder="Please input the Content" rows={20} maxLength={50000} />
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
