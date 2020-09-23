import React, { useState } from 'react'
import { Space, DatePicker, Select } from 'antd'

import { Category } from '../AccountBank'
import '../AccountBank.scss'
import { Moment } from 'moment'

const { Option } = Select

// simple implement
export type FilterChangeEvent = {
  month: string | null
  category: string | null
}

type Props = {
  categories: Category[]
  onChange: (filterChangeEvent: FilterChangeEvent) => void
}

const BillFilter: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { categories, onChange } = props

  const [filterChangeEvent, setFilterChangeEvent] = useState<FilterChangeEvent>(
    { month: null, category: null }
  )

  const onMonthChange = (value: Moment | null) => {
    const newFilterChangeEvent = {
      category: filterChangeEvent.category,
      month: value?.format('YYYY-MM') ?? null,
    }
    onChange(newFilterChangeEvent)
    setFilterChangeEvent(newFilterChangeEvent)
  }

  const onCategoryChange = (value: string) => {
    const newFilterChangeEvent = {
      month: filterChangeEvent.month,
      category: value ?? null,
    }
    onChange(newFilterChangeEvent)
    setFilterChangeEvent(newFilterChangeEvent)
  }

  return (
    <Space>
      <DatePicker onChange={onMonthChange} inputReadOnly picker="month" />
      <Select
        onChange={onCategoryChange}
        allowClear
        placeholder="Select category"
        style={{ width: 200 }}
      >
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
