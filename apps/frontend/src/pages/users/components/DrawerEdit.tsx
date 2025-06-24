import type { FormInstance } from 'antd'
import type { User } from '~/fetchers'
import { Button, Drawer, Form, Input, Switch } from 'antd'
import React from 'react'

export type TFieldUser = User

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
  user?: User
  form: FormInstance<User>
  open: boolean
  loading: boolean
  loadingUpdate: boolean
  handleClose: () => void
  handleFinish: (values: User) => Promise<void>
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
      <Form<TFieldUser>
        {...formItemLayout}
        name="user-edit"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loadingUpdate}
      >
        <Form.Item<TFieldUser> label="Username" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item<TFieldUser> label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item<TFieldUser> label="Active" name="isActive">
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
