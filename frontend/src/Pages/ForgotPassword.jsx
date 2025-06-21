/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { toast } from 'react-hot-toast';
import { Riple } from 'react-loading-indicators';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Reset link sent to your email');
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
      setLoading(false);
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-50 min-h-screen">
      {
        loading && <div className="fixed inset-0 z-50 bg-gray-900 opacity-50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      }
      <Navbar />

      <section className="pt-24 pb-24 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your email address and we’ll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-blue-950 to-slate-700 text-white py-3 rounded-md font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
