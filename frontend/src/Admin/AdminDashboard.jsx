import React, { useState, useEffect } from "react";
import Slidebar from '../Components/Slidebar';
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { FaUsers, FaAd, FaChartLine } from "react-icons/fa";
import {
  Users,
  Calendar,
  Megaphone,
  Heart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  IndianRupee,
  MessageCircle,
  Image
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
} from "recharts";

function DashboardCard({ title, value, icon: Icon, trend, trendValue, subtitle, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-600"
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <div className="text-xs sm:text-sm text-gray-500">{subtitle}</div>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCardBox() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "All The Request",
      description: "Accept or reject requests of the new users",
      icon: <FaUsers size={20} className="text-blue-600" />,
      path: "/admin/members",
      bg: "hover:bg-blue-50",
    },
    {
      title: "Ads Management",
      description: "Manage ad slots and bookings prices",
      icon: <FaAd size={20} className="text-green-600" />,
      path: "/admin/advertisement",
      bg: "hover:bg-green-50",
    },
    {
      title: "Inquiries",
      description: "View and download reports",
      icon: <MessageCircle size={20} className="text-yellow-600" />,
      path: "/admin/inquiry",
      bg: "hover:bg-yellow-50",
    },
    {
      title: "Gallery",
      description: "View and download reports",
      icon: <Image size={20} className="text-red-600" />,
      path: "/admin/gallery",
      bg: "hover:bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 sm:p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => navigate(card.path)}
          className={`group cursor-pointer bg-white p-3 sm:p-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${card.bg}`}
        >
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">{card.icon}</div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">{card.title}</h2>
              <p className="text-xs sm:text-sm text-gray-500">{card.description}</p>
              <p className="text-xs text-blue-600 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ➜ Click here
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonationChart({ donationData }) {
  return (
    <div className="rounded-xl overflow-hidden h-[250px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={donationData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#6b7280", fontSize: 10 }} 
            tickMargin={10}
          />
          <YAxis 
            tick={{ fill: "#6b7280", fontSize: 10 }} 
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#ffffff", 
              borderRadius: "8px", 
              border: "1px solid #e5e7eb",
              fontSize: "12px"
            }}
            labelStyle={{ color: "#374151", fontWeight: "600", fontSize: "12px" }}
            formatter={(value, name) => [`₹${value}`, name === 'amount' ? 'Donation Amount' : 'Donations Count']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            fill="url(#revenueGradient)"
            strokeWidth={2}
            dot={{ r: 2, fill: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MemberAnalyticsChart({ memberData }) {
  return (
    <div className="rounded-xl overflow-hidden h-[250px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={memberData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => tick.slice(5)}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickMargin={10}
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fill: "#6b7280", fontSize: 10 }} 
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "12px"
            }}
            labelStyle={{ color: "#374151", fontWeight: "600", fontSize: "12px" }}
            formatter={(value, name) => [
              `${value} ${name === 'newMembers' ? 'New Members' : 'Active Members'}`,
              ""
            ]}
          />
          <Line
            type="monotone"
            dataKey="newMembers"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#fff" }}
            activeDot={{ r: 5, fill: "#10b981" }}
          />
          <Line
            type="monotone"
            dataKey="activeMembers"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 2, stroke: "#6366f1", strokeWidth: 1, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [donationData, setDonationData] = useState([]);
  const [totalUsers, setTotalUsers] = useState();
  const [totalEvents, setTotalEvents] = useState();
  const [totalDonation, setTotalDonation] = useState();
  const [activeAds, setActiveAds] = useState(0);
  const [totalMembershipFees, setTotalMembershipFees] = useState(0);
  const [adRevenue, setAdRevenue] = useState(0);
  const [memberData, setMemberData] = useState([]);

  useEffect(() => {
    const fetchDataForDashboard = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/adminDashboard`);
      const data = await response.json();
      if (response.ok) {
        setTotalUsers(data.users)
        setTotalEvents(data.totalEvents)
        setTotalDonation(data.totalDonation)
        setActiveAds(data.activeAds)
        setTotalMembershipFees(data.totalMembershipAmount)
        setAdRevenue(data.totalAdvertisementAmount)
        setMemberData(data.memberData);
        setDonationData(data.donationData)
      }
      else {
        toast.error(data.message)
      }
    }
    fetchDataForDashboard();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 relative">
      <Slidebar highlight={"dashboard"} />

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 mt-16 md:mt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your community.</p>
          </div>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <DashboardCard
            title="Total Members"
            value={totalUsers?.toLocaleString() || '0'}
            icon={Users}
            subtitle="Active community members"
            color="blue"
          />
          <DashboardCard
            title="Total Events"
            value={totalEvents || '0'}
            icon={Calendar}
            subtitle="Events organized"
            color="green"
          />
          <DashboardCard
            title="Active Ads"
            value={activeAds || '0'}
            icon={Megaphone}
            subtitle="Currently running"
            color="yellow"
          />
          <DashboardCard
            title="Total Donations"
            value={`₹${totalDonation?.toLocaleString() || '0'}`}
            icon={Heart}
            subtitle="Till date"
            color="red"
          />
          <DashboardCard
            title="Membership Fees"
            value={`₹${totalMembershipFees?.toLocaleString() || '0'}`}
            icon={IndianRupee}
            subtitle="Total collected"
            color="purple"
          />
          <DashboardCard
            title="Ad Revenue"
            value={`₹${adRevenue?.toLocaleString() || '0'}`}
            icon={BarChart3}
            subtitle="Advertisement income"
            color="indigo"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Donation Analytics */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Donation Analytics</h2>
                <p className="text-xs sm:text-sm text-gray-600">Daily donation trends</p>
              </div>
            </div>
            <DonationChart donationData={donationData} />
          </div>

          {/* Member Growth */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Member Growth</h2>
                <p className="text-xs sm:text-sm text-gray-600">New vs active members</p>
              </div>
            </div>
            <MemberAnalyticsChart memberData={memberData} />
          </div>
        </div>
        
        <AdminCardBox />
      </main>
    </div>
  );
}