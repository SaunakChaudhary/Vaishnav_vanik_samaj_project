import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { NavLink, useNavigate } from "react-router-dom";
import { UserDataContext } from '../Context/userContext';
import { Riple } from "react-loading-indicators";
import { toast } from 'react-hot-toast';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const { setLoggedInUser } = useContext(UserDataContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Login successful!");
                localStorage.setItem("token", data.token);
                setLoggedInUser(data.user);
                navigate("/");
            } else {
                if (data.pending) {
                    toast("Your request is pending. We will notify you when your membership is accepted.", {
                        icon: "⏳",
                    });
                } else {
                    toast.error(data.message || "Invalid credentials");
                }
            }

        } catch (error) {
            toast.error("Login failed. Please try again.");
            setErrors({ general: 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
            setFormData({ email: '', password: '' });
            setTimeout(() => setLoginSuccess(false), 3000);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50">
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-gray-900 opacity-50 flex justify-center items-center">
                    <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
                </div>
            )}
            <Navbar />
            <div className="max-w-md w-full mx-auto py-20">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className="p-4 bg-red-100 border border-red-400 rounded-lg flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span className="text-red-700">{errors.general}</span>
                            </div>
                        )}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                            <p className="mt-2 text-gray-600">Please sign in to your account</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-slate-600 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <NavLink to="/forgot-password" className="text-sm font-medium text-slate-800 hover:text-slate-700">Forgot password?</NavLink>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-950 to-slate-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="mt-2 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <NavLink to="/signup" className="text-orange-600 hover:text-orange-500 font-medium">
                                Sign up here
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginForm;
