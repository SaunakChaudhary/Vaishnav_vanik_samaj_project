// Redesigned Homepage.js - Clean, Modern Structure with Subtle Colors
import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import HeroSection from '../Components/HeroSection';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [ad, setAd] = useState([]);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/members/display");
                const data = await response.json();

                if (response.ok) {
                    const filteredMembers = data.membersDetails.filter(mem =>
                        mem.role === "president" ||
                        mem.role === "vice president" ||
                        mem.role === "secretary"
                    );
                    setMembers(filteredMembers);
                } else {
                    setError(data.message || 'Failed to load team members');
                }
            } catch (err) {
                setError('Network error. Please try again later.');
            }
        }

        fetchMembers();
    }, []);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/advertisement/available");
                const data = await response.json();
                if (response.ok) setAd(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAds();
    }, []);

    const stats = [
        { number: "500+", label: "સભ્યો", sublabel: "Members" },
        { number: "25+", label: "વર્ષો", sublabel: "Years" },
        { number: "100+", label: "પ્રોગ્રામ્સ", sublabel: "Programs" },
        { number: "50+", label: "પરિવારો", sublabel: "Families Helped" }
    ];

    const services = [
        {
            title: "તેજસ્વી તારલા સન્માન સમારંભ",
            description: "સમુદાયના ઉત્તમ સભ્યોને સન્માનિત કરવાનો વાર્ષિક સમારંભ",
            icon: "🏆"
        },
        {
            title: "જીવન સાથી સંમેલન",
            description: "અમારા સમુદાયમાં લગ્ન માટેની જોડીઓ માટેનો નેટવર્કિંગ કાર્યક્રમ",
            icon: "💑"
        },
        {
            title: "યુવાવિકાસ તથા સંસ્કૃતિક પ્રવૃતિઓ",
            description: "યુવા પ્રતિભાઓ અને સાંસ્કૃતિક વિરાસતને પોષવા માટેના કાર્યક્રમો",
            icon: "🎭"
        },
        {
            title: "ધાર્મિક વ્યાખ્યાનો",
            description: "પ્રખ્યાત વિદ્વાનો દ્વારા આધ્યાત્મિક ઉપદેશ",
            icon: "🕉️"
        },
        {
            title: "બેરોજગારોને રોજગાર કાર્યક્રમ",
            description: "કૌશલ્ય વિકાસ અને રોજગાર મૂકવાની પહેલ",
            icon: "💼"
        },
        {
            title: "મહિલા ઉત્કર્ષ પ્રવૃતિઓ",
            description: "મહિલાઓના વિકાસ અને પ્રગતિ પર ધ્યાન કેન્દ્રિત પ્રવૃતિઓ",
            icon: "👩"
        }
    ];

    const [eventsData, setEventsData] = useState([]);

    useEffect(() => {
        const dispEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events/display');
                const data = await response.json();
                if (response.ok) {
                    const currentDate = new Date();
                    data.events = data.events.filter(event => new Date(event.eventDateTime) > currentDate);
                    setEventsData(data.events);
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

    function formatEventDateTime(eventDateTime) {
        // Handle both Date objects and ISO strings
        const date = new Date(eventDateTime);

        if (isNaN(date.getTime())) {
            return "Invalid date";
        }

        // Days and months arrays
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Get components
        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dateNum = date.getDate();
        const year = date.getFullYear();

        // Format time (12-hour with AM/PM)
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        // Return multiple formatted versions
        return {
            dayName,                   // "Monday"
            dateNum,                   // 15
            year,                      // 2023
            monthName: date.toLocaleString('default', { month: 'long' }),
            monthShort: date.toLocaleString('default', { month: 'short' }),
            time12hr: `${hours}:${minutes} ${ampm}`,  // "2:30 PM"
            time24hr: `${date.getHours().toString().padStart(2, '0')}:${minutes}`, // "14:30"
            fullDate: `${dayName}, ${monthName} ${dateNum}, ${year}`, // "Monday, January 15, 2023"
            shortDate: `${monthName.slice(0, 3)} ${dateNum}, ${year}`, // "Jan 15, 2023"
            dateTime: `${monthName.slice(0, 3)} ${dateNum} at ${hours}:${minutes} ${ampm}` // "Jan 15 at 2:30 PM"
        };
    }

    function LeadershipTeam() {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Core Committee</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mt-2">
                        Meet the dedicated core committee guiding our community
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
                    {members.map((leader) => (
                        <div key={leader._id} className="text-center">
                            <img
                                src={"http://localhost:5000" + leader.photo}
                                alt={leader.firstName}
                                className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg mb-4 border-4 border-gray-200"
                            />
                            <h3 className="text-xl font-semibold text-slate-800">
                                {leader.firstName + " " + leader.lastName}
                            </h3>
                            <p className={`mt-1 text-sm font-semibold ${leader.role === "President"
                                ? "text-lime-600"
                                : leader.role === "Past-President"
                                    ? "text-lime-600"
                                    : leader.role === "President-elect"
                                        ? "text-lime-600"
                                        : "text-gray-500"
                                }`}>
                                {leader.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            <HeroSection />

            {/* Stats Section - Modern Gradient Cards */}
            <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group">
                                <div className="text-4xl font-bold mb-3 bg-indigo-900 bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</h3>
                                <p className="text-sm text-gray-600">{stat.sublabel}</p>
                                <div className="mt-3 h-1 w-10 bg-indigo-700 rounded-full group-hover:w-16 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Advertisement - Modern Card */}
            {ad.find(ad => ad.side === "top" && ad.status === "Booked" && ad.image) && (
                <section className="w-full bg-white py-12 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center mb-6">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                Sponsored Advertisment
                            </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group">
                            <div className="aspect-[16/5] w-full">
                                <img
                                    src={"http://localhost:5000" + ad.find(a => a.side === "top" && a.status === "Booked")?.image}
                                    alt="Advertisement"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <LeadershipTeam />

            {/* Community Events & Programs */}
            <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Community Events & Programs</h2>
                        <div className="w-16 h-1 bg-indigo-500 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-indigo-100 group">
                                <div className="flex items-start">
                                    <div className="text-3xl mr-4 text-indigo-600 transition-colors">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/about')}
                            className="px-5 py-2 bg-amber-900 text-white font-medium rounded-md cursor-pointer shadow hover:shadow-md text-sm"
                        >
                            See All Events and Programs
                        </button>
                    </div>
                </div>
            </section>

            {/* Middle Advertisement - Full-width Banner */}
            {ad.find(ad => ad.side === "middle" && ad.status === "Booked" && ad.image) && (
                <section className="w-full bg-white py-12 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center mb-6">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                Sponsored Advertisment
                            </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group">
                            <div className="aspect-[16/5] w-full">
                                <img
                                    src={"http://localhost:5000" + ad.find(a => a.side === "middle" && a.status === "Booked")?.image}
                                    alt="Advertisement"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            <section className="bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Gallery</h2>
                        <div className="w-40 h-1 bg-indigo-900 mx-auto"></div>
                    </div>
                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img1.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img2.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img3.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img4.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img5.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img6.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img7.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <img
                                src="./galary-img8.jpg"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom Advertisement - Card with Border */}
            {ad.find(ad => ad.side === "bottom" && ad.status === "Booked" && ad.image) && (
                <section className="w-full bg-white py-12 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center mb-6">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                Sponsored Advertisment
                            </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group">
                            <div className="aspect-[16/5] w-full">
                                <img
                                    src={"http://localhost:5000" + ad.find(a => a.side === "bottom" && a.status === "Booked")?.image}
                                    alt="Advertisement"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Events - Calendar Cards */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Community Events</h2>
                        <div className="w-20 h-1 bg-indigo-500 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventsData.map((e, i) => (
                            <div key={i} onClick={() => navigate("/events")} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-lg p-3 text-center min-w-[70px] mr-5">
                                            <div className="text-2xl font-bold leading-tight">
                                                {formatEventDateTime(e.eventDateTime).dateNum}
                                            </div>
                                            <div className="text-xs sm:text-sm uppercase tracking-wider leading-tight">
                                                {formatEventDateTime(e.eventDateTime).monthShort}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{e.eventName}</h3>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{e.description}</p>
                                            <div className="flex items-center text-sm text-amber-700">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {
                                                    formatEventDateTime(e.eventDateTime).fullDate + " "
                                                    + formatEventDateTime(e.eventDateTime).time12hr
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">Vaishnav Vanik Samaj</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Homepage;
