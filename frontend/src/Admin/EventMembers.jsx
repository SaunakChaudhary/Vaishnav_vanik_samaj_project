import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Phone, Mail, MapPin, IndianRupee, CheckCircle, Clock, User } from 'lucide-react';
import Slidebar from "../Components/Slidebar";

const EventMembers = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Fetch data from API
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/events/event-registration-members');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch registrations');
                }
                
                const data = await response.json();
                setRegistrations(data.registrations || []);
                
                // Extract unique events for filtering
                const uniqueEvents = data.registrations?.reduce((acc, reg) => {
                    const existingEvent = acc.find(e => e._id === reg.event._id);
                    if (!existingEvent) {
                        acc.push(reg.event);
                    }
                    return acc;
                }, []) || [];
                
                setEvents(uniqueEvents);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching registrations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    // Filter registrations based on selected event and search term
    const filteredRegistrations = registrations.filter(reg => {
        const matchesEvent = selectedEvent === 'all' || reg.event._id === selectedEvent;
        const memberName = `${reg.member.firstName} ${reg.member.middleName} ${reg.member.lastName}`.toLowerCase();
        const matchesSearch = searchTerm === '' || 
            memberName.includes(searchTerm.toLowerCase()) ||
            reg.member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.member.phone_number.includes(searchTerm) ||
            reg.event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesEvent && matchesSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <Slidebar highlight={"eventMembers"} />
                <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading registrations...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <Slidebar highlight={"eventMembers"} />
                <div className="flex-1 p-4 md:p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                        <p className="text-red-600 mt-1">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <Slidebar highlight={"eventMembers"} />
            
            <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 md:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Event Members</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage and view all event registrations</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Event Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Event
                            </label>
                            <select 
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Events ({registrations.length})</option>
                                {events.map(event => {
                                    const count = registrations.filter(reg => reg.event._id === event._id).length;
                                    return (
                                        <option key={event._id} value={event._id}>
                                            {event.eventName} ({count})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Members
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone, or event..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs md:text-sm font-medium text-gray-600">Total Registrations</p>
                                <p className="text-lg md:text-2xl font-bold text-gray-900">{filteredRegistrations.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs md:text-sm font-medium text-gray-600">Active Events</p>
                                <p className="text-lg md:text-2xl font-bold text-gray-900">{events.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs md:text-sm font-medium text-gray-600">Paid Registrations</p>
                                <p className="text-lg md:text-2xl font-bold text-gray-900">
                                    {filteredRegistrations.filter(reg => reg.payment.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs md:text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-lg md:text-2xl font-bold text-gray-900">
                                    {formatCurrency(
                                        filteredRegistrations
                                            .filter(reg => reg.payment.status === 'completed')
                                            .reduce((sum, reg) => sum + reg.payment.amount, 0)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registrations List */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
                        <h2 className="text-base md:text-lg font-semibold text-gray-900">
                            Registration Details ({filteredRegistrations.length})
                        </h2>
                    </div>

                    {filteredRegistrations.length === 0 ? (
                        <div className="p-6 md:p-8 text-center">
                            <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                            <p className="text-gray-500 text-sm md:text-base">No registrations found matching your criteria</p>
                            <button 
                                onClick={() => {
                                    setSelectedEvent('all');
                                    setSearchTerm('');
                                }}
                                className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm md:text-base"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredRegistrations.map((registration) => (
                                <div key={registration._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
                                        {/* Member Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    {registration.member.photo ? (
                                                        <img 
                                                            src={"http://localhost:5000" + registration.member.photo} 
                                                            alt={`${registration.member.firstName} ${registration.member.lastName}`}
                                                            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                                                        {registration.member.firstName} {registration.member.middleName} {registration.member.lastName}
                                                    </h3>
                                                    
                                                    <div className="mt-1 md:mt-2 space-y-1">
                                                        <div className="flex items-center text-xs md:text-sm text-gray-600 truncate">
                                                            <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                            <span className="truncate">{registration.member.email}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs md:text-sm text-gray-600">
                                                            <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                            {registration.member.phone_number}
                                                        </div>
                                                        <div className="flex items-center text-xs md:text-sm text-gray-600 truncate">
                                                            <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                            <span className="truncate">{registration.member.city}, {registration.member.state}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-1 md:gap-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs md:text-xs font-medium bg-blue-100 text-blue-800">
                                                            {registration.member.memberType}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs md:text-xs font-medium bg-green-100 text-green-800">
                                                            {registration.member.profession}
                                                        </span>
                                                        {registration.member.role && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs md:text-xs font-medium bg-purple-100 text-purple-800">
                                                                {registration.member.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event and Payment Info */}
                                        <div className="lg:w-96 space-y-3 md:space-y-4">
                                            {/* Event Details */}
                                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                                <h4 className="text-sm md:text-base font-medium text-gray-900 mb-1 md:mb-2 truncate">{registration.event.eventName}</h4>
                                                <div className="space-y-1 text-xs md:text-sm text-gray-600">
                                                    <div className="flex items-center truncate">
                                                        <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                        <span className="truncate">{formatDate(registration.event.eventDateTime)}</span>
                                                    </div>
                                                    <div className="flex items-center truncate">
                                                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                        <span className="truncate">{registration.event.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                                                        {registration.familyInfo.totalPersons} person(s)
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                                    <span className="text-xs md:text-sm font-medium text-gray-900">Payment</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs md:text-xs font-medium ${
                                                        registration.payment.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {registration.payment.status === 'completed' ? (
                                                            <>
                                                                <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                                                                Paid
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                                                                Pending
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-xs md:text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Amount:</span>
                                                        <span className="font-medium">{formatCurrency(registration.payment.amount)}</span>
                                                    </div>
                                                    {registration.payment.transactionId && (
                                                        <div className="flex justify-between truncate">
                                                            <span className="text-gray-600">Txn ID:</span>
                                                            <span className="font-mono text-2xs md:text-xs truncate">{registration.payment.transactionId}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Registered:</span>
                                                        <span className="text-2xs md:text-xs">{formatDate(registration.registrationDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventMembers;