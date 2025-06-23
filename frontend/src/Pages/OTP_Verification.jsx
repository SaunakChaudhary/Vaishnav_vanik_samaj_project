import React, { useState, useContext, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../Context/userContext';
import { Riple } from "react-loading-indicators";

const OTP_Verification = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { User } = useContext(UserDataContext);

  console.log(User)
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  const handleVerifyAndRegister = async () => {
    const form = new FormData();

    if (!User.photo || !(User.photo instanceof File)) {
      toast.error("Please upload a valid photo before verifying.");
      return;
    }

    for (let key in User) {
      if (key === 'photo') {
        if (User[key] instanceof File) {
          form.append('photo', User[key]);
        } else {
          toast.error("Invalid photo file.");
          return;
        }
      } else if (key === 'dob') {
        // Ensure dob is in correct format
        if (User[key]) {
          const dobString = new Date(User[key]).toISOString().split('T')[0]; // YYYY-MM-DD
          form.append('dob', dobString);
        } else {
          toast.error("Date of Birth is missing or invalid.");
          return;
        }
      } else {
        form.append(key, User[key]);
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: User.email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        await handleVerifyAndRegister();
      } else {
        toast.error(data.message);
        setOtp('');
      }
    } catch (err) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}

      <Navbar />

      <div className="max-w-md w-full mx-auto py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">OTP Verification</h2>
              <p className="mt-2 text-gray-600">Enter the 6-digit OTP sent to your email/phone</p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                className="w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-950 to-slate-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OTP_Verification;
