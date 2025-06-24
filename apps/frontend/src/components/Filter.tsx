import type { FormInstance, FormItemProps, RowProps } from 'antd'
import type { Ref } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { Button, Col, Form, Input, Row } from 'antd'
import React, { useMemo, useState } from 'react'

export interface TField<T> {
  type: 'input'
  key: string
  name: keyof T
  label: string
}

const gutter: RowProps['gutter'] = [0, 8]

interface Props<T> {
  form?: FormInstance<T>
  fields?: TField<T>[]
  loading?: boolean
  customRef?: Ref<HTMLDivElement>
  expandCount?: number
  extra?: React.ReactNode
  handleFinish?: (params: T) => void
  handleReset?: () => void
}

function Filter<T>(props: Props<T>) {
  const { form, fields, loading, customRef, expandCount = 4, extra } = props
  const { handleFinish, handleReset } = props
  const [expand, setExpand] = useState(false)
  const Cols = useMemo(
    () =>
      fields?.reduce<React.ReactNode[]>((acc, field, index) => {
        switch (field.type) {
          case 'input': {
            if (expand === true || index < expandCount) {
              acc.push(
                <Col span={6} key={field.key}>
                  <Form.Item<T> name={field.name as FormItemProps<T>['name']} label={field.label}>
                    <Input type="text" placeholder={`Please enter ${field.label}`} />
                  </Form.Item>
                </Col>,
              )
            }
          }
        }

        return acc
      }, []) ?? [],
    [expand, expandCount, fields],
  )
  const handleCollapse = useMemoizedFn(() => setExpand(!expand))

  return (
    <div ref={customRef} className="box-border pb-4 w-full">
      <Form<T>
        name="user-list"
        autoComplete="off"
        layout="inline"
        form={form}
        onFinish={handleFinish}
        disabled={loading}
      >
        {Cols.length > 0 && (
          <Row className="w-full" gutter={gutter}>
            {Cols}
          </Row>
        )}

        <Row className="w-full mt-2">
          <Col span={24}>
            <Form.Item<T>>
              <div className="flex gap-2">
                <Button className="min-w-24" type="primary" htmlType="submit">
                  Query
                </Button>

                <Button className="min-w-24" onClick={handleReset}>
                  Reset
                </Button>

                {extra}

                {fields && fields.length > expandCount && (
                  <Button
                    className="min-w-24"
                    type="text"
                    icon={<DownOutlined rotate={expand ? 180 : 0} />}
                    onClick={handleCollapse}
                  >
                    Collapse
                  </Button>
                )}

              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export { Filter }
