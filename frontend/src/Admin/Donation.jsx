import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Inbox, Mail, Phone, Calendar, User } from 'lucide-react';
import Slidebar from '../Components/Slidebar';

const Donation = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation/get-donations`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDonations(data.donations || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching donations:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    // Filter donations based on search term
    const filteredDonations = donations.filter(donation => {
        return searchTerm === '' ||
            (donation.fullName && donation.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (donation.email && donation.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (donation.message && donation.message.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const totalAmount = filteredDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <Slidebar highlight={"donation"} />
                <div className="flex-1 p-4 md:p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <Slidebar highlight={"donation"} />
                <div className="flex-1 p-4 md:p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading donations</h3>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                                <button
                                    onClick={fetchDonations}
                                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <Slidebar highlight={"donation"} />

            <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 mt-16 md:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Donations</h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                {donations.length} total donations • {formatAmount(totalAmount)} raised
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchDonations}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 mb-6">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search donations
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                id="search"
                                className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search by name, email or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations Table */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
                    {filteredDonations.length === 0 ? (
                        <div className="text-center p-8">
                            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {donations.length === 0
                                    ? "No donations have been recorded yet."
                                    : "No donations match your search criteria."}
                            </p>
                            {donations.length > 0 && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Donor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Message
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredDonations.map((donation, index) => (
                                            <tr key={donation.id || index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {donation.fullName || 'Anonymous'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{donation.email || 'N/A'}</div>
                                                    {donation.phone && (
                                                        <div className="text-sm text-gray-500">{donation.phone}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-green-600">
                                                        {formatAmount(donation.amount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(donation.createdAt || donation.created_at || donation.date)}
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
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden">
                                {filteredDonations.map((donation, index) => (
                                    <div key={donation.id || index} className="border-b border-gray-200 p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {donation.fullName || 'Anonymous'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatAmount(donation.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            {donation.email && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {donation.email}
                                                </div>
                                            )}
                                            {donation.phone && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {donation.phone}
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(donation.createdAt || donation.created_at || donation.date)}
                                            </div>
                                        </div>

                                        {donation.message && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                    {donation.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 sm:px-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                        Showing <span className="font-medium">{filteredDonations.length}</span> of <span className="font-medium">{donations.length}</span> donations
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Total: {formatAmount(totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Donation;