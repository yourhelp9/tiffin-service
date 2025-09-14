'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import React from 'react';

const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userSelections, setUserSelections] = useState([]);
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMealType, setSelectedMealType] = useState('Breakfast');
    
    const [selections, setSelections] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchAllData = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Authentication failed. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = userResponse.data;
            setUser(userData);

            const userSelectionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-selections`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUserSelections(userSelectionsResponse.data);

            const menuResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/daily-menus`);
            const data = menuResponse.data;
            setMenuData(data);
            
            const allowedMealTypes = userData?.meals_time_preference ? userData.meals_time_preference.split(',') : [];
            if (allowedMealTypes.length > 0) {
                if (!allowedMealTypes.includes(selectedMealType)) {
                    setSelectedMealType(allowedMealTypes[0]);
                }
            }

            const initialSelections = {};
            data.forEach(item => {
                const existingSelection = userSelectionsResponse.data.find(s => s.daily_menu_id === item.id);
                if (existingSelection) {
                    initialSelections[item.id] = existingSelection.is_skipped ? 'skip' : existingSelection.selected_option_id;
                } else {
                    initialSelections[item.id] = item.option_1_id;
                }
            });
            setSelections(initialSelections);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const getNext7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(new Date().getDate() + i);
            dates.push(date);
        }
        return dates;
    };
    
    useEffect(() => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        fetchAllData();
    }, []);

    const handleSelection = (dailyMenuId, selectedOptionId) => {
        if (!user?.subscription || user.subscription.meals_remaining <= 0) {
            toast.error('Please purchase or activate your plan to make selections.');
            return;
        }
        if (user.is_subscription_paused) {
            toast.error('Your subscription is currently paused.');
            return;
        }

        setSelections(prev => ({
            ...prev,
            [dailyMenuId]: selectedOptionId
        }));
    };

    const handleSaveSelections = async () => {
        if (!user?.subscription || user.subscription.meals_remaining <= 0) {
            toast.error('You do not have an active plan to save selections.');
            return;
        }
        if (user.is_subscription_paused) {
            toast.error('Your subscription is currently paused.');
            return;
        }
    
        setIsSaving(true);
        const token = localStorage.getItem('auth_token');

        const selectedMenu = filteredMenu.find(m => m.meal_type === selectedMealType);
        
        if (!selectedMenu) {
            toast.error('No menu item available to save for this meal type.');
            setIsSaving(false);
            return;
        }
        
        const dailyMenuId = selectedMenu.id;
        const selectedValue = selections[dailyMenuId];
        
        if (!selectedValue) {
            toast.error('Please select an option or skip the meal.');
            setIsSaving(false);
            return;
        }
        
        const selectionData = {
            daily_menu_id: dailyMenuId,
            selected_option_id: selectedValue === 'skip' ? null : selectedValue,
            is_skipped: selectedValue === 'skip' ? true : false,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-selections`, selectionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success('Selections saved successfully!');
                await fetchAllData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || `Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const isPastDeadline = () => {
        if (!selectedDate) return true;
        const selectedDateObj = new Date(selectedDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (selectedDateObj.toDateString() === new Date().toDateString()) {
            return true;
        }
        
        const deadline = new Date();
        deadline.setHours(17, 0, 0, 0); // 5 PM IST
        return selectedDateObj.toDateString() === tomorrow.toDateString() && new Date() > deadline;
    };

    if (loading || !selectedDate) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 font-bold text-2xl">
                <p>Menu is loading...</p>
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

    const days = getNext7Days();
    const hasActivePlan = user?.subscription?.meals_remaining > 0;
    const isPaused = user?.is_subscription_paused;
    const allowedMealTypes = user?.meals_time_preference ? user.meals_time_preference.split(',') : [];

    const filteredMenu = menuData.filter(item => 
        item.menu_date.substring(0, 10) === selectedDate && item.meal_type === selectedMealType
    );
    
    // Check if the current meal has a saved preference
    const currentMealSelection = filteredMenu[0] && userSelections.find(s => s.daily_menu_id === filteredMenu[0].id);
    const isPreferenceSaved = currentMealSelection && (currentMealSelection.selected_option_id === selections[currentMealSelection.daily_menu_id] || (currentMealSelection.is_skipped && selections[currentMealSelection.daily_menu_id] === 'skip'));

    const isButtonDisabled = isSaving || !hasActivePlan || isPaused || isPastDeadline();

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Head>
                <title>Tiffin Menu</title>
            </Head>
            <Toaster />
            
            <div className="bg-white shadow-sm pb-4">
                <div className="max-w-4xl mx-auto px-4 pt-6">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        {user && (
                            <>
                                <p>Welcome, <span className="font-semibold text-gray-800">{user.name}</span>!</p>
                                {hasActivePlan ? (
                                    <p>Meals Left: <span className="font-semibold text-gray-800">{user.subscription.meals_remaining}</span></p>
                                ) : (
                                    <p className="text-red-500">No Active Plan</p>
                                )}
                            </>
                        )}
                        {/* Pause/Resume button ko hata diya gaya hai */}
                    </div>
                </div>
                
                <div className="mt-6 max-w-4xl mx-auto px-4">
                    <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {days.map((day, index) => {
                            const dateISO = day.toISOString().split('T')[0];
                            const isSelected = dateISO === selectedDate;
                            const isToday = dateISO === new Date().toISOString().split('T')[0];
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(dateISO)}
                                    className={`inline-flex flex-col items-center px-4 py-2 mx-1 rounded-xl transition-all duration-200 min-w-[6rem]
                                    ${isSelected ? 'bg-[#63ab45] text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <span className="text-xs font-semibold">{isToday ? 'Today' : day.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                                    <span className="text-lg font-bold">{day.getDate()}</span>
                                    <span className="text-xs">{day.toLocaleDateString('en-IN', { month: 'short' })}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm mt-4 p-2 mx-4 rounded-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                <div className="flex justify-between">
                    {['Breakfast', 'Lunch', 'Dinner'].filter(mealType => allowedMealTypes.includes(mealType)).map((mealType) => {
                        const isSelected = mealType === selectedMealType;
                        return (
                            <button
                                key={mealType}
                                onClick={() => setSelectedMealType(mealType)}
                                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-200
                                    ${isSelected ? 'bg-[#63ab45] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {mealType}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto mt-6 px-4">
                {filteredMenu.length > 0 ? (
                    filteredMenu.map((dailyMenu) => (
                        <div key={dailyMenu.id} className="space-y-4">
                            {/* Option 1 Card */}
                            <div 
                                onClick={() => handleSelection(dailyMenu.id, dailyMenu.option_1_id)}
                                className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 
                                     ${selections[dailyMenu.id] === dailyMenu.option_1_id ? 'bg-[#d5f1d0] border-2 border-[#63ab45]' : 'bg-white shadow hover:shadow-md'}
                                     ${!hasActivePlan || isPaused || isPastDeadline() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {dailyMenu.option1?.image_url ? (
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${dailyMenu.option1.image_url}`} 
                                        alt={dailyMenu.option1?.name} 
                                        className="w-16 h-16 rounded-full object-cover shadow-inner"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">No Image</div>
                                )}
                                <div className="ml-4 flex-grow">
                                    <span className="text-xs text-[#63ab45] font-semibold mb-1 block">
                                        {selections[dailyMenu.id] === dailyMenu.option_1_id ? 'Selected' : 'Option 1'}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-800">{dailyMenu.option1?.name}</h3>
                                    <p className="text-sm text-gray-500">{dailyMenu.option1?.description}</p>
                                </div>
                                {selections[dailyMenu.id] === dailyMenu.option_1_id && (
                                    <span className="h-6 w-6 rounded-full bg-[#63ab45] border-2 border-white"></span>
                                )}
                            </div>

                            {/* Option 2 Card */}
                            {dailyMenu.option2?.name && (
                                <div 
                                    onClick={() => handleSelection(dailyMenu.id, dailyMenu.option_2_id)}
                                    className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 
                                        ${selections[dailyMenu.id] === dailyMenu.option_2_id ? 'bg-[#d5f1d0] border-2 border-[#63ab45]' : 'bg-white shadow hover:shadow-md'}
                                        ${!hasActivePlan || isPaused || isPastDeadline() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {dailyMenu.option2?.image_url ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${dailyMenu.option2.image_url}`} 
                                            alt={dailyMenu.option2?.name} 
                                            className="w-16 h-16 rounded-full object-cover shadow-inner"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">No Image</div>
                                    )}
                                    <div className="ml-4 flex-grow">
                                        <span className="text-xs text-[#63ab45] font-semibold mb-1 block">
                                            {selections[dailyMenu.id] === dailyMenu.option_2_id ? 'Selected' : 'Option 2'}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-800">{dailyMenu.option2?.name}</h3>
                                        <p className="text-sm text-gray-500">{dailyMenu.option2?.description}</p>
                                    </div>
                                    {selections[dailyMenu.id] === dailyMenu.option_2_id && (
                                        <span className="h-6 w-6 rounded-full bg-[#63ab45] border-2 border-white"></span>
                                    )}
                                </div>
                            )}

                            {/* Skip Card */}
                            <div 
                                onClick={() => handleSelection(dailyMenu.id, 'skip')}
                                className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 
                                    ${selections[dailyMenu.id] === 'skip' ? 'bg-gray-200 border-2 border-gray-400' : 'bg-white shadow hover:shadow-md'}
                                    ${!hasActivePlan || isPaused || isPastDeadline() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <span className="text-xs text-gray-500 font-semibold mb-1 block">
                                        {selections[dailyMenu.id] === 'skip' ? 'Selected' : ''}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-800">Skip {dailyMenu.meal_type}</h3>
                                    <p className="text-sm text-gray-500">Help us cut down food wastage.</p>
                                </div>
                                {selections[dailyMenu.id] === 'skip' && (
                                    <span className="h-6 w-6 rounded-full bg-gray-500 border-2 border-white"></span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-48 bg-gray-100 rounded-lg">
                        <p className="text-gray-500">No menu available for this date or meal type.</p>
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8 space-y-4"> {/* Yahaan spacing add kiya gaya hai */}
<button
    onClick={handleSaveSelections}
    disabled={isButtonDisabled || isPreferenceSaved}
    className={`w-full py-4 text-white rounded-xl shadow-lg transition-colors duration-200 
        ${isButtonDisabled || isPreferenceSaved ? 'bg-[#525252] disabled:cursor-not-allowed' : 'bg-[#63ab45] hover:bg-primary-green-600'}`}
>
    {isSaving ? 'Saving...' : (isPreferenceSaved ? 'Preference Saved' : 'Save My Selections')}
</button>
            </div>
        </div>
    );
};

export default MenuPage;