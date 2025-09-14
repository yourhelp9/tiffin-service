'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        profile_image: null,
    });
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setFormData({
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

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_image' && files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            setProfileImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, profile_image: null, remove_profile_image: 'true' }));
        setProfileImagePreview(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        const token = localStorage.getItem('auth_token');
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });
        
        if (formData.remove_profile_image === 'true') {
            data.append('remove_profile_image', 'true');
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            setProfileImagePreview(response.data.user.profile_image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${response.data.user.profile_image_url}` : null);
            setIsEditing(false);
            setMessage('Profile updated successfully!');
            setFormData(prev => ({ ...prev, remove_profile_image: null }));
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
            setIsSaving(false);
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
                    <button 
                        onClick={handleLogout} 
                        className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>

                {message && (
                    <p className={`mb-4 text-center font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-[#63ab45]'}`}>
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
                        {isEditing && profileImagePreview && (
                            <button 
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors duration-200"
                                aria-label="Remove profile image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {!isEditing && (
                        <>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{user.name}</p>
                            <p className="text-gray-600 text-md mb-4">{user.email}</p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Phone:</span> {user.phone_number || 'Not provided'}
                            </p>
                            <p className="text-gray-700 mb-4 text-center">
                                <span className="font-semibold">Address:</span> {user.address || 'Not provided'}
                                {user.address && <span className="block text-sm text-gray-500">Varanasi, Uttar Pradesh, India</span>}
                            </p>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="w-full py-3 bg-[#4e8737] text-white rounded-xl shadow-md hover:bg-[#3a6628] transition-transform transform hover:scale-105 duration-200 focus:outline-none focus:ring-2 focus:ring-[#63ab45] focus:ring-opacity-50"
                            >
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>

                {isEditing && (
                    <form onSubmit={handleUpdate} className="space-y-5 mt-8">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                        </div>
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea id="address" name="address" value={formData.address} onChange={handleFormChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#63ab45] focus:border-[#63ab45] transition duration-150"></textarea>
                        </div>
                        <div>
                            <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                            <input type="file" id="profile_image" name="profile_image" accept="image/*" onChange={handleFormChange} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ecf6e8] file:text-[#4e8737] hover:file:bg-[#d5f1d0] cursor-pointer" />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setProfileImagePreview(user.profile_image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${user.profile_image_url}` : null);
                                    setMessage('');
                                }} 
                                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex-1 py-3 bg-[#4e8737] text-white rounded-xl shadow-md hover:bg-[#3a6628] transition-transform transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#63ab45] focus:ring-opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;