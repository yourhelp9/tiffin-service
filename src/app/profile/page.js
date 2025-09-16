'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Custom Icons
const UserIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Personal Info State
    const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
    const [personalFormData, setPersonalFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        profile_image: null,
    });
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setPersonalFormData({
                name: response.data.name,
                email: response.data.email,
                phone_number: response.data.phone_number || '',
                address: response.data.address || '',
                profile_image: null,
            });
            setProfileImagePreview(response.data.profile_image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${response.data.profile_image_url}` : null);
        } catch (error) {
            setMessage('Error: Failed to fetch profile data.');
            console.error('Fetch user error:', error);
            localStorage.removeItem('auth_token');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            fetchUser(token);
        } else {
            router.push('/login');
        }
    }, []);

    const handlePersonalFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_image' && files && files[0]) {
            setPersonalFormData(prev => ({ ...prev, [name]: files[0] }));
            setProfileImagePreview(URL.createObjectURL(files[0]));
        } else {
            setPersonalFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = () => {
        setPersonalFormData(prev => ({ ...prev, profile_image: null, remove_profile_image: 'true' }));
        setProfileImagePreview(null);
    };

    const handleUpdatePersonal = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSavingPersonal(true);
        const token = localStorage.getItem('auth_token');
        
        const data = new FormData();
        Object.keys(personalFormData).forEach(key => {
            if (personalFormData[key] !== null && personalFormData[key] !== '') {
                data.append(key, personalFormData[key]);
            }
        });
        
        if (personalFormData.remove_profile_image === 'true') {
            data.append('remove_profile_image', 'true');
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            setProfileImagePreview(response.data.user.profile_image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${response.data.user.profile_image_url}` : null);
            setShowPersonalEditModal(false);
            setMessage('Profile updated successfully!');
            setPersonalFormData(prev => ({ ...prev, remove_profile_image: null }));
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error.message);
            const backendErrorMsg = error.response?.data?.message || '';
            let errorMsg = 'Failed to update profile. Please check your inputs.';

            if (backendErrorMsg.includes('Image size is too large')) {
                errorMsg = 'You can upload an image under 10 MB. Please reduce the image size.';
            } else if (error.response?.data?.errors?.email?.[0]) {
                errorMsg = error.response?.data?.errors?.email?.[0];
            }
            
            setMessage(`Error: ${errorMsg}`);
        } finally {
            setIsSavingPersonal(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
                <p className="text-gray-700 text-lg font-semibold">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
                <p className="text-red-500 text-lg font-semibold">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans flex items-center justify-center">
            <Head>
                <title>My Profile - Tiffin Service</title>
            </Head>
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                </div>

                {message && (
                    <p className={`mb-4 text-center font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-[#4e8737]'}`}>
                        {message}
                    </p>
                )}
                
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        {profileImagePreview ? (
                            <img 
                                src={profileImagePreview} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold border-4 border-white shadow-lg">
                                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{user.name}</p>
                    <p className="text-gray-600 text-md">{user.email}</p>
                    <p className="text-gray-700 text-md mb-4">{user.address || 'Location not set'}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button 
                        onClick={() => setShowPersonalEditModal(true)} 
                        className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-sm hover:bg-gray-200 transition-colors duration-200 text-gray-800"
                    >
                        <div className="flex items-center">
                            <UserIcon className="w-5 h-5 mr-3 text-[#4e8737]" />
                            <span className="font-semibold">Change Personal Info</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <button 
                    onClick={handleLogout} 
                    className="w-full py-3 bg-[#63ab45] text-white rounded-xl shadow-md hover:bg-[#4e8737] transition-transform transform hover:scale-105 duration-200 focus:outline-none focus:ring-2 focus:ring-[#63ab45] focus:ring-opacity-50"
                >
                    Log out
                </button>
            </div>

            {/* Personal Info Edit Modal */}
            {showPersonalEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Edit Personal Info</h2>
                        <form onSubmit={handleUpdatePersonal} className="space-y-5">
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative mb-3">
                                    {profileImagePreview ? (
                                        <img 
                                            src={profileImagePreview} 
                                            alt="Profile Preview" 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold border-2 border-gray-200">
                                            <span>{personalFormData.name ? personalFormData.name.charAt(0).toUpperCase() : 'U'}</span>
                                        </div>
                                    )}
                                    {profileImagePreview && (
                                        <button 
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                            aria-label="Remove profile image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <label htmlFor="profile_image_upload" className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer text-[#4e8737] hover:text-[#3a6628]">Change Image</label>
                                <input type="file" id="profile_image_upload" name="profile_image" accept="image/*" onChange={handlePersonalFormChange} className="hidden" />
                            </div>

                            <div>
                                <label htmlFor="personal-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" id="personal-name" name="name" value={personalFormData.name} onChange={handlePersonalFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                            </div>
                            <div>
                                <label htmlFor="personal-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" id="personal-email" name="email" value={personalFormData.email} onChange={handlePersonalFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                            </div>
                            <div>
                                <label htmlFor="personal-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" id="personal-phone" name="phone_number" value={personalFormData.phone_number} onChange={handlePersonalFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                            </div>
                            <div>
                                <label htmlFor="personal-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea id="personal-address" name="address" value={personalFormData.address} onChange={handlePersonalFormChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150"></textarea>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowPersonalEditModal(false)} 
                                    className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSavingPersonal}
                                    className="px-5 py-3 bg-[#4e8737] text-white rounded-xl shadow-md hover:bg-[#3a6628] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#63ab45] focus:ring-opacity-50"
                                >
                                    {isSavingPersonal ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
