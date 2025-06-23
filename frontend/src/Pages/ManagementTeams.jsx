import React, { useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Crown, Landmark, ClipboardList, Users, Loader2, MapPin, AlertCircle } from 'lucide-react';

const Team = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/display`);
        const data = await response.json();

        if (response.ok) {
          const filteredMembers = data.membersDetails.filter(mem =>
            mem.role === "president" ||
            mem.role === "vice president" ||
            mem.role === "secretary" ||
            mem.role === "board member"
          );

          // Sort members by role priority
          const sortedMembers = filteredMembers.sort((a, b) => {
            const roleOrder = {
              'president': 1,
              'vice president': 2,
              'secretary': 3,
              'board member': 4
            };
            return roleOrder[a.role] - roleOrder[b.role];
          });

          setTeamMembers(sortedMembers);
        } else {
          setError(data.message || 'Failed to load team members');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'president':
        return <Crown className="w-4 h-4 text-orange-400" />;
      case 'vice president':
        return <Landmark className="w-4 h-4 text-purple-700" />;
      case 'secretary':
        return <ClipboardList className="w-4 h-4 text-yellow-400" />;
      case 'board member':
        return <Users className="w-4 h-4 text-blue-700" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin h-12 w-12 text-gray-400" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto shadow-sm">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Team</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Our Management Team
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals who lead our organization
          </p>
          <div className="w-20 h-0.5 bg-gray-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Team Members Grid */}
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white shadow-sm hover:shadow-md rounded-lg p-4 text-center transition-all duration-200 border border-gray-100"
              >
                <div className="relative mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}` + member.photo}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-20 h-20 object-cover mx-auto rounded-full shadow-sm border-2 border-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=6b7280&color=fff&size=128`;
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.firstName} {member.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-gray-600 text-sm capitalize">
                    {getRoleIcon(member.role)}
                    <span>{member.role}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{member.city}, {member.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm border border-gray-100">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">No Team Members Found</h3>
              <p className="text-gray-600 text-sm">Team information is currently being updated.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Team;