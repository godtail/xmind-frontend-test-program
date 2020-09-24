import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card } from 'antd'

import BillList from './Bill/List'
import BillChart from './Bill/Chart'
import BillFilter, { FilterChangeEvent } from './Bill/Filter'
import BillCreate, { BillCreateEvent } from './Bill/Create'

import simpleCSVParser, { ColumnType } from '../utils/simpleCSVParser'

import './AccountBank.scss'

export type Category = {
  id: string
  type: number
  name: string
}

export type Bill = {
  time: Date
  type: number
  category: string
  amount: number
}

// simple implement, next version use Redux
const AccountBank: React.FunctionComponent = (): JSX.Element => {
  const [bills, setBills] = useState<Bill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  // filter
  const [filter, setFilter] = useState<FilterChangeEvent>({
    month: null,
    category: null,
  })

  const fetchData = async () => {
    // user promise all to get two data async
    const rets = await Promise.all([
      fetch('/data/bills.csv').then((ret) => ret.text()),
      fetch('/data/categories.csv').then((ret) => ret.text()),
    ])

    const bills: Bill[] = simpleCSVParser.parseCsv(rets[0], {
      type: ColumnType.Integer,
      time: ColumnType.Timestamp,
      amount: ColumnType.Integer,
    }) as Bill[]
    // order by time desc
    bills.sort((bill1, bill2) =>
      bill1.time.getTime() < bill2.time.getTime() ? 1 : -1
    )

    const categories: Category[] = simpleCSVParser.parseCsv(rets[1], {
      type: ColumnType.Integer,
    }) as Category[]

    // set state
    setBills(bills)
    setCategories(categories)
  }

  // fetch data once
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // filter and sort bills
  const resultBills = () => {
    const { month, category } = filter
    return bills
      .filter((bill) => {
        if (month && moment(bill.time).format('YYYY-MM') !== month) {
          return false
        }
        if (category && bill.category !== category) {
          return false
        }
        return true
      })
      .sort((bill1, bill2) =>
        bill1.time.getTime() < bill2.time.getTime() ? 1 : -1
      )
  }

  const createNewBill = (billCreateEvent: BillCreateEvent) => {
    const bill: Bill = {} as Bill
    bill.time = new Date()
    bill.type = billCreateEvent.type
    bill.category = billCreateEvent.category
    bill.amount = billCreateEvent.amount
    setBills(bills.concat(bill))
  }

  return (
    <div className="account-bank">
      <h1 className="account-bank-title">A Simple Account Bank</h1>
      <div className="account-bank-body">
        <Card className="account-bank-list">
          <div className="account-bank-list-action">
            <BillFilter
              onChange={(fileterChangeEvent) => setFilter(fileterChangeEvent)}
              categories={categories}
            ></BillFilter>
            <BillCreate
              onCreate={createNewBill}
              categories={categories}
            ></BillCreate>
          </div>
          <BillList categories={categories} bills={resultBills()}></BillList>
        </Card>
        <div className="account-bank-chart">
          <BillChart categories={categories} bills={resultBills()}></BillChart>
        </div>
      </div>
    </div>
  )
}

export default AccountBank
