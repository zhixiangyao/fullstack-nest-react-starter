import type { SelectProps } from 'antd'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import { useMemo } from 'react'

import * as fetchers from '~/fetchers'

interface Props extends Pick<SelectProps, 'value' | 'id' | 'onChange' | 'placeholder'> {}

function SelectTags(props: Props) {
  const { data, loading } = useRequest(fetchers.blogFindAllTags, { cacheKey: 'cacheKey-blogFindAllTags' })
  const options = useMemo(() => data?.data.list.map(tag => ({ label: tag, value: tag })) ?? [], [data?.data.list])

  return (
    <Select
      allowClear
      mode="multiple"
      id={props.id}
      loading={loading}
      options={options}
      placeholder={props.placeholder ?? 'Please select Tags'}
      value={props.value}
      onChange={props.onChange}
    />
  )
}

export { SelectTags }
