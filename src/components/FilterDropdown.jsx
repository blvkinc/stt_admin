import React, { useState } from 'react'
import { Popover, Button, Form, Select, DatePicker, InputNumber, Space, Divider } from 'antd'
import { Filter } from 'lucide-react'

const { RangePicker } = DatePicker
const { Option } = Select

const FilterDropdown = ({ filters = [], onApply, onClear }) => {
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen)
    }

    const handleApply = (values) => {
        onApply(values)
        setOpen(false)
    }

    const handleClear = () => {
        form.resetFields()
        onClear()
        setOpen(false)
    }

    const content = (
        <div style={{ width: 320, padding: '8px 0' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleApply}
            >
                {filters.map((filter) => (
                    <Form.Item
                        key={filter.key}
                        name={filter.key}
                        label={<span className="font-medium text-neutral-700">{filter.label}</span>}
                        style={{ marginBottom: 16 }}
                    >
                        {filter.type === 'select' && (
                            <Select placeholder={`Select ${filter.label}`} allowClear>
                                {filter.options.map(opt => (
                                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>
                        )}
                        {filter.type === 'dateRange' && (
                            <RangePicker style={{ width: '100%' }} />
                        )}
                        {filter.type === 'numberRange' && (
                            <Space>
                                <InputNumber placeholder="Min" style={{ width: 140 }} />
                                <span className="text-neutral-400">-</span>
                                <InputNumber placeholder="Max" style={{ width: 140 }} />
                            </Space>
                        )}
                    </Form.Item>
                ))}

                <Divider style={{ margin: '12px 0' }} />

                <div className="flex justify-end space-x-3">
                    <Button onClick={handleClear} size="small">
                        Clear
                    </Button>
                    <Button type="primary" htmlType="submit" size="small" className="btn-primary">
                        Apply Filters
                    </Button>
                </div>
            </Form>
        </div>
    )

    return (
        <Popover
            content={content}
            title={<span className="font-bold text-neutral-800">Advanced Filters</span>}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            placement="bottomRight"
        >
            <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>More Filters</span>
            </button>
        </Popover>
    )
}

export default FilterDropdown
