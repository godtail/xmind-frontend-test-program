import React, { useState, useRef } from 'react'
import { Button, Modal, Form, Select, InputNumber, Radio } from 'antd'

import { Category } from '../AccountBank'
import '../AccountBank.scss'
import { FormInstance } from 'antd/lib/form'
import { RadioChangeEvent } from 'antd/lib/radio'

const { Option } = Select

export type BillCreateEvent = {
  type: number
  category: string
  amount: number
}

type Props = {
  categories: Category[]
  onCreate: (billCreateEvent: BillCreateEvent) => void
}

const BillCreate: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { categories, onCreate } = props
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  // render categories with type
  const [type, setType] = useState<number>(0)
  const formRef = useRef<FormInstance>(null)

  const [form] = Form.useForm()
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const createNewBill = async () => {
    try {
      await formRef.current?.validateFields()
      const values = formRef.current?.getFieldsValue()
      onCreate(values as BillCreateEvent)
      setIsShowModal(false)
      formRef.current?.resetFields()
    } catch (e) {}
  }

  return (
    <div>
      <Button onClick={() => setIsShowModal(true)} type="primary">
        Create new bill
      </Button>
      <Modal
        visible={isShowModal}
        onCancel={() => setIsShowModal(false)}
        onOk={createNewBill}
        title="Create new bill"
      >
        <Form ref={formRef} {...formLayout} form={form}>
          <Form.Item
            initialValue={0}
            rules={[{ required: true }]}
            name="type"
            label="Type"
          >
            <Radio.Group
              onChange={(event: RadioChangeEvent) =>
                setType(event.target.value as number)
              }
            >
              <Radio value={0}>Expenditure</Radio>
              <Radio value={1}>Income</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="category"
            label="Category"
          >
            <Select placeholder="Select category">
              {categories
                .filter((category) => category.type === type)
                .map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name="amount" label="Amount">
            <InputNumber min={1} precision={0}></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BillCreate
