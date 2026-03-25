import React, { useState, useEffect } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    Mail,
    User,
    Building,
    Phone,
    MapPin,
    Save,
    CheckCircle,
    AlertCircle,
    Trash2
} from 'lucide-react'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'

const EditMerchantPage = () => {
    const { id } = useParams()
    const { merchant, isMerchantAuthenticated } = useMerchant()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        location: '',
        category: '',
        status: 'Active',
        tier: 'Standard',
        commissionRate: 10,
        subscriptionType: 'Standard'
    })

    // Check authentication
    if (!isMerchantAuthenticated) {
        return <Navigate to="/admin/auth" replace />
    }

    if (merchant?.role !== 'super_admin') {
        return <Navigate to="/admin/auth" replace />
    }

    // Mock fetch data
    useEffect(() => {
        // In a real app, fetch merchant by ID here
        // Simulating fetch
        const fetchMerchant = async () => {
            setLoading(true)
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                // Mock data
                setFormData({
                    businessName: "Mock Business LLC",
                    contactName: "John Doe",
                    email: "john@example.com",
                    phone: "+971 50 123 4567",
                    location: "Dubai, UAE",
                    category: "Fine Dining",
                    status: "Active",
                    tier: "Premium",
                    commissionRate: 12.5,
                    subscriptionType: "Premium"
                })
            } catch (err) {
                setError('Failed to load merchant data')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchMerchant()
        }
    }, [id])

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (error) setError('')
        if (success) setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess('Merchant updated successfully!')
        } catch (err) {
            setError('Failed to update merchant. Please try again.')
        } finally {
            setLoading(false)
        }
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
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Edit Merchant</h1>
                            <p className="text-neutral-600">Update merchant details and account settings</p>
                        </div>
                        <button className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
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

                {/* Form */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Business Info */}
                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Business Information</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Business Name
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
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
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Contact Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
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
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Account Settings */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Account Settings</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Account Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending Approval">Pending Approval</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Merchant Tier
                                </label>
                                <select
                                    name="tier"
                                    value={formData.tier}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Commission Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="commissionRate"
                                    value={formData.commissionRate}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Subscription Type
                                </label>
                                <select
                                    name="subscriptionType"
                                    value={formData.subscriptionType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-100">
                            <Link to="/admin/merchants" className="btn-secondary px-6 py-2 flex items-center">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center space-x-2 px-6 py-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    )
}

export default EditMerchantPage
