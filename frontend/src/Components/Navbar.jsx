import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserDataContext } from '../Context/userContext';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { LoggedInUser } = useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-container')) {
        setIsOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-semibold transition-all duration-300 group ${isActive
      ? 'text-amber-700'
      : 'text-gray-700 hover:text-amber-700'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-6 py-4 text-base font-medium transition-all duration-300 border-l-4 ${isActive
      ? 'text-amber-700 border-amber-700 bg-amber-50'
      : 'text-gray-700 border-transparent hover:text-amber-700 hover:border-amber-300 hover:bg-gray-50'
    }`;

  return (
    <div className='mb-15'>
      <nav className={`navbar-container fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-amber-100'
        : 'bg-white shadow-md'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-3 group">
                <div className="relative overflow-hidden rounded-lg p-1">
                  <img
                    src="/footer-logo.png"
                    alt="Vaishnav Vanik Samaj Logo"
                    className="h-12 lg:h-14 w-12 lg:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg lg:text-xl font-bold text-amber-800 leading-tight">
                    વૈષ્ણવ વણિક સમાજ
                  </h1>
                  <p className="text-xs lg:text-sm text-amber-600 font-medium">
                    આણંદ
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/management-teams", label: "Management" },
                { to: "/events", label: "Events" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" }
              ].map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}

              {/* Auth Section */}
              {!LoggedInUser?.firstName ? (
                <NavLink
                  to="/login"
                  className={navLinkClass}>
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ) : (
                <>{(
                  LoggedInUser?.role === "president" ||
                  LoggedInUser?.role === "vice president" ||
                  LoggedInUser?.role === "secretary" ||
                  LoggedInUser?.role === "board member")
                  && <NavLink
                    to="/meetings"
                    className={navLinkClass}>
                    Meetings

                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                }
                  <div className="relative ml-6">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-3 px-4 py-2.5 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        <img src={`${process.env.REACT_APP_API_URL}` + LoggedInUser.photo} alt="ProfilePhoto" className='rounded-full w-8 h-8' />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-amber-800">
                        {LoggedInUser.firstName} {LoggedInUser.lastName}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {LoggedInUser.firstName} {LoggedInUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {LoggedInUser.email || 'Welcome back!'}
                          </p>
                        </div>
                        <NavLink
                          to="/dashboard"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200"
                          onClick={closeDropdown}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3" />
                          Dashboard
                        </NavLink>
                        <NavLink
                          to="/logout"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                          onClick={closeDropdown}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </NavLink>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-500 ease-in-out ${isOpen
            ? 'max-h-screen opacity-100 pb-6'
            : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
            <div className="pt-4 space-y-1 border-t border-amber-100">
              {/* Mobile Logo Text */}
              <div className="sm:hidden px-6 py-3 border-b border-amber-100 mb-2">
                <h2 className="text-lg font-bold text-amber-800">
                  Vaishnav Vanik Samaj
                </h2>
                <p className="text-sm text-amber-600 font-medium">
                  Anand
                </p>
              </div>

              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/management-teams", label: "Management Team" },
                { to: "/events", label: "Events" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" }
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
              {(
                LoggedInUser?.role === "president" ||
                LoggedInUser?.role === "vice president" ||
                LoggedInUser?.role === "secretary" ||
                LoggedInUser?.role === "board member")
                && <NavLink
                  to="/meetings"
                  className={mobileNavLinkClass}
                >
                  Meetings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              }
              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-amber-100">
                {!LoggedInUser?.firstName ? (
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="block mx-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-full text-center hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg"
                  >
                    Login
                  </NavLink>
                ) : (
                  <>
                    <div className="px-6 space-y-2">
                      <div className="flex items-center space-x-3 px-4 py-3 bg-amber-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                          {LoggedInUser.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {LoggedInUser.firstName} {LoggedInUser.lastName}
                          </p>
                          <p className="text-sm text-gray-500">Welcome back!</p>
                        </div>
                      </div>
                      <NavLink
                        to="/dashboard"
                        onClick={closeMenu}
                        className={mobileNavLinkClass}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 inline" />
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/logout"
                        onClick={closeMenu}
                        className="block px-6 py-4 text-base font-medium text-red-600 border-l-4 border-transparent hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-3 inline" />
                        Logout
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav >
    </div >
  );
};

export default Navbar;