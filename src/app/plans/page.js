'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const plans = [
 //   { id: 1, name: 'Weekly Plan', description: '1 Meal', price: 499, meals_per_day: 1, meals_total: 7 },
   // { id: 2, name: 'Weekly Plan', description: '2 Meals', price: 999, meals_per_day: 2, meals_total: 14 },
    { id: 3, name: 'Monthly Plan', description: '1 Meal', price: 1999, meals_per_day: 1, meals_total: 30 },
    { id: 4, name: 'Monthly Plan', description: '2 Meals', price: 3999, meals_per_day: 2, meals_total: 60 },
    { id: 5, name: 'Monthly Plan', description: '3 Meals', price: 5999, meals_per_day: 3, meals_total: 90 },
];

const PlansPage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
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

    const handleBuy = (planId) => {
        if (user?.subscription?.meals_remaining > 0) {
            toast.error('You already have an active plan. Please wait for credits to expire.');
            return;
        }
        const selectedPlan = plans.find(p => p.id === planId);
        if (selectedPlan) {
            toast.success('Please contact the admin to activate your plan.');
        }
    };
    
    const isPlanDisabled = (planId) => {
        return user?.subscription?.plan_id === planId;
    };
    
    const activePlan = plans.find(p => p.id === user?.subscription?.plan_id);
    const totalMeals = activePlan?.meals_total || 0;
    const remainingMeals = user?.subscription?.meals_remaining || 0;
    const usedMeals = totalMeals - remainingMeals;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-gray-700 text-lg font-semibold">Loading plans...</p>
            </div>
        );
    }
    
    const isPlanActive = user?.subscription?.meals_remaining > 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans flex items-center justify-center">
            <Head>
                <title>My Subscription</title>
            </Head>
            <Toaster />
            <div className="max-w-4xl mx-auto text-center w-full">
                {isPlanActive ? (
                    <div className="bg-white p-6 rounded-3xl shadow-xl w-full mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Subscription</h1>
                        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
                            <div className="text-left">
                                <h2 className="font-bold text-green-800 text-xl">{plans.find(p => p.id === user.subscription?.plan_id)?.name}</h2>
                                <p className="text-sm text-green-600">
                                    Meals/Day: {user.subscription.meals_per_day}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-green-600">Status:</p>
                                <p className="text-2xl font-bold text-green-800">Active</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-gray-100 rounded-xl">
                                <p className="text-xl font-bold text-gray-800">{totalMeals}</p>
                                <p className="text-xs text-gray-500">Total Meals</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-xl">
                                <p className="text-xl font-bold text-gray-800">{usedMeals}</p>
                                <p className="text-xs text-gray-500">Meals Used</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-xl">
                                <p className="text-xl font-bold text-gray-800">{remainingMeals}</p>
                                <p className="text-xs text-gray-500">Meals Remaining</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-3xl shadow-xl w-full mb-8 text-center">
                         <h1 className="text-3xl font-bold text-gray-800 mb-4">My Subscription</h1>
                         <div className="bg-red-50 p-6 rounded-xl text-center">
                            <p className="text-red-900 font-semibold">You have no active plan.</p>
                         </div>
                    </div>
                )}
                
                <div className="bg-white p-6 rounded-3xl shadow-xl w-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Choose a Plan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map(plan => (
                            <div 
                                key={plan.id} 
                                className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-start 
                                transform transition-all duration-300 hover:scale-105"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h2>
                                <p className="text-xl text-gray-500 mb-4">{plan.description}</p>
                                <div className="flex items-baseline mb-4">
                                    <p className="text-4xl font-extrabold text-green-600" >
                                        ₹{plan.price}
                                    </p>
                                    <span className="text-lg font-medium text-gray-500 ml-1">/month</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Total Meals: {plan.meals_total}</p>

                                {isPlanDisabled(plan.id) ? (
                                    <button
                                        style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}
                                        className="w-full py-3 text-white font-bold rounded-xl shadow-md"
                                        disabled
                                    >
                                        Activated
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBuy(plan.id)}
                                        className="w-full py-3 text-white font-bold rounded-xl shadow-md bg-green-500 hover:bg-green-600 transition-all duration-200"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default PlansPage;