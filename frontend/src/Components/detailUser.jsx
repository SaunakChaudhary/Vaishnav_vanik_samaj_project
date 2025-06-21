import React from 'react';
import { X, User, MapPin, Phone, Mail, Calendar, GraduationCap, Briefcase, Users, School2 } from 'lucide-react';

const UserDetailComponent = ({ user, setUserDetails }) => {

  const userData = user;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className='bg-black/40 fixed top-0 w-full h-screen p-1 z-50 left-0'>
      <div className='fixed right-5 top-5 text-white cursor-pointer' onClick={() => setUserDetails(null)}>
        <X />
      </div>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg h-[90%] overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="flex-shrink-0">
            <img
              src={`${process.env.REACT_APP_API_URL}` + userData.photo}
              alt={`${userData.firstName} ${userData.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {userData.firstName} {userData.middleName} {userData.lastName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{userData.phone_number}</span>
              </div>
            </div>
            <div className='font-bold text-gray-600'>
              Member Id : {userData.memberId}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Age:</span>
                <span className="ml-2 text-gray-800">{calculateAge(userData.dob)} years</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date of Birth:</span>
                <span className="ml-2 text-gray-800">{formatDate(userData.dob)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Caste:</span>
                <span className="ml-2 text-gray-800">{userData.caste}</span>
              </div>
              {userData.academicBackground && (
                <div>
                  <span className="font-medium text-gray-600">Education:</span>
                  <span className="ml-2 text-gray-800">{userData.academicBackground}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>{userData.address}</p>
              <p>{userData.city}, {userData.state}</p>
              <p>{userData.country} - {userData.pincode}</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <School2 className="w-5 h-5" />
            Education
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Education:</span>
              <span className="ml-2 text-gray-800">{userData.education}</span>
            </div>
            {userData.achivements && (
              <div>
                <span className="font-medium text-gray-600">Achivements:</span>
                <span className="ml-2 text-gray-800">{userData.achivements}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Professional Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Profession:</span>
              <span className="ml-2 text-gray-800">{userData.profession}</span>
            </div>
            {userData.professionAddress && (
              <div>
                <span className="font-medium text-gray-600">Business Address:</span>
                <span className="ml-2 text-gray-800">{userData.professionAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Family Members */}
        {userData.familyMembers && userData.familyMembers.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Members
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.familyMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {member.photo && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}` + member.photo}
                        alt={`${process.env.REACT_APP_API_URL}` + member.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{member.fullName}</h3>
                      <p className="text-sm text-gray-600">{member.relation}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {member.dob && (
                      <p><span className="font-medium">DOB:</span> {formatDate(member.dob)}</p>
                    )}
                    {member.profession && (
                      <p><span className="font-medium">Profession:</span> {member.profession}</p>
                    )}
                    {member.academicBackground && (
                      <p><span className="font-medium">Education:</span> {member.academicBackground}</p>
                    )}
                    {member.achivements && (
                      <p><span className="font-medium">Latest Achivements:</span> {member.achivements}</p>
                    )}
                    {member.achivements && (
                      <p><span className="font-medium">Phone Number:</span> {member.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailComponent;