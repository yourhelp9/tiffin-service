'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';

// Plan details ko yahaan define karein
const plans = {
//  1: { name: 'Weekly Plan (1 Meal)' },
//  2: { name: 'Weekly Plan (2 Meals)' },
  3: { name: 'Monthly Plan (1 Meal)' },
  4: { name: 'Monthly Plan (2 Meals)' },
  5: { name: 'Monthly Plan (3 Meals)' },
};

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [today, setToday] = useState(null);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchUser = async () => {
    if (typeof window === 'undefined') return;

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
    } catch (err) {
      setError('Failed to fetch user data. Please log in again.');
      console.error('User data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [router]);

  const togglePause = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    try {
      setPauseLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/toggle-pause`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      fetchUser();
    } catch (err) {
      console.error('Pause error:', err);
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setPauseLoading(false);
    }
  };

  if (loading || !today) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 font-bold text-2xl">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !user) {
    return <p className="text-center text-red-500 mt-16">{error}</p>;
  }

  const todaySelections =
    user.selections?.filter(
      (s) =>
        s.daily_menu &&
        new Date(s.daily_menu.menu_date).toISOString().split('T')[0] === today
    ) || [];

  const getPlanName = (planId) => {
    return plans[planId]?.name || 'N/A';
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-10 font-sans">
      <Head>
        <title>My Dashboard</title>
      </Head>
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 font-semibold">Deliver to</p>

            <div className="flex items-center flex-1 min-w-0">
              <p
                className={`text-sm font-medium text-gray-800 mr-1 ${
                  !isAddressExpanded ? 'truncate' : ''
                }`}
              >
                {user.address || 'Address not set'}
              </p>

              {user.address && (
                <button
                  onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                  className="text-gray-500"
                >
                  {isAddressExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Image Banner */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-4">
          <img
            src="https://i.ibb.co/nsccFFVz/banner1.jpg"
            alt="Lunch Thali Banner"
            className="w-full object-cover h-[200px] sm:h-[320px] md:h-[400px]"
          />
        </div>

        {/* Main Subscription Card */}
        <div className="bg-[#d5f1d0] p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-lg text-gray-600 mb-1">
            Meals Left:{' '}
            <span className="font-bold text-[#63ab45]">
              {user.subscription?.meals_remaining ?? 'N/A'}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Plan:{' '}
            <span className="font-semibold">
              {user.subscription?.plan_id
                ? getPlanName(user.subscription.plan_id)
                : 'No Active Plan'}
              {user.meals_time_preference &&
                ` (${user.meals_time_preference})`}
            </span>
          </p>
          {user.subscription && user.subscription.meals_remaining > 0 && (
            <button
              onClick={togglePause}
              disabled={pauseLoading}
              className={`mt-4 w-full py-2 px-4 text-white font-semibold rounded-xl shadow-md transition-colors duration-200 
                                ${
                                  pauseLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : user.is_subscription_paused
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-[#63ab45] hover:brightness-90'
                                }`}
            >
              {pauseLoading
                ? 'Processing...'
                : user.is_subscription_paused
                ? 'Resume Subscription'
                : 'Pause Subscription'}
            </button>
          )}
        </div>

        {/* What's Coming Today Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            What's Coming Today
          </h2>
          {todaySelections.length > 0 ? (
            <div className="space-y-4">
              {todaySelections.map((selection) => (
                <div
                  key={selection.id}
                  className="p-4 rounded-xl shadow-inner bg-gray-50 flex items-center space-x-4"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    {selection.selectedOption?.image_url ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${selection.selectedOption.image_url}`}
                        alt={selection.selectedOption.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900 mb-1">
                      {selection.daily_menu?.meal_type}
                    </p>
                    <p className="text-sm text-gray-700">
                      {selection.is_skipped ? (
                        <span className="text-red-500">Skipped</span>
                      ) : (
                        `Selected: ${selection.selectedOption?.name}`
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You haven't selected a meal for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
