'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const ReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMealType, setSelectedMealType] = useState('Breakfast');

    const fetchReport = async (date) => {
        setLoading(true);
        setError(null);
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
            setError('Authentication failed. Please log in as an admin.');
            setLoading(false);
            return;
        }
        setToken(storedToken);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${date}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json'
                }
            });
            
            setReportData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch report.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReport(selectedDate);
    }, [selectedDate]);

    const getReportTitle = (date, mealType) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISO = yesterday.toISOString().split('T')[0];
        
        let dateLabel = new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        if (date === today) {
            dateLabel = "Today's";
        } else if (date === yesterdayISO) {
            dateLabel = "Yesterday's";
        }
        
        return `${dateLabel} ${mealType} Report`;
    };
    
    const getBgColor = (mealType) => {
      switch(mealType) {
        case 'Breakfast': return 'bg-teal-50';
        case 'Lunch': return 'bg-yellow-50';
        case 'Dinner': return 'bg-indigo-50';
        default: return 'bg-gray-50';
      }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filteredDeliveryReport = reportData?.delivery_report.filter(item => item.meal_type === selectedMealType) || [];
    const filteredKitchenReport = reportData?.kitchen_report.filter(item => {
        const mealExists = filteredDeliveryReport.some(deliveryItem => deliveryItem.selected_meal === item.meal_name);
        return mealExists;
    }) || [];

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <Head>
                <title>Order Reports</title>
            </Head>
            <Toaster />
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Order Reports</h1>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="mt-1 block rounded-md border-gray-300 shadow-sm"
                />
            </div>

            <div className="bg-white shadow-sm mb-4 p-2 mx-4 rounded-full max-w-lg mx-auto">
                <div className="flex justify-between">
                    {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
                        const isSelected = mealType === selectedMealType;
                        return (
                            <button
                                key={mealType}
                                onClick={() => setSelectedMealType(mealType)}
                                className={`w-1/3 py-2 px-4 rounded-full font-semibold transition-colors duration-200
                                    ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {mealType}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <div className="p-6 text-center text-gray-500">Loading reports...</div>
            ) : reportData ? (
                <div className={`${getBgColor(selectedMealType)} p-6 rounded-xl shadow-inner transition-colors duration-300`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{getReportTitle(selectedDate, selectedMealType)}</h2>

                    {filteredKitchenReport.length > 0 || filteredDeliveryReport.length > 0 ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Kitchen Report</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredKitchenReport.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.meal_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Delivery Report</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Meal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredDeliveryReport.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.user_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.selected_meal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center text-gray-500">No reports available for this date and meal type.</div>
                    )}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">No reports available for this date.</div>
            )}
        </div>
    );
};

export default ReportsPage;