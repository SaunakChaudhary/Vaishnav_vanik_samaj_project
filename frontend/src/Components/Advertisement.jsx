import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../Context/userContext';
import 'remixicon/fonts/remixicon.css'
import { toast } from "react-hot-toast";
import { Riple } from 'react-loading-indicators';
function AdSlotBookingSystem() {
  const { LoggedInUser } = useContext(UserDataContext);

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({
    userId: LoggedInUser._id,
    toDate: '',
    days: 1
  });
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchSlots = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/available`);
    const data = await res.json();
    setSlots(data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const getSlotIcon = (side) => {
    const icons = {
      top: <i className="ri-arrow-up-double-line"></i>,
      bottom: <i className="ri-arrow-down-double-line"></i>,
      middle: <i className="ri-align-vertically"></i>,
    };
    return icons[side] || '📍';
  };

  const getSlotGradient = (side) => {
    const gradients = {
      top: 'from-purple-500 via-pink-500 to-red-500',
      bottom: 'from-blue-500 via-cyan-500 to-teal-500',
      middle: 'from-green-500 via-emerald-500 to-blue-500',
    };
    return gradients[side] || 'from-gray-500 to-gray-600';
  };

  const getSlotPosition = (side) => {
    const positions = {
      top: 'Header Banner',
      bottom: 'Footer Banner',
      middle: 'Middle Banner',
    };
    return positions[side] || 'Unknown Position';
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const calculateTotal = () => {
    if (!selectedSlot || !bookingData.days) return 0;
    return selectedSlot.pricePerDay * bookingData.days;
  };

  const addToDatabase = async (side, transactionId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, side, toDate: bookingData.toDate, userId: bookingData.userId, amount: calculateTotal(), duration: bookingData.days }),
    });

    const data = await res.json();
    toast.success(`Slot booked successfully! Total: ₹${calculateTotal()}`);
    setShowBookingModal(false);
    setBookingData({ userEmail: '', toDate: '', days: 1 });
    setLoading(false);
    fetchSlots();
  }

  const handleSubmitBooking = async (side,) => {
    if (!bookingData.userId || !bookingData.toDate) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update slot status
    setSlots(prev => prev.map(slot =>
      slot.side === selectedSlot.side
        ? { ...slot, status: 'Booked', availableAfter: bookingData.toDate }
        : slot
    ));

    try {
      const amount = calculateTotal();
      // Step 1: Create Razorpay Order
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      const { id: order_id, currency, amount: orderAmount } = data.order;

      const options = {
        key: "rzp_test_hf54kCj6NjigUj",
        amount: orderAmount,
        currency,
        order_id,
        name: "Vaishnav Vanik Aamaaj",
        description: "",
        handler: async (response) => {
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: LoggedInUser.email,
              mailPurpose: "Advertisement Slot Booking",
              amount,
              name: LoggedInUser.firstName + " " + LoggedInUser.lastName
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment Successful");
            addToDatabase(side, response.razorpay_payment_id);
          } else {
            toast.error("Payment Failed");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = (date) => {
    const fromDate = new Date();
    const toDate = new Date(date);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    setBookingData(prev => ({
      ...prev,
      toDate: date,
      days: Math.max(1, days)
    }));
  };

  const [advImage, setAdvImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e, side) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', advImage);
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/add-advertise-image/${side}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Advertisement image uploaded successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div className="min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900 opacity-50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {slots.filter(s => s.status === 'Available').length}
                </p>
                <p className="text-gray-600">Available Slots</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">₹100+</p>
                <p className="text-gray-600">Starting Price</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">24/7</p>
                <p className="text-gray-600">Visibility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {slots.map((slot) => (
            <div key={slot.side} className="group relative">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
                {/* Header */}
                <div className={`relative h-32 bg-gradient-to-br ${getSlotGradient(slot.side)} p-6`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                        {getSlotIcon(slot.side)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{slot.side.toUpperCase()}</h3>
                        <p className="text-white/80 text-sm">{getSlotPosition(slot.side)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${slot.status === 'Available'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                      {slot.status === 'Available' ? '🟢 Available' : '🔴 Booked'}
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">₹{slot.pricePerDay}</p>
                      <p className="text-gray-500 text-sm">per day</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Prime visibility location</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Mobile responsive design</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Analytics dashboard</span>
                    </div>
                  </div>

                  {/* Availability Info */}
                  {slot.status === 'Booked' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-700 text-sm font-medium">
                        📅 Available after: {new Date(slot.availableAfter).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {
                    slot.bookedBy === LoggedInUser._id ?
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Your Active Advertisement</h3>
                        <form onSubmit={(e) => handleSubmit(e, slot.side)} className="border rounded-xl p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => { setAdvImage(e.target.files[0]) }}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                          />
                          <p className="mt-2 text-sm text-gray-500">Upload your advertisement image</p>
                          <p className="mt-2 text-sm text-gray-500">Recommended image size: 1920x400 pixels (16:3 to 16:4 aspect ratio)</p>
                          <button
                            type="submit"
                            className="mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                          >
                            Upload Advertisement
                          </button>
                        </form>
                      </div>
                      :
                      <button
                        onClick={() => handleBookSlot(slot)}
                        disabled={slot.status === 'Booked'}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${slot.status === 'Available'
                          ? `bg-gradient-to-r ${getSlotGradient(slot.side)} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {slot.status === 'Available' ? '🚀 Book This Slot' : '⏰ Currently Unavailable'}
                      </button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${getSlotGradient(selectedSlot.side)} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {getSlotIcon(selectedSlot.side)}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Book {selectedSlot.side.toUpperCase()} Slot
              </h2>
              <p className="text-gray-600">{getSlotPosition(selectedSlot.side)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign End Date
                </label>
                <input
                  type="date"
                  value={bookingData.toDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all"
                />
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per day:</span>
                  <span>₹{selectedSlot.pricePerDay}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span>{bookingData.days} days</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 px-6 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitBooking(selectedSlot.side,)}
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${getSlotGradient(selectedSlot.side)} hover:shadow-lg`
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Booking...</span>
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdSlotBookingSystem;