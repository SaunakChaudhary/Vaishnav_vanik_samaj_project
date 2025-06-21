/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaLock } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { token } = useParams(); // Assuming your route is like /reset-password/:token
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Password reset successfully');
                setPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.message || 'Reset failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-50 min-h-screen">
            <Navbar />
            <section className="pt-24 pb-24 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reset Your Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-gradient-to-r from-blue-950 to-slate-700 text-white py-3 rounded-md font-semibold"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ResetPassword;
