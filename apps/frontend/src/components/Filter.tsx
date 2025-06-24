import type { FormInstance } from 'antd'
import type { NamePath } from 'antd/es/form/interface'
import type { Ref } from 'react'
import { Button, Form, Input } from 'antd'
import React from 'react'

interface TField<T> {
  type: 'input'
  name: keyof T
  label: string
}

interface Props<T> {
  form?: FormInstance<T>
  fields?: TField<T>[]
  loading?: boolean
  customRef?: Ref<HTMLDivElement>
  handleFinish?: (params: T) => void
  handleReset?: () => void
}

function Filter<T>(props: Props<T>) {
  return (
    <div ref={props.customRef} className="box-border pb-4 w-full">
      <Form<T>
        name="user-list"
        autoComplete="off"
        layout="inline"
        form={props.form}
        onFinish={props.handleFinish}
        disabled={props.loading}
      >
        {props.fields?.map((field) => {
          switch (field.type) {
            case 'input': {
              return (
                <Form.Item<T> name={field.name as NamePath<T>} label={field.label} key={field.name.toString()}>
                  <Input type="text" placeholder={`Please enter ${field.label}`} />
                </Form.Item>
              )
            }

            default: {
              return null
            }
          }
        })}

        <Form.Item<T>>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit">
              Query
            </Button>

            <Button onClick={props.handleReset}>Reset</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export { Filter }
export type { TField }
