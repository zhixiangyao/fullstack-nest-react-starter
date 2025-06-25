import type { TUseDrawerEditReturnType } from '../hooks/useDrawerEdit'
import type { User } from '~/fetchers'
import { Button, Drawer, Form, Input, Switch } from 'antd'
import React from 'react'

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
  user: TUseDrawerEditReturnType['user']
  form: TUseDrawerEditReturnType['form']
  open: TUseDrawerEditReturnType['open']
  loading: TUseDrawerEditReturnType['loading']
  loadingUpdate: TUseDrawerEditReturnType['loadingUpdate']
  handleClose: TUseDrawerEditReturnType['handleClose']
  handleFinish: TUseDrawerEditReturnType['handleFinish']
}

function DrawerEdit(props: Props) {
  const { user, form, open, loading, loadingUpdate } = props
  const { handleClose, handleFinish } = props

  return (
    <Drawer
      width={700}
      title="Edit User"
      placement="right"
      onClose={handleClose}
      open={open}
      loading={loading}
      footer={(
        <Button type="primary" onClick={form.submit} loading={loadingUpdate}>
          Confirm
        </Button>
      )}
    >
      <Form<User>
        {...formItemLayout}
        name="user-edit"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loadingUpdate}
      >
        <Form.Item<User> label="Username" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item<User> label="Email" name="email">
          <Input showCount placeholder="Please input the Email" />
        </Form.Item>

        <Form.Item<User> label="Active" name="isActive">
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            disabled={user?.roles.map(role => role.name).includes('ADMIN')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { DrawerEdit }
