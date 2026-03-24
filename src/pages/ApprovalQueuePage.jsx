import React from 'react'
import { Navigate } from 'react-router-dom'

const ApprovalQueuePage = () => {
  return <Navigate to="/approvals?status=pending" replace />
}

export default ApprovalQueuePage
