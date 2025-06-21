import React, { useState, useEffect, useContext } from 'react';
import { Phone, Gift, Calendar } from 'lucide-react';
import { UserDataContext } from '../Context/userContext';

const WhatsAppIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.07.002C6.48-.2 1.7 4.348 1.7 9.941c0 1.708.42 3.389 1.215 4.897L.02 23.002l8.33-2.159a11.935 11.935 0 0 0 3.75.604c6.58 0 11.937-5.356 11.937-11.936a11.932 11.932 0 0 0-3.517-8.33zM12.1 21.06a9.76 9.76 0 0 1-3.252-.558l-.232-.08-4.944 1.282 1.312-4.819-.151-.248a9.751 9.751 0 0 1-1.408-5.11c0-5.387 4.379-9.766 9.766-9.766a9.707 9.707 0 0 1 6.922 2.872 9.706 9.706 0 0 1 2.872 6.921c0 5.387-4.379 9.766-9.766 9.766zm5.48-7.337c-.3-.15-1.768-.872-2.04-.971-.274-.1-.474-.15-.673.15s-.773.97-.946 1.17-.35.224-.649.075a8.016 8.016 0 0 1-2.34-1.443 8.78 8.78 0 0 1-1.623-2.008c-.174-.3-.019-.463.13-.613.133-.132.3-.35.448-.524.15-.175.2-.3.3-.5.1-.199.05-.374-.025-.524-.075-.15-.675-1.623-.924-2.225-.244-.584-.492-.504-.673-.513l-.573-.01c-.2 0-.524.075-.8.374s-1.05 1.024-1.05 2.498 1.075 2.9 1.225 3.1c.15.2 2.113 3.226 5.125 4.52.716.31 1.273.494 1.707.633.716.227 1.37.195 1.885.118.575-.085 1.768-.723 2.018-1.42.25-.699.25-1.297.175-1.42-.074-.125-.275-.2-.575-.35z" />
  </svg>
);

const Notifications = ({ setActiveTab = () => {} }) => {
  const { LoggedInUser } = useContext(UserDataContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToDaysBirthday = async () => {
      const response = await fetch('http://localhost:5000/api/birthday/today-birthday');
      const data = await response.json();
      if (response.ok) setUsers(data);
      setLoading(false);
    };

    fetchToDaysBirthday();
  }, []);

  const getBirthdayUsers = () => {
    return users.filter((user) => {
      return (
        user._id === LoggedInUser._id
      );
    });
  };

  const isMyBirthday = () => {
    const today = new Date();
    const dob = new Date(LoggedInUser.dob);
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
  };

  const generateWhatsAppMessage = (user) => {
    return `*Happy Birthday ${user.firstName} ${user.lastName}!* \n\nWishing you a day filled with joy, success, and blessings.\n\nWarm regards,\n${LoggedInUser.firstName} ${LoggedInUser.lastName}\n*Vaishnav Vanik Samaaj*`;
  };

  const handleWhatsAppWish = (user) => {
    const message = generateWhatsAppMessage(user);
    const phone = user.phone_number?.replace(/[^\d]/g, '');
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  };

  const handlePhoneCall = (user) => {
    if (user.phone) window.location.href = `tel:${user.phone}`;
    else alert('Phone number not available');
  };

  const birthdayUsers = getBirthdayUsers();

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl text-slate-800 font-bold flex items-center gap-2">
              <Gift className="text-indigo-600" size={36} />
              Today's Birthdays
            </h1>
            <p className="text-slate-500">Celebrate special moments with your community</p>
          </div>

          {isMyBirthday() && (
            <div className="w-full sm:w-auto">
              <div
                onClick={() => setActiveTab('donation')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md cursor-pointer transform hover:scale-105"
              >
                <span className="mr-2 text-2xl">🎂</span>
                <span className="font-semibold">It's Your Birthday! Consider Donating</span>
              </div>
            </div>
          )}
        </div>

        {/* Birthday Users */}
        <div className="bg-white rounded-xl shadow border border-slate-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800">Birthday Celebrations</h2>
            <p className="text-slate-500 font-semibold">Send warm wishes to your fellow members</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12 text-slate-600">
                <div className="animate-spin h-6 w-6 border-4 border-indigo-600 border-t-transparent rounded-full mr-3"></div>
                Loading birthdays...
              </div>
            ) : birthdayUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No Birthdays Today</h3>
                <p>Check back tomorrow!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {birthdayUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-slate-50 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={"http://localhost:5000" +user.photo}
                          alt={user.firstName}
                          className="w-16 h-16 rounded-full border-4 border-white shadow object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs">
                          🎂
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-indigo-600 font-medium">🎉 Birthday today!</p>
                        <p className="text-sm text-slate-500">Wishing them an awesome year ahead</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => handleWhatsAppWish(user)}
                        className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition transform hover:scale-105"
                      >
                        <WhatsAppIcon size={18} className="mr-2" />
                        WhatsApp
                      </button>

                      <button
                        onClick={() => handlePhoneCall(user)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                      >
                        <Phone size={18} className="mr-2" />
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500">
          🎈 Make someone’s day better with a simple wish 🎈
        </div>
      </div>
    </div>
  );
};

export default Notifications

