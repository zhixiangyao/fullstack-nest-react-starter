import type { InputRef } from 'antd'
import type { MotionProps } from 'motion/react'
import { PlusOutlined } from '@ant-design/icons'
import { Input, Tag } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const tagClassName = '!mr-0 !h-8 !text-sm !flex !items-center'
const exit: MotionProps['exit'] = { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
const initial: MotionProps['initial'] = { opacity: 0, scale: 0.8 }
const animate: MotionProps['animate'] = { opacity: 1, scale: 1 }

interface Props {
  id?: string
  value?: string[]
  placeholder?: string
  maxLength?: number
  onChange?: (value?: string[]) => void
}

function Tags(props: Props) {
  const { id, value, placeholder, maxLength } = props
  const { onChange } = props
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)

  const handleClose = (removedTag: string) => {
    const newTags = value?.filter(tag => tag !== removedTag)
    onChange?.(newTags)
  }

  const handleShowInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && !value?.includes(inputValue)) {
      onChange?.([...(value ?? []), inputValue])
    }
    setInputVisible(false)
    setInputValue('')
  }

  const handleIconClose = (e: React.MouseEvent<HTMLElement>, tag: string) => {
    e.preventDefault()
    handleClose(tag)
  }

  useEffect(() => void (inputVisible && inputRef.current?.focus()), [inputVisible])

  return (
    <div className="flex gap-2" id={id}>
      <AnimatePresence>
        {value?.map(tag => (
          <motion.div key={tag} initial={initial} animate={animate} exit={exit} layout>
            <Tag closable className={tagClassName} onClose={e => handleIconClose(e, tag)}>
              {tag}
            </Tag>
          </motion.div>
        ))}

        {(maxLength === void 0 || (value?.length ?? 0) < maxLength) && (
          <motion.div initial={initial} animate={animate} exit={exit} layout>
            {inputVisible
              ? (
                  <Input
                    ref={inputRef}
                    showCount
                    type="text"
                    minLength={2}
                    maxLength={10}
                    className="!w-36"
                    value={inputValue}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                )
              : (
                  <Tag className={clsx(tagClassName, '!w-36')} onClick={handleShowInput}>
                    <PlusOutlined />
                    <span>New Tag</span>
                  </Tag>
                )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Tags }
