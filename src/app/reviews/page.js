'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';

const reviewCategories = [
    { value: 'Quality or Taste Issues', label: 'Quality or Taste Issues' },
    { value: 'Insufficient Portion Size', label: 'Insufficient Portion Size' },
    { value: 'Menu', label: 'Menu' },
    { value: 'Meal Timings', label: 'Meal Timings' },
];

const plans = [
//    { id: 1, name: 'Weekly Plan', description: '1 Meal', meals_per_day: 1, meals_total: 7 },
  //  { id: 2, name: 'Weekly Plan', description: '2 Meals', price: 999, meals_per_day: 2, meals_total: 14 },
    { id: 3, name: 'Monthly Plan', description: '1 Meal', price: 1999, meals_per_day: 1, meals_total: 30 },
    { id: 4, name: 'Monthly Plan', description: '2 Meals', price: 3999, meals_per_day: 2, meals_total: 60 },
    { id: 5, name: 'Monthly Plan', description: '3 Meals', price: 5999, meals_per_day: 3, meals_total: 90 },
];

const ReviewsPage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUser = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
            return;
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmitReview = async () => {
        if (!selectedCategory) {
            toast.error('Please select a category to submit your review.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('auth_token');

        const mealRatingMap = {
            'Quality or Taste Issues': 'Bad',
            'Insufficient Portion Size': 'Average',
            'Menu': 'Good',
            'Meal Timings': 'Delicious'
        };

        const meal_rating = mealRatingMap[selectedCategory] || 'Good';
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                meal_rating: meal_rating,
                custom_message: customMessage,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message);
            setSelectedCategory('');
            setCustomMessage('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading user data...</p>
            </div>
        );
    }
    
    if (!user) {
        router.push('/login');
        return null;
    }
    
    const userPlan = user?.subscription?.plan_id;
    const userMealTypes = user?.meals_time_preference?.split(',') || [];
    const planDetails = plans.find(p => p.id === userPlan);
    const planName = planDetails ? `${planDetails.name} (${planDetails.description})` : 'No Active Plan';
    
    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
            <Head>
                <title>Submit a Review</title>
            </Head>
            <Toaster />
            <div className="max-w-xl mx-auto w-full">
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                 
                    
                    <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
                        <p className="text-xl font-bold text-gray-800">Food Overview</p>
                        {userPlan ? (
                            <>
                                <p className="text-sm text-gray-500 mb-4">{planName}</p>
                                {userMealTypes.map(mealType => (
                                    <p key={mealType} className="flex justify-between items-center text-md font-medium text-gray-800">
                                        <span>{mealType}</span>
                                        <span>Daily</span>
                                    </p>
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-red-500">No active plan found.</p>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Category</h2>
                    
                    <div className="space-y-4">
                        {reviewCategories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-200 
                                    ${selectedCategory === category.value ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <span className="font-semibold text-gray-800">{category.label}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    {selectedCategory && (
                        <div className="mt-8">
                            <h2 className="block text-lg font-semibold text-gray-700 mb-2">
                                Your Feedback for "{selectedCategory}" (Optional)
                            </h2>
                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows="4"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Type your message here..."
                            ></textarea>
                        </div>
                    )}
                    
                    <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || !selectedCategory}
                        className={`mt-8 w-full py-4 text-white font-bold rounded-xl shadow-md transition-colors duration-200 
                            ${isSubmitting || !selectedCategory ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:brightness-90'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
