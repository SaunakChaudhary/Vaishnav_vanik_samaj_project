import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../Context/userContext';

const Contributions = () => {
    const [contributions, setContribution] = useState([]);
    const { LoggedInUser } = useContext(UserDataContext);
    const fetchDashboard = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/userDashobard/${LoggedInUser._id}`);
        const data = await response.json();
        if (response.ok) {
            setContribution(data.contributions)
        }
    }
    useEffect(() => {
        fetchDashboard();
    }, [LoggedInUser])
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount)
    }
    return (
        <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
                            <p className="text-sm text-gray-500 mt-1">Total donations: {contributions.length}</p>
                        </div>
                        <button
                            onClick={fetchDashboard}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {contributions.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-4 0H4" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No donations</h3>
                            <p className="mt-1 text-sm text-gray-500">No donations have been recorded yet.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction Id
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contributions.map((donation, index) => (
                                    <tr key={donation.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{donation.id || index + 1}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">
                                                {formatAmount(donation.amount || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-500'`}>
                                                success
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {donation.transactionId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {donation.createdAt || donation.created_at || donation.date
                                                ? formatDate(donation.createdAt || donation.created_at || donation.date)
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                            <div className="truncate" title={donation.message}>
                                                {donation.message || 'No message'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer with summary */}
                {contributions.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Showing {contributions.length} donations</span>
                            <span>
                                Total Amount: {formatAmount(
                                    contributions.reduce((sum, donation) => sum + (donation.amount || 0), 0)
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Contributions
