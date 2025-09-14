'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const AdminDashboardPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('auth_token');

        if (!token || !user || !user.is_admin) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 font-bold text-2xl">
                <p>Loading Admin Panel...</p>
            </div>
        );
    }
    
    return (
        <div className="p-6">
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
                Welcome, Admin!
            </h1>
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600">
                    You can manage users, menus, and reports from the sidebar.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;