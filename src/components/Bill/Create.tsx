import { Button } from 'antd'
import React from 'react'

import { Category } from '../AccountBank'

import '../AccountBank.scss'

type Props = {
  categories: Category[]
}

const BillCreate: React.FunctionComponent<Props> = (props): JSX.Element => {
  return <Button type="primary">Create new bill</Button>
}

export default BillCreate
