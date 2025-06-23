import React, { useEffect, useState } from 'react';
import { Search, Users, Check, X, ChevronDown, Edit, Menu, Crown, Shield, NotebookPen, Eye } from 'lucide-react';
import Slidebar from "../Components/Slidebar";
import { toast } from "react-hot-toast";
import { Riple } from "react-loading-indicators";

const AdminManagementSelection = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('selection');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [boardMembers, setBoardMembers] = useState([]);
    const [president, setPresident] = useState(null);
    const [executivePositions, setExecutivePositions] = useState({
        president: president,
        vicePresident: null,
        secretary: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [editingMember, setEditingMember] = useState(null);
    const [editPosition, setEditPosition] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/display`);
                const data = await response.json();
                if (response.ok) {
                    const allUsers = data.membersDetails.filter(mem => mem.membershipFees.isPaid === true);
                    setAllUsers(allUsers);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch members");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        setSelectedUsers(allUsers.filter(user => user.role !== 'member').map(user => user._id));
        setBoardMembers(allUsers.filter(user => user.role !== 'member').map(user => user._id));
        const foundPresident = allUsers.find(user => user.role === 'president');
        const presidentId = foundPresident ? foundPresident._id : null;
        setPresident(presidentId);
        setExecutivePositions(prevPositions => ({
            ...prevPositions,
            president: presidentId,
            vicePresident: allUsers.find(user => user.role === 'vice president')?.['_id'] || null,
            secretary: allUsers.find(user => user.role === 'secretary')?.['_id'] || null,
        }));
    }, [allUsers]);

    const city = ['all', ...new Set(allUsers.map(user => user.city))];

    const filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'all' || user.city === filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => {
            const newSelection = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId];

            if (newSelection.length > 15) {
                toast.error('You can only select up to 15 board members');
                return prev;
            }
            return newSelection;
        });
    };

    const deselectAll = () => {
        setSelectedUsers([]);
    };

    const handleSaveBoardMembers = () => {
        if (selectedUsers.length !== 15) {
            toast.error('Please select exactly 15 board members');
            return;
        }
        setBoardMembers(selectedUsers);
        setActiveTab('positions');
    };

    const handleExecutivePositionChange = (position, userId) => {
        setExecutivePositions(prev => ({
            ...prev,
            [position]: userId
        }));
    };

    const handleSavePositions = async () => {
        const { president, vicePresident, secretary } = executivePositions;
        if (!president || !vicePresident || !secretary) {
            toast.error('Please assign all three executive positions');
            return;
        }

        if (new Set([president, vicePresident, secretary]).size !== 3) {
            toast.error('Each executive position must be assigned to a different person');
            return;
        }

        function transformToRolesFormat(executivePositions, boardMembers) {
            const roles = [];
            const processedIds = new Set();

            for (const roleName in executivePositions) {
                if (executivePositions.hasOwnProperty(roleName)) {
                    const id = executivePositions[roleName];
                    const formattedRoleName = roleName.replace(/([A-Z])/g, ' $1').toLowerCase();
                    roles.push({
                        id: id,
                        role: formattedRoleName
                    });
                    processedIds.add(id);
                }
            }

            boardMembers.forEach(memberId => {
                if (!processedIds.has(memberId)) {
                    roles.push({
                        id: memberId,
                        role: "board member"
                    });
                    processedIds.add(memberId);
                }
            });

            return { roles: roles };
        }

        setIsLoading(true);
        try {
            const newFormat = transformToRolesFormat(executivePositions, boardMembers);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/assign-designation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newFormat)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setActiveTab('view');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to save positions");
        } finally {
            setIsLoading(false);
        }
    };

    const getBoardMemberDesignation = (userId) => {
        if (executivePositions.president === userId) return 'President';
        if (executivePositions.vicePresident === userId) return 'Vice President';
        if (executivePositions.secretary === userId) return 'Secretary';
        return 'Board Member';
    };

    const getPositionIcon = (designation) => {
        switch (designation) {
            case 'President': return <Crown className="w-4 h-4 text-yellow-600" />;
            case 'Vice President': return <Shield className="w-4 h-4 text-blue-600" />;
            case 'Secretary': return <NotebookPen className="w-4 h-4 text-green-600" />;
            default: return <Users className="w-4 h-4 text-gray-600" />;
        }
    };

    const TabButton = ({ id, label, icon: Icon, active, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
                    <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
                </div>
            )}
            
            <Slidebar highlight={"managementTeam"} />

            <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 md:mt-0">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Board Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Select 15 board members and assign executive positions</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2 sm:space-x-4 min-w-max">
                        <TabButton
                            id="selection"
                            label="Select Board"
                            icon={Users}
                            active={activeTab === 'selection'}
                            onClick={() => setActiveTab('selection')}
                        />
                        <TabButton
                            id="positions"
                            label="Assign Positions"
                            icon={Crown}
                            active={activeTab === 'positions'}
                            onClick={() => setActiveTab('positions')}
                            disabled={boardMembers.length === 0}
                        />
                        <TabButton
                            id="view"
                            label="View Board"
                            icon={Eye}
                            active={activeTab === 'view'}
                            onClick={() => setActiveTab('view')}
                            disabled={boardMembers.length === 0}
                        />
                    </div>
                </div>

                {/* Selection Tab */}
                {activeTab === 'selection' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 sm:py-3 pr-10 focus:ring-2 focus:ring-blue-500"
                                >
                                    {city.map(dept => (
                                        <option key={dept} value={dept}>
                                            {dept === 'all' ? 'All Cities' : dept}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Selection Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <button
                                onClick={deselectAll}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
                            >
                                Clear All
                            </button>
                            <div className={`px-4 py-2 rounded-lg font-medium w-full sm:w-auto text-center ${
                                selectedUsers.length === 15 ? 'bg-green-100 text-green-800' :
                                selectedUsers.length > 15 ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {selectedUsers.length}/15 Board Members Selected
                            </div>
                        </div>

                        {/* Members Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-96">
                            {filteredUsers.map(user => {
                                const today = new Date();
                                const birthDate = new Date(user.dob);
                                let age = today.getFullYear() - birthDate.getFullYear();
                                const m = today.getMonth() - birthDate.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                    age--;
                                }

                                return (
                                    <div
                                        key={user._id}
                                        className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                                            selectedUsers.includes(user._id) ? 
                                            'border-blue-500 bg-blue-50' : 
                                            'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => toggleUserSelection(user._id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={`${import.meta.env.VITE_API_URL}` + user.photo} 
                                                    alt="Profile" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                                                    <p className="text-sm text-gray-600">{user.city}, {user.state}</p>
                                                    <p className="text-xs text-gray-500">Age: {age} years</p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedUsers.includes(user._id) ? 
                                                'bg-blue-600 border-blue-600' : 
                                                'border-gray-300'
                                            }`}>
                                                {selectedUsers.includes(user._id) && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveBoardMembers}
                                disabled={selectedUsers.length !== 15}
                                className={`px-6 py-2 rounded-lg font-medium ${
                                    selectedUsers.length === 15 ? 
                                    'bg-blue-600 text-white hover:bg-blue-700' : 
                                    'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Confirm Board Members
                            </button>
                        </div>
                    </div>
                )}

                {/* Positions Tab */}
                {activeTab === 'positions' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Assign Executive Positions</h2>

                        <div className="space-y-4">
                            {/* President */}
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-5 h-5 text-yellow-600" />
                                    <h3 className="font-semibold">President</h3>
                                </div>
                                <select
                                    value={executivePositions.president || ''}
                                    onChange={(e) => handleExecutivePositionChange('president', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select President</option>
                                    {boardMembers.map(memberId => {
                                        const user = allUsers.find(u => u._id === memberId);
                                        return (
                                            <option key={memberId} value={memberId}>
                                                {user.firstName} {user.lastName} - {user.city}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Vice President */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold">Vice President</h3>
                                </div>
                                <select
                                    value={executivePositions.vicePresident || ''}
                                    onChange={(e) => handleExecutivePositionChange('vicePresident', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select Vice President</option>
                                    {boardMembers.map(memberId => {
                                        const user = allUsers.find(u => u._id === memberId);
                                        return (
                                            <option key={memberId} value={memberId}>
                                                {user.firstName} {user.lastName} - {user.city}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Secretary */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <NotebookPen className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold">Secretary</h3>
                                </div>
                                <select
                                    value={executivePositions.secretary || ''}
                                    onChange={(e) => handleExecutivePositionChange('secretary', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select Secretary</option>
                                    {boardMembers.map(memberId => {
                                        const user = allUsers.find(u => u._id === memberId);
                                        return (
                                            <option key={memberId} value={memberId}>
                                                {user.firstName} {user.lastName} - {user.city}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSavePositions}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Positions
                            </button>
                        </div>
                    </div>
                )}

                {/* View Tab */}
                {activeTab === 'view' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Board of Directors</h2>

                        {/* Executive Board */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {['president', 'vicePresident', 'secretary'].map(position => {
                                const userId = executivePositions[position];
                                const user = userId ? allUsers.find(u => u._id === userId) : null;
                                const positionName = position === 'vicePresident' ? 'Vice President' : 
                                                  position.charAt(0).toUpperCase() + position.slice(1);

                                return (
                                    <div key={position} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            {getPositionIcon(positionName)}
                                            <h3 className="font-semibold">{positionName}</h3>
                                        </div>
                                        {user ? (
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={`${import.meta.env.VITE_API_URL}` + user.photo} 
                                                    alt="Profile" 
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                    <p className="text-sm text-gray-600">{user.city}, {user.state}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Not assigned</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* All Board Members */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Board Members</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {boardMembers.map(memberId => {
                                const user = allUsers.find(u => u._id === memberId);
                                const designation = getBoardMemberDesignation(memberId);

                                return (
                                    <div key={memberId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL}` + user.photo} 
                                                alt="Profile" 
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                <div className="flex items-center gap-1 text-sm">
                                                    {getPositionIcon(designation)}
                                                    <span>{designation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                            <button
                                onClick={() => setActiveTab('selection')}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Edit Board Members
                            </button>
                            <button
                                onClick={() => setActiveTab('positions')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Edit Positions
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminManagementSelection;