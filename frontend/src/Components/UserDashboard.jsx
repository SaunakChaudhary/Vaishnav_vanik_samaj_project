import React, { useContext, useEffect, useState } from 'react';
import {
    Calendar, Users, Heart,
    Megaphone, MapPin, Clock, CheckCircle, User
} from 'lucide-react';
import { UserDataContext } from '../Context/userContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ setActiveTab }) => {
    const { LoggedInUser } = useContext(UserDataContext);

    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [eventsWithRegistrationStatus, setEventsWithRegistrationStatus] = useState([]);
    const [totalMembers, setTotalMembers] = useState([]);
    const [totalAds, setTotalAds] = useState([]);
    const [activeAds, setActiveAds] = useState(0);
    const [totalContribution, setTotalContribution] = useState(0);
    const [UserAdvertisements, setUserAdvertisements] = useState([]);
    const [latestEvent, setLatestEvent] = useState({});

    useEffect(() => {
        const fetchDashboard = async () => {
            const response = await fetch(`http://localhost:5000/api/auth/userDashobard/${LoggedInUser._id}`);
            const data = await response.json();
            if (response.ok) {
                setRegisteredEvents(data.registeredEvents);
                setEventsWithRegistrationStatus(data.eventsWithRegistrationStatus)
                setTotalMembers(data.totalMembers)
                setActiveAds(data.activeAds)
                setTotalAds(data.totalAds)
                setTotalContribution(data.totalContribution)
                setUserAdvertisements(data.UserAdvertisements)
                setLatestEvent(data.latestEvent)
            }
        }
        fetchDashboard();
    }, [LoggedInUser])

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchResponse = async () => {
            const response = await fetch("http://localhost:5000/api/birthday/today-birthday");
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            }
        }
        fetchResponse();
    }, []);

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Welcome back, {LoggedInUser.firstName + " " + LoggedInUser.lastName}!
                        </h1>
                        <p className="text-gray-600">Here's what's happening in your community</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Upcoming Events */}
                    <StatCard
                        icon={<Calendar className="w-5 h-5 text-blue-600" />}
                        title="Your Events"
                        value={registeredEvents.length}
                        subtitle={`of ${eventsWithRegistrationStatus.length} upcoming`}
                        bgColor="bg-blue-50"
                        link="/events"
                    />
                    <StatCard
                        setActiveTab={setActiveTab}
                        icon={<Users className="w-5 h-5 text-green-600" />}
                        title="Community Members"
                        value={totalMembers.length}
                        bgColor="bg-green-50"
                        tabs="users"
                    />

                    <StatCard
                        setActiveTab={setActiveTab}
                        icon={<Megaphone className="w-5 h-5 text-blue-600" />}
                        title="Active Ads"
                        value={activeAds.length}
                        subtitle={`of ${totalAds} total`}
                        bgColor="bg-blue-50"
                        tabs="ads"
                    />

                    {/* Your Contributions */}
                    <StatCard
                        setActiveTab={setActiveTab}
                        icon={<Heart className="w-5 h-5 text-red-600" />}
                        title="Your Contributions"
                        value={`₹${totalContribution}`}
                        subtitle="this year"
                        bgColor="bg-red-50"
                        tabs="contribution"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Events */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Events */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Your Upcoming Events</h2>
                                <button className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800" onClick={() => navigate("/events")}>View All</button>
                            </div>
                            {eventsWithRegistrationStatus.map((event) => (
                                <EventCard
                                    key={event._id}
                                    title={event.eventName}
                                    date={event.eventDateTime}
                                    location={event.location}
                                    registered={event.registered}
                                    image={event.eventPhoto}
                                />
                            ))}
                        </div>

                        {/* Advertisements */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[290px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Your Advertisements</h2>
                                <button
                                    className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800"
                                    onClick={() => setActiveTab("ads")}
                                >
                                    Apply for Advertisement
                                </button>
                            </div>

                            {UserAdvertisements.length > 0 ? (
                                <div className="space-y-4">
                                    {UserAdvertisements.map((ad) => (
                                        <div
                                            key={ad._id}
                                            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {/* Ad Image */}
                                                {ad.image && (
                                                    <div className="w-full md:w-1/4 h-40 rounded-lg overflow-hidden">
                                                        <img
                                                            src={"http://localhost:5000" + ad.image}
                                                            alt={`Advertisement for ${ad.side}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/default-ad.png';
                                                                e.target.className = 'w-full h-full object-contain p-4 bg-gray-100';
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Ad Details */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-800 capitalize">
                                                                {ad.side} Position
                                                            </h3>
                                                        </div>

                                                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                            <span className="text-sm font-medium">
                                                                ₹{ad.adfees_id.price} total
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Stats Row */}
                                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-500">Price per day</p>
                                                            <p className="font-medium text-gray-800">₹{ad.adfees_id.pricePerDay}</p>
                                                        </div>

                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-500">Duration</p>
                                                            <p className="font-medium text-gray-800">
                                                                {Math.ceil((new Date(ad.availableAfter) - new Date()) / (1000 * 60 * 60 * 24))} days
                                                            </p>
                                                        </div>

                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-500">Start Date</p>
                                                            <p className="font-medium text-gray-800">
                                                                {new Date(ad.fromDate).toLocaleDateString()}
                                                            </p>
                                                        </div>

                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-500">End Date</p>
                                                            <p className="font-medium text-gray-800">
                                                                {new Date(ad.availableAfter).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">You have no active advertisements.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Todays's Birthday */}
                        <div className="bg-white h-[510px] overflow-y-auto p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <span>🎂 Today's Birthday</span>
                                </h2>
                                <button
                                    className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                    onClick={() => setActiveTab("notifications")}
                                >
                                    View All
                                </button>
                            </div>

                            {users.length === 0 ? (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No birthdays today</p>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-3">
                                    {users.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex flex-col items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            {/* User Info */}
                                            <div className="flex items-center space-x-6 flex-1 min-w-0 w-full">
                                                <div className="relative">
                                                    <img
                                                        src={"http://localhost:5000" +user.photo || '/default-avatar.png'}
                                                        alt={user.firstName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/default-avatar.png'
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {user.firstName + " " + user.lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <span>Birthday today!</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons - Responsive */}
                                            <div className="w-full grid grid-cols-2 gap-3">
                                                {/* WhatsApp Button */}
                                                <a
                                                    href={`https://wa.me/${user.phone_number}?text=${encodeURIComponent(
                                                        ` *Happy Birthday ${user.firstName} ${user.lastName}!* \n\n` +
                                                        "Wishing you a wonderful day filled with:\n" +
                                                        " - Joy and Happiness\n" +
                                                        " - Good Health and Prosperity\n" +
                                                        " - Success in All Your Endeavors\n\n" +
                                                        "May this year bring you abundant blessings!\n\n" +
                                                        "Warm regards,\n" +
                                                        `${LoggedInUser.firstName} ${LoggedInUser.lastName}\n` +
                                                        "*Vaishnav Vanik Samaaj*"
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium w-full px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5"
                                                        viewBox="0 0 32 32"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M16 0C7.168 0 0 7.168 0 16c0 2.82.736 5.46 2.024 7.76L0 32l8.544-2.248C11.08 31.376 13.456 32 16 32c8.832 0 16-7.168 16-16S24.832 0 16 0zM16 29.256c-2.304 0-4.504-.608-6.416-1.68l-.456-.272-5.056 1.328 1.352-4.928-.288-.488C3.96 21.28 3.2 18.688 3.2 16 3.2 8.84 8.84 3.2 16 3.2s12.8 5.64 12.8 12.8-5.64 12.8-12.8 12.8zM22.16 19.408c-.312-.152-1.84-.904-2.128-1.008-.288-.096-.496-.144-.704.152-.208.296-.816 1-1.008 1.2-.192.2-.36.224-.664.072-.312-.152-1.32-.456-2.504-1.464-.924-.82-1.548-1.832-1.728-2.136-.176-.304-.024-.472.128-.624.128-.128.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.64-1.528-.872-2.096-.23-.56-.472-.48-.648-.488h-.56c-.2 0-.52.072-.792.368-.272.296-1.016 1.008-1.016 2.464s1.04 2.856 1.184 3.048c.144.2 2.048 3.152 4.96 4.424.696.296 1.24.48 1.664.616.696.224 1.328.192 1.824.12.56-.088 1.728-.696 1.968-1.376.24-.68.24-1.264.168-1.384-.072-.128-.264-.2-.552-.352z" />
                                                    </svg>
                                                    <span className="inline text-sm">WhatsApp</span>
                                                </a>

                                                {/* Call Now Button */}
                                                <a
                                                    href={`tel:${user.phone_number}`}
                                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium w-full px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Call Now</span>
                                                    <span className="inline sm:hidden">Call</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {latestEvent &&
                    <div className="bg-white p-4 rounded-xl shadow-md border h-[400px] border-gray-200 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Latest Event Photos ({latestEvent.eventName})</h2>

                        {latestEvent.images1?.length > 0 ? (
                            <marquee behavior="scroll" direction="left" scrollamount="12" className="w-full overflow-hidden">
                                <div className="flex gap-4">
                                    {latestEvent.images1.map((img, index) => (
                                        <img
                                            key={index}
                                            src={"http://localhost:5000" +img}
                                            alt={`Event image ${index + 1}`}
                                            className="h-[300px] object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </marquee>
                        ) : (
                            <p className="text-gray-500">No images available.</p>
                        )}
                    </div>
                }
            </div>
        </div>
    );
};

// Reusable Components
const StatCard = ({ setActiveTab, icon, title, value, subtitle, bgColor, link, tabs }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => tabs ? setActiveTab(tabs) : navigate(link)}
            className={`${bgColor} cursor-pointer p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200`}
        >
            <div className="flex flex-col lg:flex-row items-start sm:items-center sm:flex-col gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};


const EventCard = ({ title, date, location, registered, image }) => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/events")}>
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                {image ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <img src={"http://localhost:5000" + image} alt="Event Photo" className='w-full h-full' />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    {registered && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Registered
                        </span>
                    )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {date}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;