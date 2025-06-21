import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import {
    Eye,
    Reply,
    Search,
    Filter,
    User,
    Calendar,
    X,
    Send,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import Slidebar from '../Components/Slidebar';
import { Riple } from "react-loading-indicators";

const Inquiry = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [inquiries, setInquiries] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [replyModal, setReplyModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [replyData, setReplyData] = useState({
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        const displayMessages = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/contact/display-messages");
                const data = await response.json();
                if (response.ok) {
                    setInquiries(data);
                    setFilteredInquiries(data);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch inquiries");
            } finally {
                setIsLoading(false);
            }
        };
        displayMessages();
    }, []);

    useEffect(() => {
        let filtered = inquiries;

        if (searchTerm) {
            filtered = filtered.filter(inq =>
                inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(inq => inq.status === filterStatus);
        }

        setFilteredInquiries(filtered);
    }, [searchTerm, filterStatus, inquiries]);

    const handleReply = (inquiry) => {
        setReplyModal(inquiry);
        setReplyData({
            subject: `Re: ${inquiry.subject}`,
            message: `Dear ${inquiry.fullName},\n\nThank you for contacting us. `
        });
    };

    const sendReply = async () => {
        setIsReplying(true);

        try {
            const response = await fetch('http://localhost:5000/api/contact/reply-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inquiryId: replyModal._id,
                    replyMessage: replyData.message
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setInquiries(prev =>
                    prev.map(inq =>
                        inq._id === replyModal._id
                            ? { ...inq, status: 'replied' }
                            : inq
                    )
                );
                setReplyModal(null);
                setReplyData({ subject: '', message: '' });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setIsReplying(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
                    <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
                </div>
            )}

            <Slidebar highlight={"inquiry"} />

            <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 mt-16 md:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and respond to user inquiries</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search inquiries..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="flex items-center">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="replied">Replied</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inquiries Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-sm font-medium text-gray-700">
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3 hidden sm:table-cell">Status</th>
                                    <th className="px-4 py-3 hidden md:table-cell">Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredInquiries.length > 0 ? (
                                    filteredInquiries.map((inq) => (
                                        <tr key={inq._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 rounded-full p-2">
                                                        <User className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{inq.fullName}</p>
                                                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{inq.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {getPriorityIcon(inq.priority)}
                                                    <div>
                                                        <p className="font-medium">{inq.subject}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{inq.message}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inq.status)}`}>
                                                    {inq.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(inq.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelected(inq)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReply(inq)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Reply"
                                                    >
                                                        <Reply className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6 text-gray-500">
                                            No inquiries found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* View Modal */}
                {selected && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{selected.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selected.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Subject</p>
                                        <p className="font-medium">{selected.subject}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{formatDate(selected.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Message</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="whitespace-pre-wrap">{selected.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setSelected(null);
                                        handleReply(selected);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reply Modal */}
                {replyModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Reply to Inquiry</h2>
                                <button
                                    onClick={() => setReplyModal(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Original Message</h3>
                                    <p className="text-sm text-gray-600">From: {replyModal.fullName} ({replyModal.email})</p>
                                    <p className="text-sm text-gray-600">Subject: {replyModal.subject}</p>
                                    <p className="text-sm text-gray-900 mt-2 whitespace-pre-wrap">{replyModal.message}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={replyData.subject}
                                        onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Message</label>
                                    <textarea
                                        rows="6"
                                        value={replyData.message}
                                        onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setReplyModal(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendReply}
                                    disabled={isReplying}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isReplying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Inquiry;