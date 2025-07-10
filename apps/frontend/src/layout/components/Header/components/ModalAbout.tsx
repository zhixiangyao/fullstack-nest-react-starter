import type { Dispatch } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Button, Modal } from 'antd'
import { Markdown } from '~/components/Markdown'

const content = `
- [Github: fullstack-nest-react-starter](https://github.com/zhixiangyao/fullstack-nest-react-starter)
- [Author: zhixiangyao](https://github.com/zhixiangyao)
- Tech
  - Backend
    - Nestjs
    - Prisma
    - PostgreSQL
  - Backend
    - React
    - Antd
    - Ahooks
    - React Flow
    - Zustand
    - Remark
    - Tailwindcss
    - Vite
`

interface Props {
  open: boolean
  setOpen: Dispatch<boolean>
}

function ModalAbout({ open, setOpen }: Props) {
  const handleCancel = useMemoizedFn(() => {
    setOpen(false)
  })

  return (
    <Modal
      title="About"
      open={open}
      maskClosable={false}
      keyboard={false}
      onCancel={handleCancel}
      footer={
        <Button type="primary" onClick={handleCancel}>Ok</Button>
      }
    >
      <Markdown>
        {content}
      </Markdown>
    </Modal>
  )
}

export { ModalAbout }
