import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { FiDownload, FiEye, FiCalendar, FiClock, FiMapPin, FiFile, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Footer from '../Components/Footer';

const UserMeetings = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedMeeting, setExpandedMeeting] = useState(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/meeting/display`);
                if (!response.ok) {
                    throw new Error('Failed to fetch meetings');
                }
                const data = await response.json();
                const sortedMeetings = data.sort((a, b) => new Date(b.meetingDate) - new Date(a.meetingDate));
                setMeetings(sortedMeetings);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDownload = async (fileUrl) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}` + fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileUrl.split('/').pop() || 'meeting_document.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Failed to download file');
        }
    };

    const toggleMeeting = (meetingId) => {
        setExpandedMeeting(expandedMeeting === meetingId ? null : meetingId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading meetings</h3>
                        <p className="mt-2 text-sm text-gray-500">{error}</p>
                        <div className="mt-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Your Meetings</h1>
                    <p className="mt-2 text-lg text-gray-600">All scheduled meetings and documents</p>
                </div>

                {meetings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">No meetings scheduled</h3>
                        <p className="mt-2 text-sm text-gray-500">Check back later for upcoming meetings</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {meetings.map((meeting) => (
                            <div
                                key={meeting._id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-100"
                            >
                                {/* Card Header */}
                                <div
                                    className="p-5 cursor-pointer"
                                    onClick={() => toggleMeeting(meeting._id)}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            {/* Meeting Type Icon Badge */}
                                            <div className="flex items-center mb-2">
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {meeting.meetingTopic}
                                            </h3>

                                            {/* Date with Calendar Icon */}
                                            <div className="mt-3 flex items-center text-sm text-gray-600">
                                                <FiCalendar className="mr-2 flex-shrink-0 text-gray-400" />
                                                <span>{formatDate(meeting.meetingDate)}</span>
                                            </div>
                                        </div>

                                        <div className="text-gray-400 flex flex-col items-center">
                                            {expandedMeeting === meeting._id ? (
                                                <FiChevronUp className="h-5 w-5" />
                                            ) : (
                                                <FiChevronDown className="h-5 w-5" />
                                            )}
                                            <span className="text-xs mt-1 text-gray-400">
                                                {expandedMeeting === meeting._id ? 'Less' : 'More'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Time and Location */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="p-1 mr-2 rounded-full bg-purple-50 text-purple-600">
                                                <FiClock className="h-4 w-4" />
                                            </div>
                                            <span>{meeting.meetingTime}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="p-1 mr-2 rounded-full bg-green-50 text-green-600">
                                                <FiMapPin className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{meeting.meetingPlace}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedMeeting === meeting._id && (
                                    <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 transition-all duration-200">
                                        {/* Documents Section */}
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <FiFile className="mr-2 text-gray-500" />
                                                Meeting Documents
                                            </h4>

                                            {meeting.uploadedFile && meeting.uploadedFile.length > 0 ? (
                                                <div className="space-y-2">
                                                    {meeting.uploadedFile.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="flex items-center min-w-0">
                                                                <div className="p-1.5 mr-2 rounded-md bg-red-50 text-red-500">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-700 truncate">
                                                                    {file.split('/').pop()}
                                                                </span>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(`${import.meta.env.VITE_API_URL}` + file, '_blank');
                                                                    }}
                                                                    className="p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-colors"
                                                                    title="View"
                                                                >
                                                                    <FiEye className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDownload(file);
                                                                    }}
                                                                    className="p-1.5 text-green-600 hover:text-green-800 rounded-md hover:bg-green-50 transition-colors"
                                                                    title="Download"
                                                                >
                                                                    <FiDownload className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-sm text-gray-500 py-2">
                                                    <FiFile className="mr-2 text-gray-400" />
                                                    No documents uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserMeetings;