import React from 'react'
import F2 from '@antv/f2/lib/index-all'

import { Bill, Category } from '../AccountBank'
import '../AccountBank.scss'
import { Card } from 'antd'

type Props = {
  bills: Bill[]
  categories: Category[]
}

const BillChart: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { bills, categories } = props

  const initCharts = () => {
    // init when component rendered
    setTimeout(() => {
      initTotal()
      initCategory()
    }, 0)
  }

  const initTotal = () => {
    let totalIncome: number = 0
    let totalExpenditure: number = 0
    bills.forEach((bill) =>
      bill.type === 1
        ? (totalIncome += bill.amount)
        : (totalExpenditure += bill.amount)
    )
    const data = [
      {
        type: 'Income',
        amount: totalIncome,
      },
      {
        type: 'Expenditure',
        amount: totalExpenditure,
      },
    ]

    const chart = new F2.Chart({
      id: 'total',
      pixelRatio: window.devicePixelRatio,
    })

    chart.source(data)
    chart.legend(false)
    chart
      .interval()
      .position('type*amount')
      .color('type', ['#FB9021', '#53C41A'])

    chart.render()
  }

  const initCategory = () => {
    // sum every category
    const categoryMapping: { [key: string]: number } = {}
    bills.forEach((bill) => {
      if (!categoryMapping[bill.category]) {
        categoryMapping[bill.category] = 0
      }
      categoryMapping[bill.category] += bill.amount
    })
    const data = []
    for (let categoryId in categoryMapping) {
      data.push({
        category: categories.find((category) => category.id === categoryId)
          ?.name,
        amount: categoryMapping[categoryId],
        const: 'const',
      })
    }
    const chart = new F2.Chart({
      id: 'category',
      pixelRatio: window.devicePixelRatio,
    })

    chart.source(data)
    chart.coord('polar', {
      transposed: true,
      radius: 0.6,
      innerRadius: 0.5,
    })
    chart.legend(false)
    chart.axis(false)
    chart.tooltip(false)

    chart.pieLabel({
      sidePadding: 40,
      label1: function label1(data, color) {
        return {
          text: data.category,
          fill: color,
        }
      },
      label2: function label2(data) {
        return {
          text:
            '$' +
            String(Math.floor(data.amount * 100) / 100).replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ','
            ),
          fill: '#808080',
          fontWeight: 'bold',
        }
      },
    })

    chart.interval().position('const*amount').color('category').adjust('stack')
    chart.render()
  }

  initCharts()

  return (
    <>
      <Card title="Income/Expenditure total">
        <canvas id="total"></canvas>
      </Card>
      <Card style={{ marginTop: 10 }} title="Category percent">
        <canvas id="category"></canvas>
      </Card>
    </>
  )
}

export default BillChart
