import React from 'react'
import { Table, Tag } from 'antd'
import moment from 'moment'

import { Bill } from '../AccountBank'
import '../AccountBank.scss'

type Props = {
  bills: Bill[]
}

const BillList: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { bills } = props

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
      dataIndex: 'categoryText',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
  ]

  return (
    <div className="account-bank-list">
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
