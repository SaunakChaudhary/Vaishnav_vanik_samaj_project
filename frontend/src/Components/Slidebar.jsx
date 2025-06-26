import React, { useState } from 'react';
import { 
  Menu, X, LogOut, LayoutDashboard, Calendar, Users, 
  Image, Megaphone, UserCheck, Shield, MessageCircle, 
  Heart, CalendarClock, Speaker, ChevronDown, ChevronUp 
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

const Slidebar = ({ highlight }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const toggleItem = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      active: highlight === "dashboard"
    },
    {
      title: "Events",
      icon: Calendar,
      subItems: [
        { title: "Upcoming Events", path: "/admin/events", active: highlight === "events" },
        { title: "Event Registrations", path: "/admin/event-members", active: highlight === "eventMembers" }
      ]
    },
    {
      title: "Members",
      icon: Users,
      path: "/admin/members",
      active: highlight === "members"
    },
    {
      title: "Content",
      icon: Image,
      subItems: [
        { title: "Gallery", path: "/admin/gallery", active: highlight === "gallery" },
        { title: "Announcements", path: "/admin/announcements", active: highlight === "announcements" }
      ]
    },
    {
      title: "Advertisement",
      icon: Megaphone,
      path: "/admin/advertisement",
      active: highlight === "advertise"
    },
    {
      title: "Management",
      icon: Shield,
      subItems: [
        { title: "Team", path: "/admin/management-team", active: highlight === "managementTeam" },
        { title: "Meetings", path: "/admin/meetings", active: highlight === "meetings" }
      ]
    },
    {
      title: "Support",
      icon: MessageCircle,
      subItems: [
        { title: "Inquiries", path: "/admin/inquiry", active: highlight === "inquiry" },
        { title: "Donations", path: "/admin/donation", active: highlight === "donation" }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Topbar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 w-full flex justify-between items-center bg-white shadow-md px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <img src="../footer-logo.png" alt="logo" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-bold text-sm text-gray-800">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isMobile ? 
            `w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}` : 
            'w-64 translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="flex items-center gap-3">
            <img src="../footer-logo.png" alt="logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="font-bold text-lg text-white">Vaishnav Vanik</p>
              <p className="text-xs text-blue-100">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100vh-112px)] overflow-y-auto">
          <nav className="p-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center justify-between p-3 rounded-lg mb-1 transition-colors duration-200
                      ${isActive || item.active ? 
                        'bg-blue-100 text-blue-700 font-medium' : 
                        'text-gray-600 hover:bg-gray-100'}`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </NavLink>
                ) : (
                  <>
                    <div
                      onClick={() => toggleItem(item.title)}
                      className={`flex items-center justify-between p-3 rounded-lg mb-1 cursor-pointer transition-colors duration-200
                        ${expandedItems[item.title] ? 'bg-gray-50' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-gray-700">{item.title}</span>
                      </div>
                      {expandedItems[item.title] ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedItems[item.title] && (
                      <div className="ml-8 mt-1 mb-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            className={({ isActive }) => 
                              `block p-2 pl-4 rounded-lg mb-1 text-sm transition-colors duration-200
                              ${isActive || subItem.active ? 
                                'bg-blue-50 text-blue-600 font-medium' : 
                                'text-gray-600 hover:bg-gray-100'}`
                            }
                          >
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Slidebar;