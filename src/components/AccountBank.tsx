import React, { useState, useEffect } from 'react'

import BillList from './Bill/List'
import BillChart from './Bill/Chart'
import BillFilter from './Bill/Filter'
import BillCreate from './Bill/Create'

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

const AccountBank: React.FunctionComponent = (): JSX.Element => {
  const [bills, setBills] = useState<Bill[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // record org bills
  let orgBills: Bill[] = []

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

    const categories: Category[] = simpleCSVParser.parseCsv(rets[1], {
      type: ColumnType.Integer,
    }) as Category[]

    // set category map
    const categoryMap: Map<string, Category> = new Map<string, Category>()
    categories.forEach((category) => categoryMap.set(category.id, category))

    // combine bills
    bills.forEach((bill) => {
      const category = categoryMap.get(bill.category) as Category
      bill.category = category.name
      bill.type = category.type
    })

    // set state
    setCategories(categories)
    orgBills = bills
    setBills(orgBills)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="account-bank">
      <h2 className="account-bank-title">A Simple Account Bank</h2>
      <div className="account-bank-body">
        <div className="account-bank-body-action">
          <BillFilter categories={categories}></BillFilter>
          <BillCreate categories={categories}></BillCreate>
        </div>
        <div className="account-bank-body-content">
          <BillList bills={bills}></BillList>
          <BillChart></BillChart>
        </div>
      </div>
    </div>
  )
}

export default AccountBank
