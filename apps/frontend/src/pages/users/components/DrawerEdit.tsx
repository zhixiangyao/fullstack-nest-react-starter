import type { FormProps } from 'antd'
import type { TUseDrawerEditReturnType } from '../hooks/useDrawerEdit'
import type { User } from '~/fetchers'
import { Button, Drawer, Form, Input, Switch } from 'antd'

const formItemLayout: FormProps = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

interface Props {
  user: TUseDrawerEditReturnType['user']
  form: TUseDrawerEditReturnType['form']
  open: TUseDrawerEditReturnType['open']
  loading: TUseDrawerEditReturnType['loading']
  loadingConfirm: TUseDrawerEditReturnType['loadingConfirm']
  handleClose: TUseDrawerEditReturnType['handleClose']
  handleFinish: TUseDrawerEditReturnType['handleFinish']
}

function DrawerEdit(props: Props) {
  const { user, form, open, loading, loadingConfirm } = props
  const { handleClose, handleFinish } = props

  return (
    <Drawer
      width={700}
      title="Edit User"
      placement="right"
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
      <Form<User>
        {...formItemLayout}
        name="user-edit"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loadingConfirm}
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
