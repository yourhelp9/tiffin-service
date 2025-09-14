'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';

const Plans = [
//    { id: 1, name: 'Weekly Plan (1 Meal)', meals_per_day: 1, meals_total: 7 },
  //  { id: 2, name: 'Weekly Plan (2 Meals)', meals_per_day: 2, meals_total: 14 },
    { id: 3, name: 'Monthly Plan (1 Meal)', meals_per_day: 1, meals_total: 30 },
    { id: 4, name: 'Monthly Plan (2 Meals)', meals_per_day: 2, meals_total: 60 },
    { id: 5, name: 'Monthly Plan (3 Meals)', meals_per_day: 3, meals_total: 90 },
];

const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner'];

// UserDetailsModal ko UsersPage component ke bahar define kiya gaya hai
const UserDetailsModal = ({ userDetails, onClose }) => {
    if (!userDetails) return null;

    const getPlanName = (planId) => {
        return Plans.find(p => p.id === planId)?.name || 'N/A';
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Name:</p>
                        <p className="text-lg font-medium text-gray-900">{userDetails.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="text-lg font-medium text-gray-900">{userDetails.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Phone:</p>
                        <p className="text-lg font-medium text-gray-900">{userDetails.phone_number || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Address:</p>
                        <p className="text-lg font-medium text-gray-900">{userDetails.address || 'N/A'}</p>
                    </div>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Subscription Details</h2>
                    {userDetails.subscription ? (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Current Plan:</p>
                            <p className="text-lg font-medium text-green-900">{getPlanName(userDetails.subscription.plan_id)} ({userDetails.meals_time_preference})</p>
                            <p className="mt-2 text-sm text-gray-500">Meals Remaining:</p>
                            <p className="text-lg font-medium text-green-900">{userDetails.subscription.meals_remaining}</p>
                        </div>
                    ) : (
                        <div className="bg-red-50 p-4 rounded-lg text-red-900">
                            No active subscription.
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Meal History</h2>
                    {userDetails.selections && userDetails.selections.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                            <ul className="space-y-2">
                                {userDetails.selections.map(selection => (
                                    <li key={selection.id} className="p-3 bg-white rounded-lg shadow-sm">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {new Date(selection.daily_menu?.menu_date).toLocaleDateString()} - {selection.daily_menu?.meal_type}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {selection.is_skipped ? 'Skipped' : `Selected: ${selection.selectedOption?.name}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No meal selections found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [paginationData, setPaginationData] = useState({});

    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(1);
    const [selectedMealTypes, setSelectedMealTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);


    const fetchUsers = async () => {
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
            setError('Authentication failed. Please log in as an admin.');
            setLoading(false);
            return;
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/users?page=${currentPage}&per_page=${perPage}`;
        if (filter === 'active') {
            url += '&is_active=true';
        } else if (filter === 'non-active') {
            url += '&is_active=false';
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json'
                }
            });
            setUsers(response.data.data);
            setPaginationData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleActivateSubscription = async (userId) => {
        setIsSubmitting(true);
        const token = localStorage.getItem('auth_token');
        
        const selectedPlan = Plans.find(p => p.id === selectedPlanId);
        if (!selectedPlan) {
            toast.error('Invalid plan selected.');
            setIsSubmitting(false);
            return;
        }
        
        const mealsPerDay = selectedPlan.meals_per_day;
        if (selectedMealTypes.length !== mealsPerDay) {
            toast.error(`Please select exactly ${mealsPerDay} meal types for this plan.`);
            setIsSubmitting(false);
            return;
        }
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
                user_id: userId,
                plan_id: selectedPlanId,
                meals_time_preference: selectedMealTypes,
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
            });

            toast.success(response.data.message || 'Subscription updated successfully!');
            setEditingUserId(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error: Failed to activate subscription.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            toast.error('Authentication failed.');
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(`User "${userName}" deleted successfully!`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    const handleMealTypeChange = (mealType) => {
        const selectedPlan = Plans.find(p => p.id === selectedPlanId);
        const mealsPerDay = selectedPlan ? selectedPlan.meals_per_day : 0;
        
        setSelectedMealTypes(prev => {
            if (prev.includes(mealType)) {
                return prev.filter(m => m !== mealType);
            }
            if (prev.length >= mealsPerDay) {
                toast.error(`You can only select ${mealsPerDay} meal type(s) for this plan.`);
                return prev;
            }
            return [...prev, mealType];
        });
    };
    
    const handlePlanChange = (e) => {
        const newPlanId = parseInt(e.target.value);
        setSelectedPlanId(newPlanId);
        const selectedPlan = Plans.find(p => p.id === newPlanId);
        if (selectedPlan) {
            setSelectedMealTypes(mealTypeOptions.slice(0, selectedPlan.meals_per_day));
        }
    };

    const handleEditClick = (userId, currentPlanId, currentMealPreference) => {
        setEditingUserId(userId);
        setSelectedPlanId(currentPlanId || 1);
        setSelectedMealTypes(currentMealPreference ? currentMealPreference.split(',') : []);
    };
    
    const isPlanAlreadySelected = (user) => {
        return user.subscription && user.subscription.meals_remaining > 0;
    };

    const getPlanName = (user) => {
        if (!user.subscription || user.subscription.meals_remaining <= 0) {
            return 'No Active Plan';
        }
        const plan = Plans.find(p => p.id === user.subscription.plan_id)?.name;
        const preference = user.meals_time_preference;
        if (plan && preference) {
            return `${plan} (${preference})`;
        }
        return plan || 'N/A';
    };

    const handleUserDetailsClick = async (userId) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            toast.error('Authentication failed.');
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedUserDetails(response.data);
            setShowUserDetailsModal(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch user details.');
        }
    };

    const filteredUsers = users.filter(user => {
        const hasActivePlan = isPlanAlreadySelected(user);
        if (filter === 'active') return hasActivePlan;
        if (filter === 'non-active') return !hasActivePlan;
        return true;
    });

    useEffect(() => {
        fetchUsers();
    }, [filter, currentPage, perPage]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 font-bold text-2xl">
                <p>Loading Admin Panel...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500 font-bold text-2xl text-center p-4">
                <p>Error: {error}</p>
            </div>
        );
    }
    
    const pageNumbers = [];
    if (paginationData.last_page > 1) {
        for (let i = 1; i <= paginationData.last_page; i++) {
            pageNumbers.push(i);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <Head>
                <title>Manage Users</title>
            </Head>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
            <Toaster />
            
            <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow flex space-x-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200
                            ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        All Customers
                    </button>
                    <button 
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200
                            ${filter === 'active' ? 'bg-[#63ab45] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Active Customers
                    </button>
                    <button 
                        onClick={() => setFilter('non-active')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200
                            ${filter === 'non-active' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Non-Active Customers
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="perPage" className="text-sm text-gray-700">Users per page:</label>
                    <select
                        id="perPage"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Meals Remaining
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <React.Fragment key={user.id}>
                                <tr className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <button
                                            onClick={() => handleUserDetailsClick(user.id)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            {user.id}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleUserDetailsClick(user.id)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            {user.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getPlanName(user)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.subscription ? user.subscription.meals_remaining : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                        {user.is_admin !== 1 && (
                                            <>
                                                <button 
                                                    onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium text-white 
                                                        ${isPlanAlreadySelected(user) ? 'bg-[#63ab45] hover:bg-[#4e8737]' : 'bg-gray-600 hover:bg-gray-700'}`}
                                                >
                                                    {isPlanAlreadySelected(user) ? 'Update Plan' : 'Activate Plan'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {editingUserId === user.id && (
                                    <tr key={`edit-${user.id}`} className="bg-gray-50">
                                        <td colSpan="5" className="p-4 border-t border-gray-200">
                                            <div className="flex flex-col md:flex-row items-center gap-4">
                                                <div className="w-full md:w-1/3">
                                                    <label htmlFor={`plan-select-${user.id}`} className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
                                                    <select 
                                                        id={`plan-select-${user.id}`}
                                                        value={selectedPlanId}
                                                        onChange={handlePlanChange}
                                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                                    >
                                                        {Plans.map(plan => (
                                                            <option key={plan.id} value={plan.id}>{plan.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Meal Types ({selectedMealTypes.length} / {Plans.find(p => p.id === selectedPlanId)?.meals_per_day})</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {mealTypeOptions.map(mealType => {
                                                            const selectedPlan = Plans.find(p => p.id === selectedPlanId);
                                                            const mealsPerDay = selectedPlan ? selectedPlan.meals_per_day : 0;
                                                            const isMaxSelected = selectedMealTypes.length >= mealsPerDay && !selectedMealTypes.includes(mealType);

                                                            return (
                                                                <button
                                                                    key={mealType}
                                                                    type="button"
                                                                    onClick={() => handleMealTypeChange(mealType)}
                                                                    disabled={isMaxSelected}
                                                                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                                                        ${selectedMealTypes.includes(mealType) ? 'bg-[#63ab45] text-white' : 'bg-gray-200 text-gray-700'}
                                                                        ${isMaxSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                >
                                                                    {mealType}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-1/3 flex items-end">
                                                    <button
                                                        onClick={() => handleActivateSubscription(user.id)}
                                                        disabled={isSubmitting || selectedMealTypes.length === 0 || selectedPlanId === null}
                                                        className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? 'Saving...' : 'Save Plan'}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {paginationData.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={paginationData.current_page === 1}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        First
                    </button>
                    <div className="flex space-x-2">
                        {paginationData.links?.slice(1, -1).map((link, index) => {
                            if (link.url) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(link.label)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                                            link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            }
                            return (
                                <span key={index} className="px-4 py-2 text-sm font-semibold text-gray-400">
                                    ...
                                </span>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setCurrentPage(paginationData.last_page)}
                        disabled={paginationData.current_page === paginationData.last_page}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>
            )}
            {showUserDetailsModal && (
                <UserDetailsModal
                    userDetails={selectedUserDetails}
                    onClose={() => setShowUserDetailsModal(false)}
                />
            )}
        </div>
    );
};

export default UsersPage;