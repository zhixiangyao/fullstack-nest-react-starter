import type { FormProps } from 'antd'
import type { TUseDrawerUpdateReturnType } from '../hooks/useDrawerUpdate'
import type { Blog } from '~/fetchers'
import { Button, Col, Drawer, Form, Input, Row, Switch } from 'antd'
import { Markdown } from 'markdown'
import { useMemo } from 'react'
import { stringCapitalization } from 'utils'

import { Container } from '~/components/Container'
import { useAppStore } from '~/stores/useAppStore'
import { Tags } from './Tags'

const formItemLayout: FormProps = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

interface Props {
  type: TUseDrawerUpdateReturnType['type']
  rules: TUseDrawerUpdateReturnType['rules']
  form: TUseDrawerUpdateReturnType['form']
  open: TUseDrawerUpdateReturnType['open']
  loading: TUseDrawerUpdateReturnType['loading']
  loadingConfirm: TUseDrawerUpdateReturnType['loadingConfirm']
  handleClose: TUseDrawerUpdateReturnType['handleClose']
  handleFinish: TUseDrawerUpdateReturnType['handleFinish']
  refresh: () => void
}

function DrawerUpdate(props: Props) {
  const { type, rules, form, open, loading, loadingConfirm } = props
  const { handleClose, handleFinish, refresh } = props
  const content = Form.useWatch('content', form)
  const appStore = useAppStore()

  return (
    <Drawer
      height="100%"
      title={`${stringCapitalization(type)} Blog`}
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
        form={form}
        disabled={loadingConfirm}
        onFinish={values => handleFinish(values, () => refresh())}
      >
        <Row gutter={8} align="top">
          <Col xs={24} xl={12} xxl={10}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item<Blog> label="Title" name="title" rules={rules.title}>
                  <Input showCount placeholder="Please input the Title" maxLength={100} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item<Blog> label="Slug" name="slug" rules={rules.slug}>
                  <Input showCount placeholder="Please input the Slug" maxLength={100} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item<Blog> label="Image Url" name="imageUrl" rules={rules.imageUrl}>
                  <Input showCount placeholder="Please input the Image Url" maxLength={200} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item<Blog> label="Category" name="category" rules={rules.category}>
                  <Input showCount placeholder="Please input the Category" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item<Blog> label="Content" name="content" rules={rules.content}>
              <Input.TextArea showCount placeholder="Please input the Content" rows={16} maxLength={50000} />
            </Form.Item>

            <Form.Item<Blog> label="Tags" name="tags" rules={rules.tags}>
              <Tags placeholder="Input Tag" maxLength={5} />
            </Form.Item>

            <Form.Item<Blog> label="Published" name="published" required>
              <Switch checkedChildren="Published" unCheckedChildren="Unpublished" />
            </Form.Item>
          </Col>

          <Col xs={0} xl={12} xxl={14}>
            <Form.Item label="Markdown" className="!mb-0">
              <Container className="dark:bg-[#141414]">
                <Markdown
                  className="overflow-y-auto"
                  style={useMemo(() => ({ height: (appStore.size?.height ?? 0) - 194 }), [appStore.size?.height])}
                >
                  {content}
                </Markdown>
              </Container>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export { DrawerUpdate }
