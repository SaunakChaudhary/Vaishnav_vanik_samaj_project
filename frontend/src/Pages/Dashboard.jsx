import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  User,
  Users,
  Camera,
  Search,
  Edit3,
  Star,
  LayoutDashboard,
  Grid,
  List,
  Home,
  Menu,
  X,
  ChevronRight,
  UserPlus,
  Trash2,
  Save,
  Gift,
  Wallet,
  Cake
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../Context/userContext';
import DetailedUser from '../Components/detailUser';
import { toast } from "react-hot-toast"
import AdSlotBookingSystem from '../Components/Advertisement';
import Notifications from './Notifications';
import MemberShipPayment from './MemberShipPayment';
import Donation from './Donation';
import UserDashboard from '../Components/UserDashboard';
import Contributions from '../Components/Contributions';
import { Riple } from 'react-loading-indicators';

// Screen displayed after click on add family member button ✅
const AddFamilyMemberModal = ({
  isVisible,
  newFamilyMember,
  relationOptions,
  onClose,
  handleNewFamilyMemberChange,
  onSave
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">Add Family Member</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name *" value={newFamilyMember.fullName} onChange={val => handleNewFamilyMemberChange('fullName', val)} placeholder="Enter full name" />
            <SelectField label="Relation *" value={newFamilyMember.relation} onChange={val => handleNewFamilyMemberChange('relation', val)} options={relationOptions} />

            <InputField label="Phone Number" type="tel" value={newFamilyMember.phone} onChange={val => handleNewFamilyMemberChange('phone', val)} placeholder="Enter phone number" />
            <InputField label="Date of Birth" type="date" value={newFamilyMember.dob} onChange={val => handleNewFamilyMemberChange('dob', val)} />

            <InputField label="Education" value={newFamilyMember.academicBackground} onChange={val => handleNewFamilyMemberChange('academicBackground', val)} placeholder="Enter education details" />
            <InputField label="Profession" value={newFamilyMember.profession} onChange={val => handleNewFamilyMemberChange('profession', val)} placeholder="Enter profession" />
            <InputField label="Achivements" value={newFamilyMember.achivements} onChange={val => handleNewFamilyMemberChange('achivements', val)} placeholder="Enter Achivements" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleNewFamilyMemberChange('photo', file);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!newFamilyMember.fullName || !newFamilyMember.relation}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

const EditFamilyMemberModel = ({
  isVisible,
  onClose,
  editMember,
  onSave,
  relationOptions,
  handleEditFamilyMemberChange
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 top-0">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">Edit Family Member</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name *"
              value={editMember.fullName || ''}
              onChange={val => handleEditFamilyMemberChange('fullName', val)}
              placeholder="Enter full name"
            />
            <SelectField
              label="Relation *"
              value={editMember.relation || ''}
              onChange={val => handleEditFamilyMemberChange('relation', val)}
              options={relationOptions}
            />

            <InputField
              label="Phone Number"
              type="tel"
              value={editMember.phone || ''}
              onChange={val => handleEditFamilyMemberChange('phone', val)}
              placeholder="Enter phone number"
            />
            <InputField
              label="Date of Birth"
              type="date"
              value={editMember.dob || ''}
              onChange={val => handleEditFamilyMemberChange('dob', val)}
            />

            <InputField
              label="Education"
              value={editMember.academicBackground || ''}
              onChange={val => handleEditFamilyMemberChange('academicBackground', val)}
              placeholder="Enter education details"
            />
            <InputField
              label="Profession"
              value={editMember.profession || ''}
              onChange={val => handleEditFamilyMemberChange('profession', val)}
              placeholder="Enter profession"
            />
            <InputField
              label="Achievements"
              value={editMember.achivements || ''}
              onChange={val => handleEditFamilyMemberChange('achivements', val)}
              placeholder="Enter Achievements"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleEditFamilyMemberChange('photo', file);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!editMember.fullName || !editMember.relation}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select relation</option>
      {options.map((relation) => (
        <option key={relation} value={relation}>
          {relation}
        </option>
      ))}
    </select>
  </div>
);


const Dashboard = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { LoggedInUser, setLoggedInUser } = useContext(UserDataContext); // Using mock data
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: LoggedInUser.firstName,
    middleName: LoggedInUser.middleName,
    lastName: LoggedInUser.lastName,
    email: LoggedInUser.email,
    phone_number: LoggedInUser.phone_number,
    wp_number: LoggedInUser.wp_number,
    achivements: LoggedInUser.achivements,
    education: LoggedInUser.education,
    address: LoggedInUser.address,
    photo: LoggedInUser.photo,
    city: LoggedInUser.city,
    state: LoggedInUser.state,
    caste: LoggedInUser.caste,
    country: LoggedInUser.country,
    pincode: LoggedInUser.pincode,
    dob: LoggedInUser.dob,
    profession: LoggedInUser.profession,
    professionAddress: LoggedInUser.professionAddress,
    familyMembers: LoggedInUser.familyMembers
  });

  const [familyMembers, setFamilyMembers] = useState(LoggedInUser.familyMembers || []);

  useEffect(() => {
    if (LoggedInUser.familyMembers) {
      setFamilyMembers(LoggedInUser.familyMembers);
    }
  }, [LoggedInUser]);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onPhotoChange(file); // Pass the selected file to the parent handler
    }
  };

  const onPhotoChange = (file) => {
    const previewUrl = URL.createObjectURL(file);

    // Update profileData photo with the preview URL
    setProfileData((prev) => ({
      ...prev,
      photo: file,
    }));

    setSelectedFile(previewUrl);
  };

  useEffect(() => {
    setProfileData({
      firstName: LoggedInUser.firstName,
      middleName: LoggedInUser.middleName,
      lastName: LoggedInUser.lastName,
      email: LoggedInUser.email,
      phone_number: LoggedInUser.phone_number,
      wp_number: LoggedInUser.wp_number,
      address: LoggedInUser.address,
      photo: LoggedInUser.photo,
      city: LoggedInUser.city,
      state: LoggedInUser.state,
      caste: LoggedInUser.caste,
      education: LoggedInUser.education,
      achivements: LoggedInUser.achivements,
      country: LoggedInUser.country,
      pincode: LoggedInUser.pincode,
      dob: LoggedInUser.dob,
      profession: LoggedInUser.profession,
      professionAddress: LoggedInUser.professionAddress,
      familyMembers: familyMembers
    })
  }, [LoggedInUser, familyMembers])

  const [newFamilyMember, setNewFamilyMember] = useState({
    fullName: '',
    relation: '',
    photo: null,
    academicBackground: '',
    achivements: '',
    profession: '',
    phone: '',
    dob: ''
  });

  // Relation for New User
  const relationOptions = [
    'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter',
    'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Other'
  ];

  // onchange function for profile's  all fields
  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

  };

  const handleAddFamilyMember = () => {
    if (newFamilyMember.fullName && newFamilyMember.relation) {
      const memberWithId = {
        ...newFamilyMember,
        id: Date.now(),
        photo: newFamilyMember.photo || 'https://via.placeholder.com/100?text=No+Photo'
      };

      const updatedMembers = [...familyMembers, memberWithId];
      setFamilyMembers(updatedMembers);
      setProfileData(prev => ({
        ...prev,
        familyMembers: updatedMembers
      }));

      // Reset modal state
      setNewFamilyMember({
        fullName: '',
        relation: '',
        photo: '',
        academicBackground: '',
        achivements: '',
        profession: '',
        phone: '',
        dob: ''
      });
      setShowAddFamilyModal(false);
    }
  };

  // Remove Family Member
  const handleRemoveFamilyMember = (e, id) => {
    e.preventDefault();
    const updatedMembers = familyMembers.filter(member => member._id !== id);
    setFamilyMembers(updatedMembers);
    setProfileData(prev => ({
      ...prev,
      familyMembers: updatedMembers
    }));
  };

  // OnChange Function for Family member
  const handleNewFamilyMemberChange = (field, value) => {
    setNewFamilyMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members/display`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.membersDetails)
      } else {
        toast.error(data.message)
      }
    }
    fetchAllUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const city = user.city?.toLowerCase() || "";
    const state = user.state?.toLowerCase() || "";
    const phone = user.phone_number || "";

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      city.includes(searchTerm.toLowerCase()) ||
      state.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [detailedPhotos, setDetailedPhotos] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/display`);
      const data = await response.json();
      if (response.ok) {
        setGalleryImages(data.events);
      } else {
        toast.error(data.message);
      }
    }
    fetchEvents();
  }, []);

  // Data for Slidebar
  const sidebarItems = [
    { id: 'home', label: 'Homepage', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: `Today's Birthday`, icon: Cake },
    { id: 'users', label: `All Vaishnav's Profile`, icon: Users },
    { id: 'ads', label: 'Advertisements', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'contribution', label: 'Your Contributions', icon: Wallet },
    { id: 'donation', label: 'Donation', icon: Gift }
  ];
  const SidebarItem = ({ item }) => (
    <button
      onClick={() => {
        setActiveTab(item.id);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${activeTab === item.id
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
    >
      <item.icon size={20} />

      <span className="font-medium flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
        {item.label}

        {/* Show red dot for unread notifications */}
        {item.label === 'Notifications' && unreadWishes.length > 0 && (
          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
        )}
      </span>

      {activeTab === item.id && (
        <ChevronRight size={16} className="ml-auto flex-shrink-0" />
      )}
    </button>
  );

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      setIsLoading(true);
      // Append profile fields
      formData.append('firstName', profileData.firstName || '');
      formData.append('middleName', profileData.middleName || '');
      formData.append('lastName', profileData.lastName || '');
      formData.append('email', profileData.email || '');
      formData.append('phone_number', profileData.phone_number || '');
      formData.append('wp_number', profileData.wp_number || '');
      formData.append('address', profileData.address || '');
      formData.append('city', profileData.city || '');
      formData.append('state', profileData.state || '');
      formData.append('caste', profileData.caste || '');
      formData.append('education', profileData.education || '');
      formData.append('achivements', profileData.achivements || '');
      formData.append('country', profileData.country || '');
      formData.append('pincode', profileData.pincode || '');
      formData.append('dob', profileData.dob || '');
      formData.append('profession', profileData.profession || '');
      formData.append('professionAddress', profileData.professionAddress || '');

      // ✅ Profile photo: check if it's a new file or existing URL
      if (profileData.photo instanceof File) {
        formData.append('photo', profileData.photo);
      } else if (typeof profileData.photo === 'string') {
        formData.append('photo', profileData.photo); // send existing DB image URL
      }

      // ✅ Family members
      familyMembers.forEach((member, index) => {
        formData.append(`familyMembers[${index}][fullName]`, member.fullName || '');
        formData.append(`familyMembers[${index}][relation]`, member.relation || '');
        formData.append(`familyMembers[${index}][phone]`, member.phone || '');
        formData.append(`familyMembers[${index}][dob]`, member.dob || '');
        formData.append(`familyMembers[${index}][academicBackground]`, member.academicBackground || '');
        formData.append(`familyMembers[${index}][profession]`, member.profession || '');
        formData.append(`familyMembers[${index}][achivements]`, member.achivements || '');

        if (member.photo instanceof File) {
          formData.append(`familyMembers[${index}][photo]`, member.photo);
        } else if (typeof member.photo === 'string') {
          formData.append(`familyMembers[${index}][photo]`, member.photo); // send old photo URL
        }
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/members/update-profile/${LoggedInUser._id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
        setLoggedInUser(data.user);
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error.error);
      toast.error('Something went wrong while updating profile.');
    }
    finally {
      setIsLoading(false);
    }
  };
  const [editMember, setEditMember] = useState({});
  const [showEditFamilyModal, setShowEditFamilyModal] = useState(false);
  const handleEditFamilyMemberChange = (field, value) => {
    setEditMember(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // 3. Add function to handle edit member save
  const handleUpdateFamilyMember = () => {
    if (editMember.fullName && editMember.relation) {
      const updatedMembers = familyMembers.map(member =>
        member._id === editMember._id ? editMember : member
      );
      setFamilyMembers(updatedMembers);
      setProfileData(prev => ({
        ...prev,
        familyMembers: updatedMembers
      }));

      // Close modal and reset state
      setShowEditFamilyModal(false);
      setEditMember({});
    }
  };
  // Design of Profile Section
  const renderProfileSection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h2>
        <button onClick={handleUpdate} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Personal Profile Section  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={selectedFile ? selectedFile : `${process.env.REACT_APP_API_URL}` + profileData.photo}
                alt="Profile"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-100"
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleButtonClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Change Photo
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
              <input
                type="text"
                value={profileData.middleName}
                onChange={(e) => handleProfileUpdate('middleName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileUpdate('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Phone & Caste */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone_number}
                onChange={(e) => handleProfileUpdate('phone_number', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Whatsapp Number</label>
              <input
                type="tel"
                value={profileData.wp_number}
                onChange={(e) => handleProfileUpdate('wp_number', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <input
                type="text"
                value={profileData.caste || ''}
                onChange={(e) => handleProfileUpdate('caste', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter caste"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <input
                type="text"
                value={profileData.education}
                onChange={(e) => handleProfileUpdate('education', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows="3"
              value={profileData.address}
              onChange={(e) => handleProfileUpdate('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* City, State & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleProfileUpdate('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => handleProfileUpdate('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={profileData.country}
                onChange={(e) => handleProfileUpdate('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pincode, DOB & Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={profileData.pincode}
                onChange={(e) => handleProfileUpdate('pincode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={profileData.dob}
                onChange={(e) => handleProfileUpdate('dob', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <input
                type="text"
                value={profileData.profession}
                onChange={(e) => handleProfileUpdate('profession', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Profession Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profession Address</label>
            <textarea
              rows="3"
              value={profileData.professionAddress || ''}
              onChange={(e) => handleProfileUpdate('professionAddress', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter profession address"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achivements</label>
              <input
                type="text"
                value={profileData.achivements}
                onChange={(e) => handleProfileUpdate('achivements', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Family Members Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Family Members</h3>
          <button
            onClick={() => setShowAddFamilyModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <UserPlus size={20} />
            Add Family Member
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Member Image */}
                <img
                  src={
                    member.photo instanceof File
                      ? URL.createObjectURL(member.photo)
                      : `${process.env.REACT_APP_API_URL}` + member.photo || 'https://via.placeholder.com/100'
                  }
                  alt={member.fullName}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                />

                {/* Member Details */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{member.fullName}</h4>
                      <p className="text-sm text-blue-600 font-medium">{member.relation}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditMember(member);
                          setShowEditFamilyModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleRemoveFamilyMember(e, member._id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-700">Phone:</span> +91 {member.phone}</p>
                    <p><span className="font-medium text-gray-700">Profession:</span> {member.profession}</p>
                    <p><span className="font-medium text-gray-700">Education:</span> {member.academicBackground}</p>
                    <p><span className="font-medium text-gray-700">Achievements:</span> {member.achivements}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
      {showEditFamilyModal && Object.keys(editMember).length > 0 && (
        <EditFamilyMemberModel
          isVisible={showEditFamilyModal}
          onClose={() => {
            setShowEditFamilyModal(false);
            setEditMember({});
          }}
          relationOptions={relationOptions}
          editMember={editMember}
          handleEditFamilyMemberChange={handleEditFamilyMemberChange}
          onSave={handleUpdateFamilyMember}
        />
      )}
      {<AddFamilyMemberModal
        isVisible={showAddFamilyModal}
        newFamilyMember={newFamilyMember}
        relationOptions={relationOptions}
        onClose={() => setShowAddFamilyModal(false)}
        handleNewFamilyMemberChange={handleNewFamilyMemberChange}
        onSave={handleAddFamilyMember}
      />}
    </div>
  );

  const [userDetails, setUserDetails] = useState();

  // Design of All Users Section
  const renderUsersSection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <h2 className="sm:text-2xl text-xl mb-6 font-bold text-gray-800">Explore Vaishnav's Profiles</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map(user => (
          <div key={user._id} onClick={() => setUserDetails(user)} className="cursor-pointer bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="relative">
                <img
                  src={`${process.env.REACT_APP_API_URL}` + user.photo}
                  alt={user.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                <p className="text-xs text-gray-600">{user.city}, {user.state}</p>
                <p className="text-sm text-gray-600">{user.phone_number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
        userDetails && <DetailedUser setUserDetails={setUserDetails} user={userDetails} />
      }
    </div>
  );

  // Design of Adverisement Section
  const renderAdvertisementsSection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Advertisements</h2>
      </div>

      <AdSlotBookingSystem />
    </div>
  );

  // Design of Gallery Section
  const renderGallerySection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gallery</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {galleryImages.map(image => (
          <div onClick={() => setDetailedPhotos(image)} key={image._id} className={`group relative overflow-hidden rounded-xl ${viewMode === 'grid' ? 'aspect-video' : 'flex items-center bg-gray-50 p-4'
            } hover:shadow-lg transition-all duration-300`}>
            {viewMode === 'grid' ? (
              <>
                <img
                  src={`${process.env.REACT_APP_API_URL}` + image.eventPhoto}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold mb-2">{image.eventName}</h3>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center w-full gap-4">
                <img
                  src={`${process.env.REACT_APP_API_URL}` + image.eventPhoto}
                  alt={image.eventName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{image.eventName}</h3>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {detailedPhotos && typeof detailedPhotos === 'object' && Object.keys(detailedPhotos).length > 0 &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Photos of {detailedPhotos.eventName}
              </h3>
              <button
                onClick={() => setDetailedPhotos(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {
                detailedPhotos.images2.length == 0 ?
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No images available
                  </div>
                  :
                  detailedPhotos.images2.map((img, idx) =>
                    <img
                      key={idx}
                      src={`${process.env.REACT_APP_API_URL}` + img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )
              }
            </div>
          </div>
        </div>
      }

    </div>
  );

  const renderDashboardSection = () => (
    <UserDashboard setActiveTab={setActiveTab} activeTab={activeTab} />
  );

  // All Tabs design will be render here
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardSection();
      case 'profile':
        return renderProfileSection();
      case 'users':
        return renderUsersSection();
      case 'ads':
        return renderAdvertisementsSection();
      case 'gallery':
        return renderGallerySection();
      case 'notifications':
        return <Notifications setActiveTab={setActiveTab} />
      case 'donation':
        return <Donation />
      case 'contribution':
        return <Contributions />
      default:
        return renderDashboardSection();
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900 opacity-50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}
      {!LoggedInUser?.membershipFees?.isPaid ? (
        <MemberShipPayment />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-0 z-40 flex items-center justify-between w-full p-5 bg-white">
            <h2 className='font-bold text-2xl'>{!sidebarOpen && "Member Dashboard"}</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white p-3 rounded-lg shadow-lg text-gray-700 hover:text-blue-600 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Sidebar */}
          <div className={`text-gray-600 hover:bg-blue-50 hover:text-blue-600 fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="font-bold w-10 h-10 text-white bg-gradient-to-br from-gray-600 to-slate-600 rounded-lg flex items-center justify-center">
                    {profileData?.firstName?.charAt(0).toUpperCase() || ''}{profileData?.lastName?.charAt(0).toUpperCase() || ''}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">Dashboard</h2>
                    <p className="text-sm text-gray-600">Welcome back! </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item, idx) => (
                  <div key={idx}>
                    {item.label === "Homepage" ?
                      <button onClick={() => navigate("/")} className="font-medium w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
                        <Home />
                        Homepage
                      </button>
                      :
                      <SidebarItem item={item} />}
                  </div>

                ))}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={`${process.env.REACT_APP_API_URL}` + profileData.photo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{profileData.firstName + " " + profileData.lastName}</p>
                    <p className="text-sm text-gray-600 truncate">{profileData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <div className="lg:ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="pt-16 lg:pt-0">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;