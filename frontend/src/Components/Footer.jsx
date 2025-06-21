import React from 'react'
import { ChevronLeft, ChevronRight, Users, Target, Eye, Flag, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (

        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <img src="./footer-logo.png" alt="" />
                            </div>
                            <div className="text-2xl font-bold">Shree Vaishnav Vanik Samaaj</div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            A community organization dedicated to preserving our cultural heritage while fostering unity, growth, and prosperity among all members.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><NavLink to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</NavLink></li>
                            <li><NavLink to="/contact" className="text-gray-300 hover:text-white transition-colors">Inquiry</NavLink></li>
                            <li><NavLink to="/events" className="text-gray-300 hover:text-white transition-colors">Events</NavLink></li>
                            <li><NavLink to="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</NavLink></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-300">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-300">info@svvs.org</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-300">Ahmedabad, Gujarat</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2025 Shree Vaishnav Vanik Samaaj. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
