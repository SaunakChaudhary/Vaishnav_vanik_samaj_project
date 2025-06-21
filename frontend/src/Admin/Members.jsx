import React, { useState, useEffect } from 'react';
import Slidebar from '../Components/Slidebar';
import { toast } from 'react-hot-toast';
import { Riple } from "react-loading-indicators";
import { AlertCircle, CheckCircle, DownloadIcon } from 'lucide-react';

const Members = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members/display`);
        const data = await response.json();
        if (response.ok) {
          setMembers(data.membersDetails);
        }
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const results = members.filter((member) => {
      const matchesSearch =
        member.firstName?.toLowerCase().includes(term) ||
        member.lastName?.toLowerCase().includes(term) ||
        member.phone_number?.includes(term) ||
        member.profession?.toLowerCase().includes(term) ||
        member.city?.toLowerCase().includes(term);

      const matchesCaste = selectedCaste ? member.caste === selectedCaste : true;
      const matchesCity = selectedCity ? member.city === selectedCity : true;

      return matchesSearch && matchesCaste && matchesCity;
    });

    setFilteredMembers(results);
  }, [members, searchTerm, selectedCaste, selectedCity]);

  const casteOptions = [...new Set(members.map((m) => m.caste).filter(Boolean))];
  const cityOptions = [...new Set(members.map((m) => m.city).filter(Boolean))];

  const handleApprove = async (id, status) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members/status-update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        // Refresh members after status update
        const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/members/display`);
        const updatedData = await updatedResponse.json();
        if (updatedResponse.ok) {
          setMembers(updatedData.membersDetails);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update member status");
      console.error("Status update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/export/upload-excel`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast.success(data.message || "Excel uploaded successfully");
      
      // Refresh members after upload
      const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/members/display`);
      const updatedData = await updatedResponse.json();
      if (updatedResponse.ok) {
        setMembers(updatedData.membersDetails);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong while uploading");
      console.error("Excel upload error:", error);
    } finally {
      setIsLoading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleDownload = async (type) => {
    setShowOptions(false);
    if (type === "excel") {
      window.open(`${process.env.REACT_APP_API_URL}/api/export/download/excel`);
    } else if (type === "pdf") {
      window.open(`${process.env.REACT_APP_API_URL}/api/export/download/pdf`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}
      <Slidebar highlight={"members"} />

      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 md:mt-0 overflow-x-hidden">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Membership Requests</h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleDownload("excel")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg text-sm"
                    >
                      Download Excel
                    </button>
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg text-sm"
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                placeholder="Search members..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Caste Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Caste</label>
              <select
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Castes</option>
                {casteOptions.map((caste) => (
                  <option key={caste} value={caste}>{caste}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Filter by City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Cities</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Excel Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Upload Excel</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleExcelUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="excel-upload"
                />
                <label 
                  htmlFor="excel-upload"
                  className="block w-full px-4 py-2 border border-dashed border-gray-400 rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer text-sm"
                >
                  <span className="text-gray-700">Choose Excel file</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">Supports .xlsx files only</p>
            </div>
          </div>
        </div>

        {/* Table Section - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.memberId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={`${process.env.REACT_APP_API_URL}` + member.photo}
                            alt={member.firstName}
                            className="h-10 w-10 rounded-full object-cover border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px]">{member.email}</div>
                        <div className="text-xs text-gray-500">{member.city}, {member.state}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.phone_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${member.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : member.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {member.membershipFees?.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            ₹{member.membershipFees.amount}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(member._id, "accepted")}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprove(member._id, "rejected")}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                      No members found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Layout - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div key={member._id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${process.env.REACT_APP_API_URL}` + member.photo}
                      alt={member.firstName}
                      className="h-12 w-12 rounded-full object-cover border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/48";
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {member.memberId}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${member.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : member.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'}`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="text-sm text-gray-900">{member.phone_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm text-gray-900 truncate ml-2 max-w-[180px]">{member.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="text-sm text-gray-900">{member.city}, {member.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Caste:</span>
                    <span className="text-sm text-gray-900">{member.caste}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Fees:</span>
                    {member.membershipFees?.isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        ₹{member.membershipFees.amount}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(member._id, "accepted")}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(member._id, "rejected")}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No members found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;