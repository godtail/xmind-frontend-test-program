import React, { useState, useEffect } from 'react'
import moment from 'moment'

import BillList from './Bill/List'
import BillChart from './Bill/Chart'
import BillFilter, { FilterChangeEvent } from './Bill/Filter'
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
  categoryText?: string
  amount: number
}

const AccountBank: React.FunctionComponent = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  // filtered bills
  const [filteredBills, setFilteredBills] = useState<Bill[]>([])

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

    // set category map
    const categoryMap: Map<string, Category> = new Map<string, Category>()
    categories.forEach((category) => categoryMap.set(category.id, category))

    // combine bills
    bills.forEach((bill) => {
      const category = categoryMap.get(bill.category) as Category
      bill.categoryText = category.name
      // fix type
      bill.type = category.type
    })

    // set state
    setCategories(categories)
    setBills(bills)
    setFilteredBills(bills)
  }

  // fetch data once
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterChange = (fileterChangeEvent: FilterChangeEvent) => {
    const { month, category } = fileterChangeEvent
    console.log(month, category)
    const filterdBills = bills.filter((bill) => {
      if (month && moment(bill.time).format('YYYY-MM') !== month) {
        return false
      }
      if (category && bill.category !== category) {
        return false
      }
      return true
    })
    setFilteredBills(filterdBills)
  }

  return (
    <div className="account-bank">
      <h2 className="account-bank-title">A Simple Account Bank</h2>
      <div className="account-bank-body">
        <div className="account-bank-body-action">
          <BillFilter
            onChange={filterChange}
            categories={categories}
          ></BillFilter>
          <BillCreate categories={categories}></BillCreate>
        </div>
        <div className="account-bank-body-content">
          <BillList bills={filteredBills}></BillList>
          <BillChart></BillChart>
        </div>
      </div>
    </div>
  )
}

export default AccountBank
