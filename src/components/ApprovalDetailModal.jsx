import React, { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Typography
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input

const ApprovalDetailModal = ({ isOpen, onClose, item, onApprove, onReject }) => {
  const [loadingAction, setLoadingAction] = useState(null)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  const canAct = item && (item.status === 'pending' || item.status === 'under_review')

  const statusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="warning">Pending</Tag>
      case 'under_review':
        return <Tag color="processing">Under Review</Tag>
      case 'approved':
        return <Tag color="success">Approved</Tag>
      case 'rejected':
        return <Tag color="error">Rejected</Tag>
      default:
        return <Tag>Unknown</Tag>
    }
  }

  const priorityTag = (priority) => {
    switch (priority) {
      case 'critical':
        return <Tag color="red">Critical</Tag>
      case 'high':
        return <Tag color="orange">High</Tag>
      case 'medium':
        return <Tag color="gold">Medium</Tag>
      case 'low':
        return <Tag color="default">Low</Tag>
      default:
        return <Tag>Normal</Tag>
    }
  }

  const formattedDate = useMemo(() => {
    if (!item?.submittedAt) return 'N/A'
    return new Date(item.submittedAt).toLocaleString()
  }, [item?.submittedAt])

  const handleApprove = async () => {
    if (!item) return
    setLoadingAction('approve')
    try {
      await onApprove(item.id)
      onClose()
    } finally {
      setLoadingAction(null)
    }
  }

  const handleReject = async () => {
    if (!item) return
    if (!rejectionReason.trim()) {
      setShowValidation(true)
      return
    }
    setLoadingAction('reject')
    try {
      await onReject(item.id, rejectionReason.trim())
      onClose()
      setShowRejectForm(false)
      setRejectionReason('')
      setShowValidation(false)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleClose = () => {
    setShowRejectForm(false)
    setRejectionReason('')
    setShowValidation(false)
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={item ? item.title : 'Approval Detail'}
      width={900}
      footer={null}
      destroyOnClose
    >
      {!item ? (
        <Alert type="warning" message="No approval item selected" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Type">{item.type}</Descriptions.Item>
            <Descriptions.Item label="Category">{item.category || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Submitted By">{item.submittedBy}</Descriptions.Item>
            <Descriptions.Item label="Submitted At">{formattedDate}</Descriptions.Item>
            <Descriptions.Item label="Priority">{priorityTag(item.priority)}</Descriptions.Item>
            <Descriptions.Item label="Status">{statusTag(item.status)}</Descriptions.Item>
            {item.location && (
              <Descriptions.Item label="Location" span={2}>{item.location}</Descriptions.Item>
            )}
          </Descriptions>

          {item.description && (
            <Card size="small" title="Description">
              <Text>{item.description}</Text>
            </Card>
          )}

          {item.details && (
            <Card size="small" title="Venue Details">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Capacity">{item.details.capacity || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Cuisine">{item.details.cuisineType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Price Range">{item.details.priceRange || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Hours">{item.details.operatingHours || 'N/A'}</Descriptions.Item>
              </Descriptions>
              {Array.isArray(item.details.specialFeatures) && item.details.specialFeatures.length > 0 && (
                <>
                  <Divider />
                  <Space size={[8, 8]} wrap>
                    {item.details.specialFeatures.map((feature, index) => (
                      <Tag key={index}>{feature}</Tag>
                    ))}
                  </Space>
                </>
              )}
            </Card>
          )}

          {Array.isArray(item.packages) && item.packages.length > 0 && (
            <Card size="small" title="Packages">
              <List
                dataSource={item.packages}
                renderItem={(pkg, index) => (
                  <List.Item key={`${pkg.name}-${index}`}>
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Text strong>{pkg.name}</Text>
                        <Text strong>AED {pkg.price}</Text>
                      </Space>
                      {Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                        <Text type="secondary">{pkg.includes.join(', ')}</Text>
                      )}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {Array.isArray(item.documents) && item.documents.length > 0 && (
            <Card size="small" title="Documents">
              <Space size={[8, 8]} wrap>
                {item.documents.map((doc, index) => (
                  <Tag key={`${doc}-${index}`} icon={<FileTextOutlined />}>{doc}</Tag>
                ))}
              </Space>
            </Card>
          )}

          {item.rejectionReason && (
            <Alert
              type="error"
              message="Rejection Reason"
              description={item.rejectionReason}
              showIcon
            />
          )}

          {showRejectForm && (
            <Card size="small" title="Rejection Reason">
              <TextArea
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value)
                  if (showValidation) setShowValidation(false)
                }}
                placeholder="Provide a clear reason for rejection."
              />
              {showValidation && (
                <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                  Please add a rejection reason.
                </Text>
              )}
            </Card>
          )}

          {canAct && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                {showRejectForm ? (
                  <>
                    <Button onClick={() => setShowRejectForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      loading={loadingAction === 'reject'}
                      onClick={handleReject}
                    >
                      Confirm Rejection
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => setShowRejectForm(true)}
                    >
                      Reject
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      loading={loadingAction === 'approve'}
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </Space>
            </div>
          )}
        </Space>
      )}
    </Modal>
  )
}

export default ApprovalDetailModal
