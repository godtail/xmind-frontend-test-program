import React, { useState, useEffect } from 'react'
import { Table, Tag } from 'antd'
import moment from 'moment'

import { Bill, Category } from '../AccountBank'
import '../AccountBank.scss'

type Props = {
  bills: Bill[]
  categories: Category[]
}

const BillList: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { bills, categories } = props
  // use category mapping to get data quickly
  const [categoriesMapping, setCategoriesMapping] = useState<
    Map<string, Category>
  >(new Map())

  const updateCategoriesMapping = () => {
    const categoriesMap: Map<string, Category> = new Map<string, Category>()
    categories.forEach((category) => categoriesMap.set(category.id, category))
    setCategoriesMapping(categoriesMap)
  }

  useEffect(() => {
    updateCategoriesMapping()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      render: (time: Date) => <div>{moment(time).format('YYYY-MM-DD')}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type: number) => (
        <Tag color={type === 1 ? 'green' : 'orange'}>
          {type === 1 ? 'Income' : 'Expenditure'}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category: string) => categoriesMapping.get(category)?.name,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
  ]

  return (
    <div className="account-bank-list-content">
      <Table
        // use a special key, in real scene source always has a id
        rowKey={(row) =>
          row.time.toString() + row.type + row.category + row.amount
        }
        bordered
        columns={columns}
        dataSource={bills}
      ></Table>
    </div>
  )
}

export default BillList
