import { Table } from 'antd'
import React from 'react'
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
      render: (time: Date) => {
        return <div>{moment(time).format('YYYY-MM-DD')}</div>
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
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
        rowKey={(row) => row.time.toString() + row.category + row.amount}
        bordered
        columns={columns}
        dataSource={bills}
      ></Table>
    </div>
  )
}

export default BillList
