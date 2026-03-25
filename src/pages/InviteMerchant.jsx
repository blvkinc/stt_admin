import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Building, 
  Phone, 
  MapPin, 
  Send, 
  Copy,
  CheckCircle,
  AlertCircle,
  Plus,
  X
} from 'lucide-react'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'

const InviteMerchant = () => {
  const { merchant, isMerchantAuthenticated } = useMerchant()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [inviteType, setInviteType] = useState('single')

  // Check authentication
  if (!isMerchantAuthenticated) {
    return <Navigate to="/admin/auth" replace />
  }
  
  if (merchant?.role !== 'super_admin') {
    return <Navigate to="/admin/auth" replace />
  }

  const [singleInvite, setSingleInvite] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    expectedVenues: 1,
    message: ''
  })

  const [bulkInvites, setBulkInvites] = useState([
    { businessName: '', contactName: '', email: '', phone: '', location: '', category: '' }
  ])

  const categories = [
    'Fine Dining',
    'Casual Dining',
    'Rooftop Bar',
    'Beach Club',
    'Sports Bar',
    'Night Club',
    'Cafe',
    'Fast Food',
    'Food Court'
  ]

  const handleSingleInviteChange = (e) => {
    setSingleInvite({
      ...singleInvite,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleBulkInviteChange = (index, field, value) => {
    const updated = bulkInvites.map((invite, i) => 
      i === index ? { ...invite, [field]: value } : invite
    )
    setBulkInvites(updated)
  }

  const addBulkInvite = () => {
    setBulkInvites([
      ...bulkInvites,
      { businessName: '', contactName: '', email: '', phone: '', location: '', category: '' }
    ])
  }

  const removeBulkInvite = (index) => {
    if (bulkInvites.length > 1) {
      setBulkInvites(bulkInvites.filter((_, i) => i !== index))
    }
  }

  const handleSingleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!singleInvite.businessName || !singleInvite.email || !singleInvite.contactName) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(`Invitation sent successfully to ${singleInvite.email}!`)
      setSingleInvite({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        location: '',
        category: '',
        expectedVenues: 1,
        message: ''
      })
    } catch (err) {
      setError('Failed to send invitation. Please try again.')
    }

    setLoading(false)
  }

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validInvites = bulkInvites.filter(invite => 
      invite.businessName && invite.email && invite.contactName
    )

    if (validInvites.length === 0) {
      setError('Please fill in at least one complete invitation')
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(`${validInvites.length} invitations sent successfully!`)
      setBulkInvites([
        { businessName: '', contactName: '', email: '', phone: '', location: '', category: '' }
      ])
    } catch (err) {
      setError('Failed to send invitations. Please try again.')
    }

    setLoading(false)
  }

  return (
    <SuperAdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link 
            to="/admin/merchants" 
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-red-500 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Merchants</span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Invite Merchants</h1>
          <p className="text-neutral-600">Send invitations to potential merchant partners</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Invite Type Selection */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Invitation Type</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setInviteType('single')}
              className={`flex-1 p-4 border-2 rounded-xl transition-colors ${
                inviteType === 'single'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Single Invitation</div>
                <div className="text-sm text-neutral-600">Invite one merchant at a time</div>
              </div>
            </button>
            
            <button
              onClick={() => setInviteType('bulk')}
              className={`flex-1 p-4 border-2 rounded-xl transition-colors ${
                inviteType === 'bulk'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="text-center">
                <Building className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Bulk Invitations</div>
                <div className="text-sm text-neutral-600">Invite multiple merchants</div>
              </div>
            </button>
          </div>
        </div>

        {/* Single Invitation Form */}
        {inviteType === 'single' && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-800">Single Merchant Invitation</h2>
            </div>
            
            <form onSubmit={handleSingleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="businessName"
                      value={singleInvite.businessName}
                      onChange={handleSingleInviteChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                      placeholder="Restaurant or venue name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="contactName"
                      value={singleInvite.contactName}
                      onChange={handleSingleInviteChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                      placeholder="Manager or owner name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={singleInvite.email}
                      onChange={handleSingleInviteChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                      placeholder="contact@business.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={singleInvite.phone}
                      onChange={handleSingleInviteChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                      placeholder="+971 4 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="location"
                      value={singleInvite.location}
                      onChange={handleSingleInviteChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                      placeholder="Dubai, UAE"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={singleInvite.category}
                    onChange={handleSingleInviteChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={singleInvite.message}
                  onChange={handleSingleInviteChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none resize-none"
                  placeholder="Add a personal message to the invitation..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Link to="/admin/merchants" className="btn-secondary px-6 py-2 flex items-center">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bulk Invitation Form */}
        {inviteType === 'bulk' && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-800">Bulk Merchant Invitations</h2>
                <button
                  type="button"
                  onClick={addBulkInvite}
                  className="btn-secondary flex items-center space-x-2 px-4 py-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Another</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleBulkSubmit} className="p-6 space-y-6">
              <div className="space-y-6">
                {bulkInvites.map((invite, index) => (
                  <div key={index} className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-neutral-800">Invitation {index + 1}</h3>
                      {bulkInvites.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBulkInvite(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={invite.businessName}
                          onChange={(e) => handleBulkInviteChange(index, 'businessName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                          placeholder="Business name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Contact Name *
                        </label>
                        <input
                          type="text"
                          value={invite.contactName}
                          onChange={(e) => handleBulkInviteChange(index, 'contactName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                          placeholder="Contact person"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={invite.email}
                          onChange={(e) => handleBulkInviteChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                          placeholder="email@business.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={invite.phone}
                          onChange={(e) => handleBulkInviteChange(index, 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                          placeholder="+971 4 123 4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={invite.location}
                          onChange={(e) => handleBulkInviteChange(index, 'location', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                          placeholder="Dubai, UAE"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Category
                        </label>
                        <select
                          value={invite.category}
                          onChange={(e) => handleBulkInviteChange(index, 'category', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <Link to="/admin/merchants" className="btn-secondary px-6 py-2 flex items-center">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Sending...' : `Send ${bulkInvites.length} Invitations`}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}

export default InviteMerchant
