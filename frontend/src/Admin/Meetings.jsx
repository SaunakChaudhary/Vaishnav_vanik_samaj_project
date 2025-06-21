import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, FileText, Plus, Edit, Trash2, Upload, X, Download, Eye } from 'lucide-react';
import Slidebar from '../Components/Slidebar';

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const isPdfViewer = title.startsWith('Viewing:');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white rounded-lg w-full max-h-[90vh] overflow-y-auto ${
                isPdfViewer ? 'max-w-4xl' : 'max-w-md'
            }`}>
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// MeetingForm component
const MeetingForm = ({ 
    formData, 
    setFormData, 
    onSubmit, 
    submitText, 
    loading, 
    onCancel 
}) => (
    <div className="p-4 sm:p-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Topic
                </label>
                <input
                    type="text"
                    value={formData.meetingTopic}
                    onChange={(e) => setFormData({ ...formData, meetingTopic: e.target.value })}
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Date
                    </label>
                    <input
                        type="date"
                        value={formData.meetingDate}
                        onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Time
                    </label>
                    <input
                        type="time"
                        value={formData.meetingTime}
                        onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Place
                </label>
                <input
                    type="text"
                    value={formData.meetingPlace}
                    onChange={(e) => setFormData({ ...formData, meetingPlace: e.target.value })}
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    if (formData.meetingTopic && formData.meetingDate && formData.meetingTime && formData.meetingPlace) {
                        onSubmit(e);
                    }
                }}
                disabled={loading || !formData.meetingTopic || !formData.meetingDate || !formData.meetingTime || !formData.meetingPlace}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Loading...' : submitText}
            </button>
        </div>
    </div>
);

const MeetingManagement = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [meetings, setMeetings] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        meetingTopic: '',
        meetingDate: '',
        meetingTime: '',
        meetingPlace: ''
    });
    const [viewingPdf, setViewingPdf] = useState(null);

    // Fetch meetings
    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meeting/display`);
            const data = await response.json();
            setMeetings(data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    // Create meeting
    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meeting/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchMeetings();
                setShowCreateModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error creating meeting:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update meeting
    const handleUpdateMeeting = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meeting/update/${editingMeeting._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchMeetings();
                setShowEditModal(false);
                setEditingMeeting(null);
                resetForm();
            }
        } catch (error) {
            console.error('Error updating meeting:', error);
        } finally {
            setLoading(false);
        }
    };

    // Upload documents
    const handleFileUpload = async (meetingId, files) => {
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('pdf', file);
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meeting/upload/${meetingId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                await fetchMeetings();
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    // Delete document
    const handleDeleteDocument = async (meetingId, fileUrl) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meeting/delete-pdf/${meetingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileUrl })
            });

            if (response.ok) {
                await fetchMeetings();
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    // Download document
    const handleDownloadDocument = async (fileUrl, fileName) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}` + fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    // View document
    const handleViewDocument = (fileUrl, fileName) => {
        setViewingPdf({
            url: `${process.env.REACT_APP_API_URL}` + fileUrl,
            name: fileName || 'Document'
        });
    };

    const resetForm = () => {
        setFormData({
            meetingTopic: '',
            meetingDate: '',
            meetingTime: '',
            meetingPlace: ''
        });
    };

    const openEditModal = (meeting) => {
        setEditingMeeting(meeting);
        setFormData({
            meetingTopic: meeting.meetingTopic,
            meetingDate: meeting.meetingDate,
            meetingTime: meeting.meetingTime,
            meetingPlace: meeting.meetingPlace
        });
        setShowEditModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCancelCreate = () => {
        setShowCreateModal(false);
        resetForm();
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditingMeeting(null);
        resetForm();
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 relative">
            <Slidebar highlight={"meetings"} />

            <div className="w-full mx-auto flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 md:mt-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-0">
                        Meeting Management
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
                    >
                        <Plus size={18} />
                        <span>Create Meeting</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && meetings.length === 0 && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-gray-600 text-sm sm:text-base">Loading meetings...</p>
                    </div>
                )}

                {/* Meetings Grid */}
                {meetings.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Create your first meeting to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {meetings.map((meeting) => (
                            <div key={meeting._id} className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6">
                                {/* Meeting Header */}
                                <div className="flex justify-between items-start mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                        {meeting.meetingTopic}
                                    </h3>
                                    <button
                                        onClick={() => openEditModal(meeting)}
                                        className="text-gray-400 hover:text-blue-600"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </div>

                                {/* Meeting Details */}
                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                                        <span>{formatDate(meeting.meetingDate)}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                                        <Clock size={14} className="mr-2 flex-shrink-0" />
                                        <span>{meeting.meetingTime}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                                        <MapPin size={14} className="mr-2 flex-shrink-0" />
                                        <span className="truncate">{meeting.meetingPlace}</span>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="border-t pt-3 sm:pt-4">
                                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-700">Documents</h4>
                                        <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                                            <Upload size={14} />
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(meeting._id, e.target.files)}
                                            />
                                        </label>
                                    </div>

                                    {meeting.uploadedFile && meeting.uploadedFile.length > 0 ? (
                                        <div className="space-y-1 sm:space-y-2">
                                            {meeting.uploadedFile.map((fileUrl, index) => {
                                                const fileName = fileUrl.split('/').pop();
                                                return (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-1.5 sm:p-2 rounded text-xs">
                                                        <div className="flex items-center flex-1 min-w-0">
                                                            <FileText size={12} className="text-red-500 mr-1 sm:mr-2 flex-shrink-0" />
                                                            <span className="truncate">
                                                                {fileName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 ml-2">
                                                            <button
                                                                onClick={() => handleViewDocument(fileUrl, fileName)}
                                                                className="text-blue-500 hover:text-blue-700 p-0.5"
                                                                title="View PDF"
                                                            >
                                                                <Eye size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownloadDocument(fileUrl, fileName)}
                                                                className="text-green-500 hover:text-green-700 p-0.5"
                                                                title="Download PDF"
                                                            >
                                                                <Download size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteDocument(meeting._id, fileUrl)}
                                                                className="text-red-500 hover:text-red-700 p-0.5"
                                                                title="Delete PDF"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500">No documents uploaded</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Meeting Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={handleCancelCreate}
                    title="Create New Meeting"
                >
                    <MeetingForm 
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleCreateMeeting} 
                        submitText="Create Meeting"
                        loading={loading}
                        onCancel={handleCancelCreate}
                    />
                </Modal>

                {/* Edit Meeting Modal */}
                <Modal
                    isOpen={showEditModal}
                    onClose={handleCancelEdit}
                    title="Edit Meeting"
                >
                    <MeetingForm 
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleUpdateMeeting} 
                        submitText="Update Meeting"
                        loading={loading}
                        onCancel={handleCancelEdit}
                    />
                </Modal>

                {/* PDF Viewer Modal */}
                <Modal
                    isOpen={viewingPdf !== null}
                    onClose={() => setViewingPdf(null)}
                    title={`Viewing: ${viewingPdf?.name || 'Document'}`}
                >
                    <div className="p-4 sm:p-6">
                        {viewingPdf && (
                            <div className="w-full h-64 sm:h-96 border rounded-lg overflow-hidden">
                                <iframe
                                    src={viewingPdf.url}
                                    width="100%"
                                    height="100%"
                                    title="PDF Viewer"
                                    className="border-0"
                                />
                            </div>
                        )}
                        <div className="flex justify-end space-x-2 sm:space-x-3 mt-4">
                            <button
                                onClick={() => handleDownloadDocument(viewingPdf?.url, viewingPdf?.name)}
                                className="px-3 sm:px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                            >
                                <Download size={14} />
                                <span>Download</span>
                            </button>
                            <button
                                onClick={() => setViewingPdf(null)}
                                className="px-3 sm:px-4 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm sm:text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default MeetingManagement;