import React, { useState, useContext, useEffect } from 'react';
import { Mail, Phone, User, MapPin, Landmark, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { NavLink } from "react-router-dom"
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../Context/userContext';
import { Riple } from "react-loading-indicators";

const SignupForm = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext);

    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        phone: '',
        wp_number: '',
        city: '',
        pincode: '',
        state: '',
        address: '',
        caste: '',
        profession: '',
        professionAddress: '',
        photo: null,
        dob: '',
        country: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const pincodeRegex = /^[0-9]{6}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

        // Required fields validation
        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
        if (formData.wp_number && !phoneRegex.test(formData.wp_number)) newErrors.wp_number = 'WhatsApp number must be 10 digits';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must be at least 8 characters with at least one letter and one number';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!pincodeRegex.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.caste.trim()) newErrors.caste = 'Caste is required';
        if (!formData.profession.trim()) newErrors.profession = 'Profession is required';

        // Age validation (at least 18 years old)
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            let monthDiff = today.getMonth() - dobDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age < 18) newErrors.dob = 'You must be at least 18 years old';
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

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setUser(formData);
                navigate("/otp-verification");
                setFormData({
                    firstname: '', middlename: '', lastname: '', email: '', phone: '',
                    city: '', pincode: '', state: '', address: '', caste: '',
                    profession: '', professionAddress: '',
                    photo: null, dob: '', country: '', password: '', wp_number: '', confirmPassword: ''
                });
            } else {
                toast.error(data.message || "Something went wrong");
            }

            setTimeout(() => setSignupSuccess(false), 3000);
        } catch (error) {
            setErrors({ general: 'Signup failed. Please try again.' });
            toast.error("Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50">
            {
                isLoading && <div className="fixed inset-0 z-50 bg-gray-900 opacity-50 flex justify-center items-center">
                    <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
                </div>
            }
            <Navbar />
            <div className="max-w-2xl w-full mx-auto my-10 pt-10">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                            <p className="mt-2 text-gray-600">Fill in your details to register</p>
                        </div>

                        {/* Row: Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['firstname', 'middlename', 'lastname'].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field.replace('name', ' Name')}</label>
                                    <input
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder={`Enter ${field}`}
                                        required={field !== 'middlename'}
                                    />
                                    {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Email, Phone, DOB */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'email', icon: Mail, placeholder: 'Email', type: 'email' },
                                { name: 'phone', icon: Phone, placeholder: 'Phone Number', type: 'tel' },
                                { name: 'dob', icon: User, placeholder: 'Date of Birth', type: 'date' },
                            ].map(({ name, icon: Icon, placeholder, type = 'text' }, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{placeholder}</label>
                                    <div className="relative">
                                        <div className="absolute left-2 top-2.5 text-gray-400">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <input
                                            name={name}
                                            type={type}
                                            value={formData[name]}
                                            onChange={handleInputChange}
                                            className={`w-full pl-9 py-2 border rounded-md ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder={placeholder}
                                            required
                                        />
                                    </div>
                                    {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Password and Confirm Password */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="wp_number"
                                        value={formData.wp_number}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.wp_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="Enter WhatsApp Number"
                                    />
                                    {errors.wp_number && <p className="text-sm text-red-600 mt-1">{errors.wp_number}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="Enter password"
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="Confirm password"
                                        required
                                    />
                                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="block text-sm font-medium mb-1 capitalize">Profile Photo</label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        photo: e.target.files[0]
                                    }))
                                }
                                className="w-full px-3 py-2 border rounded-md border-gray-300"
                                required
                            />
                        </div>

                        {/* City, Pincode, State */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['city', 'pincode', 'state'].map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                                    <input
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder={`Enter ${field}`}
                                        required
                                    />
                                    {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium mb-1 capitalize">Address</label>
                            <textarea
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Enter Address Here"
                                required
                            />
                            {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                        </div>

                        {/* Country, Caste, Profession */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['country', 'caste', 'profession'].map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                                    <input
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder={`Enter ${field}`}
                                        required
                                    />
                                    {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Profession Address */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Profession Address</label>
                            <textarea
                                name="professionAddress"
                                value={formData.professionAddress}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.professionAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Enter profession address"
                            />
                            {errors.professionAddress && <p className="text-sm text-red-600 mt-1">{errors.professionAddress}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-950 to-slate-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-950 hover:to-slate-700 focus:ring-4 focus:ring-orange-200 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Registering...</span>
                                </div>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <NavLink to="/login" className="text-orange-600 hover:text-orange-500 font-medium">
                                Login here
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignupForm;