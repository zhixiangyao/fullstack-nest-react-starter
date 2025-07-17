import type { Dispatch } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Button, Modal } from 'antd'
import { Markdown } from 'markdown'

const content = `
[project]: https://github.com/zhixiangyao/fullstack-nest-react-starter
[zhixiangyao]: https://github.com/zhixiangyao
[dayjs]: https://github.com/iamkun/dayjs/
[ts]: https://github.com/microsoft/TypeScript
[nestjs]: https://github.com/nestjs/nest
[react]: https://github.com/facebook/react
[vite]: https://github.com/vitejs/vite
[xyflow]: https://github.com/xyflow/xyflow
[remark]: https://github.com/remarkjs/remark
[ahooks]: https://github.com/alibaba/hooks
[antd]: https://github.com/ant-design/ant-design
[prisma]: https://github.com/prisma/prisma
[rxjs]: https://github.com/ReactiveX/rxjs
[zustand]: https://github.com/pmndrs/zustand
[tailwindcss]: https://github.com/tailwindlabs/tailwindcss
[react-router]: https://github.com/remix-run/react-router
[postgres]: https://github.com/postgres/postgres

- [Github: fullstack-nest-react-starter][project]
- [Author: zhixiangyao][zhixiangyao]

| Type | Packages |
| --: | :-: |
| Common | [\`Dayjs\`][dayjs] / [\`TypeScript\`][ts] |
| Api Service | [\`Nestjs\`][nestjs] / [\`Prisma\`][prisma] / [\`PostgreSQL\`][postgres] / [\`Rxjs\`][rxjs] |
| Dashboard | [\`React\`][react] / [\`React Router\`][react-router] / [\`React Flow\`][xyflow] / [\`Zustand\`][zustand] / [\`Antd\`][antd] / [\`Ahooks\`][ahooks] / [\`Remark\`][remark] / [\`Tailwindcss\`][tailwindcss] / [\`Vite\`][vite] |
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
