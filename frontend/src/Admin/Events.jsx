import React, { useState, useEffect } from 'react'
import { X } from "lucide-react";

import Slidebar from '../Components/Slidebar';
import { Riple } from "react-loading-indicators";
import { toast } from 'react-hot-toast';

const AdminEvents = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [addEventShow, setAddEventShow] = useState(false);
  const [updateEventShow, setUpdateEventShow] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventName: '',
    eventPhoto: null,
    description: '',
    lastRegistrationDate: '',
    eventDateTime: '',
    location: '',
    feesPerPerson: '',
    feesForExtraGuest: '',
  });

  const [formData1, setFormData1] = useState({
    eventName: '',
    eventPhoto: null,
    description: '',
    lastRegistrationDate: '',
    eventDateTime: '',
    location: '',
    feesPerPerson: '',
    feesForExtraGuest: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      setFormData1({ ...formData1, [name]: files[0] });
    } else {
      setFormData1({ ...formData1, [name]: value });
      setFormData({ ...formData, [name]: value });
    }
  };

  const [events, setEvents] = useState([]);

  // Display events
  useEffect(() => {
    const dispEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/display`);
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events);
        } else {
          toast.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Error loading events');
      }
    }
    dispEvents();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('eventName', formData.eventName);
    data.append('eventPhoto', formData.eventPhoto);
    data.append('description', formData.description);
    data.append('lastRegistrationDate', formData.lastRegistrationDate);
    data.append('eventDateTime', formData.eventDateTime);
    data.append('location', formData.location);
    data.append('feesPerPerson', formData.feesPerPerson);
    data.append('feesForExtraGuest', formData.feesForExtraGuest);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/add`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setAddEventShow(false);
        setFormData({
          eventName: '',
          eventPhoto: null,
          description: '',
          lastRegistrationDate: '',
          eventDateTime: '',
          location: '',
          feesPerPerson: '',
          feesForExtraGuest: ''
        });
        const updatedEvents = [...events, result.event];
        setEvents(updatedEvents);
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowUpdate = (event) => {
    setUpdateEventShow(true);
    setSelectedEventId(event._id);
    setFormData1({
      eventName: event.eventName,
      eventPhoto: null,
      description: event.description,
      lastRegistrationDate: event.lastRegistrationDate?.slice(0, 16),
      eventDateTime: event.eventDateTime?.slice(0, 16),
      location: event.location,
      feesPerPerson: event.feesPerPerson,
      feesForExtraGuest: event.feesForExtraGuest
    });
  };

  // Handle Update Event
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('eventName', formData1.eventName);
    data.append('eventPhoto', formData1.eventPhoto);
    data.append('description', formData1.description);
    data.append('lastRegistrationDate', formData1.lastRegistrationDate);
    data.append('eventDateTime', formData1.eventDateTime);
    data.append('location', formData1.location);
    data.append('feesPerPerson', formData1.feesPerPerson);
    data.append('feesForExtraGuest', formData1.feesForExtraGuest);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/update/${selectedEventId}`, {
        method: 'PUT',
        body: data
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setUpdateEventShow(false);
        setEvents(events.map(event => event._id === selectedEventId ? result.event : event));
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch {
      toast.error('Update error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/delete/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          setEvents(events.filter(event => event._id !== id));
        } else {
          toast.error(data.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Error deleting event');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  };

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventPhoto: null,
      description: '',
      lastRegistrationDate: '',
      eventDateTime: '',
      location: '',
      feesPerPerson: '',
      feesForExtraGuest: ''
    });
    setFormData1({
      eventName: '',
      eventPhoto: null,
      description: '',
      lastRegistrationDate: '',
      eventDateTime: '',
      location: '',
      feesPerPerson: '',
      feesForExtraGuest: ''
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}
      <Slidebar highlight={"events"} />

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 md:mt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-1">Create and manage upcoming community events</p>
          </div>
          <button
            onClick={() => setAddEventShow(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto"
          >
            + Add New Event
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Description</th>
                  <th className="px-4 py-3 hidden md:table-cell">Date/Time</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={"http://localhost:5000" + event.eventPhoto}
                          alt="Event"
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{event.eventName}</p>
                          <p className="text-sm text-gray-500 sm:hidden">{formatDate(event.eventDateTime)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="line-clamp-2 text-sm">{event.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm">{formatDate(event.eventDateTime)}</p>
                      <p className="text-xs text-gray-500">Reg. until: {formatDate(event.lastRegistrationDate)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowUpdate(event)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No events found. Add your first event!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Event Modal */}
        {addEventShow && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Add New Event</h3>
                  <button
                    onClick={() => { setAddEventShow(false); resetForm(); }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Photo</label>
                      <input
                        type="file"
                        name="eventPhoto"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Registration Date</label>
                      <input
                        type="datetime-local"
                        name="lastRegistrationDate"
                        value={formData.lastRegistrationDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time</label>
                      <input
                        type="datetime-local"
                        name="eventDateTime"
                        value={formData.eventDateTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fees per Person (₹)</label>
                      <input
                        type="number"
                        name="feesPerPerson"
                        value={formData.feesPerPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fees for Extra Guest (₹)</label>
                      <input
                        type="number"
                        name="feesForExtraGuest"
                        value={formData.feesForExtraGuest}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setAddEventShow(false); resetForm(); }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Update Event Modal */}
        {updateEventShow && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Update Event</h3>
                  <button
                    onClick={() => { setUpdateEventShow(false); resetForm(); }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData1.eventName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Photo</label>
                      <input
                        type="file"
                        name="eventPhoto"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                      />
                      {events.find(e => e._id === selectedEventId)?.eventPhoto && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Current Photo:</p>
                          <img
                            src={"http://localhost:5000" + events.find(e => e._id === selectedEventId)?.eventPhoto}
                            alt="Current"
                            className="h-20 mt-1 rounded object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData1.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Registration Date</label>
                      <input
                        type="datetime-local"
                        name="lastRegistrationDate"
                        value={formData1.lastRegistrationDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time</label>
                      <input
                        type="datetime-local"
                        name="eventDateTime"
                        value={formData1.eventDateTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData1.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fees per Person (₹)</label>
                      <input
                        type="number"
                        name="feesPerPerson"
                        value={formData1.feesPerPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fees for Extra Guest (₹)</label>
                      <input
                        type="number"
                        name="feesForExtraGuest"
                        value={formData1.feesForExtraGuest}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setUpdateEventShow(false); resetForm(); }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Update Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;