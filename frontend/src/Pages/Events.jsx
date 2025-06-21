import React, { useContext, useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventRegistrationForm from '../Components/EventRegistrationForm';
import { UserDataContext } from '../Context/userContext';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [eventsData, setEventsData] = useState([]);
  const { LoggedInUser } = useContext(UserDataContext);
  const [eventDetails, setEventsDetails] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/display');
        const data = await response.json();
        if (response.ok) {
          setEventsData(data.events || []);
        } 
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Error loading events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!LoggedInUser?._id) return;

      try {
        const response = await fetch('http://localhost:5000/api/events/event-registration-members');
        const data = await response.json();
        if (response.ok) {
          const userRegisteredEvents = data.registrations
            .filter(reg => reg.member?._id?.toString() === LoggedInUser._id.toString())
            .map(reg => reg.event._id);

          setRegisteredEventIds(new Set(userRegisteredEvents));
        }
      } catch (err) {
        console.error(err);
        toast.error("Error checking registration status");
      }
    };

    fetchRegistrationData();
  }, [LoggedInUser]);

  function formatEventDateTime(eventDateTime) {
    const date = new Date(eventDateTime);
    if (isNaN(date.getTime())) return "Invalid date";

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
      dayName,
      monthName,
      dateNum,
      year,
      time12hr: `${hours}:${minutes} ${ampm}`,
      fullDate: `${dayName}, ${monthName} ${dateNum}, ${year}`,
      shortDate: `${monthName} ${dateNum}, ${year}`,
      dateTime: `${monthName} ${dateNum} at ${hours}:${minutes} ${ampm}`
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-blue-900">Upcoming Events</h2>

        {eventsData.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No upcoming events</h3>
            <p className="text-gray-500">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {eventsData.map(event => {
              const eventDate = formatEventDateTime(event.eventDateTime);
              const regEndDate = formatEventDateTime(event.lastRegistrationDate);
              const isRegistrationClosed = new Date(event.lastRegistrationDate) < new Date();
              const isRegistered = registeredEventIds.has(event._id);

              return (
                <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 sm:h-56 w-full overflow-hidden">
                    <img
                      src={"http://localhost:5000" + event.eventPhoto}
                      alt={event.eventName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-event.jpg';
                        e.target.className = 'h-full w-full object-contain bg-gray-100 p-4';
                      }}
                    />
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{event.eventName}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-start text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{eventDate.dateTime}</span>
                      </div>

                      <div className="flex items-start text-gray-700">
                        <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{eventDate.time12hr}</span>
                      </div>

                      <div className={`flex items-start ${isRegistrationClosed ? 'text-red-600' : 'text-gray-700'}`}>
                        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          {isRegistrationClosed ? 'Registration closed' : `Register by ${regEndDate.shortDate}`}
                        </span>
                      </div>
                    </div>

                    {LoggedInUser?._id && (
                      <div className="mt-4">
                        {isRegistered ? (
                          <button
                            disabled
                            className="w-full py-2 px-4 bg-green-50 text-green-700 font-medium rounded-lg flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Already Registered
                          </button>
                        ) : isRegistrationClosed ? (
                          <button
                            disabled
                            className="w-full py-2 px-4 bg-gray-100 text-gray-500 font-medium rounded-lg"
                          >
                            Registration Closed
                          </button>
                        ) : (
                          <button
                            onClick={() => setEventsDetails(event)}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {eventDetails && (
          <EventRegistrationForm
            setEventsDetails={setEventsDetails}
            eventDetails={eventDetails}
            onRegistrationSuccess={() => {
              setRegisteredEventIds(prev => new Set([...prev, eventDetails._id]));
              setEventsDetails(null);
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Events;