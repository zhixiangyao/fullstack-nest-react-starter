import type { FormInstance, FormItemProps, InputProps, RowProps, SelectProps, SwitchProps } from 'antd'
import type { Ref } from 'react'
import { DownOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd'
import React, { useMemo, useState } from 'react'

interface TFieldBase<T> {
  key: string
  name: keyof T
  label: string
}

export type TField<T extends object>
  = | (TFieldBase<T> & {
    type: 'input'
    props?: InputProps
  })
  | (TFieldBase<T> & {
    type: 'select'
    props?: SelectProps
  })
  | (TFieldBase<T> & {
    type: 'switch'
    props?: SwitchProps
  })
  | (TFieldBase<T> & {
    type: 'custom'
    component: React.ReactElement<{
      id?: string
      value?: unknown
      onChange?: (value?: unknown) => void
    }>
  })

const gutter: RowProps['gutter'] = [0, 8]

interface Props<T extends object> {
  name: string
  form?: FormInstance<T>
  fields?: TField<T>[]
  loading?: boolean
  customRef?: Ref<HTMLDivElement>
  expandCount?: number
  extra?: React.ReactNode
  handleFinish?: (params: T) => void
  handleReset?: () => void
}

function Filter<T extends object>(props: Props<T>) {
  const { name, form, fields, loading, customRef, expandCount = 4, extra } = props
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
                    <Input allowClear type="text" placeholder={`Please enter ${field.label}`} {...field.props} />
                  </Form.Item>
                </Col>,
              )
            }
            break
          }
          case 'select': {
            if (expand === true || index < expandCount) {
              acc.push(
                <Col span={6} key={field.key}>
                  <Form.Item<T> name={field.name as FormItemProps<T>['name']} label={field.label}>
                    <Select allowClear placeholder={`Please select ${field.label}`} {...field.props} />
                  </Form.Item>
                </Col>,
              )
            }
            break
          }
          case 'switch': {
            if (expand === true || index < expandCount) {
              acc.push(
                <Col span={6} key={field.key}>
                  <Form.Item<T> name={field.name as FormItemProps<T>['name']} label={field.label}>
                    <Switch {...field.props} />
                  </Form.Item>
                </Col>,
              )
            }
            break
          }
          case 'custom': {
            if (expand === true || index < expandCount) {
              acc.push(
                <Col span={6} key={field.key}>
                  <Form.Item<T> name={field.name as FormItemProps<T>['name']} label={field.label}>
                    {field.component}
                  </Form.Item>
                </Col>,
              )
            }
            break
          }
        }

        return acc
      }, []) ?? [],
    [expand, expandCount, fields],
  )

  const handleCollapse = useMemoizedFn(() => setExpand(!expand))

  return (
    <div ref={customRef} className="box-border pb-4 w-full">
      <Form<T> name={name} autoComplete="off" layout="inline" form={form} onFinish={handleFinish} disabled={loading}>
        {Cols.length > 0 && (
          <Row className="w-full" gutter={gutter}>
            {Cols}
          </Row>
        )}

        <Row className="w-full mt-2">
          <Col span={24}>
            <Form.Item<T>>
              <div className="flex gap-2">
                <Button className="min-w-24" type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Query
                </Button>

                {fields && fields.length > 0 && (
                  <Button className="min-w-24" onClick={handleReset} icon={<UndoOutlined />}>
                    Reset
                  </Button>
                )}

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
