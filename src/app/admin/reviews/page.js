'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminReviewsPage = () => {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
            setError('Authentication failed. Please log in as an admin.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json'
                }
            });
            setReviews(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 font-bold text-2xl">
                <p>Loading reviews...</p>
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
    
    const getRatingColor = (rating) => {
        switch(rating) {
            case 'Delicious': return 'bg-green-100 text-green-800';
            case 'Good': return 'bg-green-100 text-green-800';
            case 'Average': return 'bg-yellow-100 text-yellow-800';
            case 'Bad': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <Head>
                <title>Admin Reviews</title>
            </Head>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h1>
            
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-800">{review.user?.name || 'Deleted User'}</p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRatingColor(review.meal_rating)}`}>
                                    {review.meal_rating}
                                </span>
                            </div>
                            {review.custom_message && (
                                <p className="text-sm text-gray-600 italic">"{review.custom_message}"</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                Submitted on: {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>No customer reviews submitted yet.</p>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default AdminReviewsPage;