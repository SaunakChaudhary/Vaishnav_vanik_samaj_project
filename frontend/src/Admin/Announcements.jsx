import React, { useState, useEffect } from 'react';
import Slidebar from '../Components/Slidebar';
import { Send, History, Users, Clock, MessageSquare, CheckCircle, Megaphone } from 'lucide-react';
import { Riple } from "react-loading-indicators";

const Announcements = () => {
    const [activeTab, setActiveTab] = useState("create");
    const [message, setMessage] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/announcements/get");
            const data = await res.json();
            setAnnouncements(data.reverse());
        } catch (err) {
            console.error("Error fetching announcements", err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/announcements/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("✅ Announcement sent successfully!");
                setMessage("");
                setCharCount(0);
                fetchAnnouncements();
                setTimeout(() => setSuccess(""), 4000);
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Submit error", error);
            alert("Something went wrong while sending.");
        }

        setIsLoading(false);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        setCharCount(e.target.value.length);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center">
                    <Riple color={["#6b7280", "#9ca3af", "#d1d5db", "#f3f4f6"]} />
                </div>
            )}

            <Slidebar highlight={"announcements"} />

            <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 mt-16 md:mt-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    Announcements
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">Manage your announcements</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
                        {["create", "history"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                                    activeTab === tab
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab === "create" ? <Send className="w-4 h-4" /> : <History className="w-4 h-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Create Tab */}
                    {activeTab === "create" && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create Announcement</h2>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={handleMessageChange}
                                            placeholder="Write your announcement..."
                                            className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm sm:text-base"
                                            rows="6"
                                            required
                                        />
                                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs sm:text-sm text-gray-500">
                                            {charCount} characters
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                                            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                                Preview
                                            </h3>
                                            <p className="text-gray-800 text-sm sm:text-base">{message}</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading || !message.trim()}
                                        className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                                            isLoading || !message.trim()
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        {isLoading ? "Sending..." : "Send Announcement"}
                                    </button>

                                    {success && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                            <p className="text-green-800 text-sm sm:text-base">{success}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <History className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">History</h2>
                                </div>
                                <div className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                                    {announcements.length} Total
                                </div>
                            </div>

                            {announcements.length === 0 ? (
                                <div className="text-center py-8 sm:py-16">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <MessageSquare className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No announcements yet</h3>
                                    <p className="text-gray-600 text-sm sm:text-base">Your announcements will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {announcements.map((ann, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6"
                                        >
                                            <div className="mb-3 sm:mb-4">
                                                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mt-0.5 sm:mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Message</h3>
                                                        <p className="text-gray-700 text-sm sm:text-base">{ann.message}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-4 text-xs sm:text-sm">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                                    <span className="text-gray-600">Sent on:</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {new Date(ann.sentAt || Date.now()).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 mt-0.5 sm:mt-1" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                            <span className="text-gray-600">Recipients:</span>
                                                            <span className="bg-indigo-100 text-indigo-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                                                                {ann.recipients?.length || 0} users
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Announcements;