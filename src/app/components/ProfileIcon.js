'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const ProfileIcon = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user profile for icon:', error);
                    localStorage.removeItem('auth_token'); // Token expired or invalid
                }
            }
            setLoading(false);
        };
        fetchUserProfile();
    }, []);

    if (loading) {
        // You can return a loading spinner or a default icon here
        return (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        );
    }

    return (
        <Link href="/profile" className="text-xl text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors duration-200">
            {user?.profile_image_url ? (
                <img 
                    src={`http://127.0.0.1:8000/storage/${user.profile_image_url}`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold border-2 border-gray-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
            )}
        </Link>
    );
};

export default ProfileIcon;