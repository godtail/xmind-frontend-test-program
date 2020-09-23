import React from 'react'
import { Space, DatePicker, Select } from 'antd'

import { Category } from '../AccountBank'
import '../AccountBank.scss'

const { Option } = Select

type Props = {
  categories: Category[]
}

const BillFilter: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { categories } = props

  return (
    <Space>
      <DatePicker inputReadOnly picker="month" />
      <Select allowClear placeholder="Select category" style={{ width: 200 }}>
        {categories.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
    </Space>
  )
}

export default BillFilter
