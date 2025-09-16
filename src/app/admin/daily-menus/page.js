'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const DailyMenusPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [dailyMenus, setDailyMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('');

    const [formState, setFormState] = useState({
        menu_date: new Date().toISOString().split('T')[0],
        meal_type: 'Breakfast',
        option_1_id: '',
        option_2_id: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);

    const fetchDailyMenus = async (storedToken) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/daily-menus`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch daily menus.');
            }
            const data = await response.json();
            setDailyMenus(data);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };
    
    useEffect(() => {
        const fetchAllData = async () => {
            const storedToken = localStorage.getItem('auth_token');
            if (!storedToken) {
                setError('Authentication failed. Please log in as an admin.');
                setLoading(false);
                return;
            }
            setToken(storedToken);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-items`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch menu items.');
                }

                const data = await response.json();
                setMenuItems(data);
                if (data.length >= 2) {
                    setFormState(prev => ({
                        ...prev,
                        option_1_id: data[0].id,
                        option_2_id: data[1].id,
                    }));
                }
                
                await fetchDailyMenus(storedToken);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const url = editingMenu 
            ? `${process.env.NEXT_PUBLIC_API_URL}/daily-menus/${editingMenu.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/daily-menus`;
        const method = editingMenu ? 'PUT' : 'POST';

        const payload = {
            ...formState,
            option_2_id: formState.option_2_id || null,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = 'Failed to process request.';
                if (data.errors) {
                    errorMsg = 'Validation Error: ';
                    if (data.errors.menu_date) errorMsg += 'This date already has a menu set. ';
                    if (data.errors.option_2_id) errorMsg += 'Option 1 and Option 2 must be different. ';
                    if (data.errors.option_1_id) errorMsg += 'Please select both options. ';
                } else if (data.message) {
                    errorMsg = data.message;
                }
                throw new Error(errorMsg);
            }

            setMessage(`Daily menu ${editingMenu ? 'updated' : 'added'} successfully!`);
            await fetchDailyMenus(token);
            setEditingMenu(null);
            setFormState({
                menu_date: new Date().toISOString().split('T')[0],
                meal_type: 'Breakfast',
                option_1_id: '',
                option_2_id: '',
            });

        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu?")) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/daily-menus/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete daily menu.');
            }
            setMessage('Daily menu deleted successfully!');
            await fetchDailyMenus(token);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };
    
    const handleEdit = (menu) => {
        setEditingMenu(menu);
        setFormState({
            menu_date: menu.menu_date,
            meal_type: menu.meal_type,
            option_1_id: menu.option_1_id,
            option_2_id: menu.option_2_id || '',
        });
    };

    if (loading) {
        return <div className="p-6">Loading Admin Form...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    const availableItems = (type) => menuItems.filter(item => item.meal_type === type);
    
    const menusByDate = dailyMenus.reduce((acc, menu) => {
        const date = new Date(menu.menu_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = {
                dateISO: menu.menu_date,
                Breakfast: null,
                Lunch: null,
                Dinner: null
            };
        }
        acc[date][menu.meal_type] = menu;
        return acc;
    }, {});
    
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateISO = maxDate.toISOString().split('T')[0];
    
    const getRelativeDate = (isoDate) => {
      const todayISO = new Date().toISOString().split('T')[0];
      const tomorrowISO = new Date();
      tomorrowISO.setDate(tomorrowISO.getDate() + 1);
      const tomorrowISOString = tomorrowISO.toISOString().split('T')[0];
      
      if (isoDate === todayISO) return 'Today';
      if (isoDate === tomorrowISOString) return 'Tomorrow';
      return new Date(isoDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <Head>
                <title>Manage Daily Menus</title>
            </Head>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{editingMenu ? 'Edit Daily Menu' : 'Set Daily Menus'}</h1>
            </div>

            {message && <p className={`mb-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-[#63ab45]'}`}>{message}</p>}

            <div className="p-6 border rounded-xl shadow-inner bg-gray-50 mb-8">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu Date</label>
                        <input type="date" name="menu_date" value={formState.menu_date} min={today} max={maxDateISO} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                        <select name="meal_type" value={formState.meal_type} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Option 1</label>
                        <select name="option_1_id" value={formState.option_1_id} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="">Select Option 1</option>
                            {availableItems(formState.meal_type).map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Option 2 (Optional)</label>
                        <select name="option_2_id" value={formState.option_2_id} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="">Select Option 2</option>
                            {availableItems(formState.meal_type).map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#63ab45] text-white rounded-md text-sm font-medium hover:bg-primary-green-600 disabled:bg-primary-green-400"
                        >
                            {isSubmitting ? 'Processing...' : editingMenu ? 'Update Daily Menu' : 'Create Daily Menu'}
                        </button>
                        {editingMenu && (
                            <button
                                type="button"
                                onClick={() => setEditingMenu(null)}
                                className="ml-4 px-6 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
            
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Daily Menus</h2>
                {Object.keys(menusByDate).length > 0 ? (
                    <div className="space-y-6">
                        {Object.keys(menusByDate).map(date => (
                            <div key={date} className="p-4 border rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">{getRelativeDate(menusByDate[date].dateISO)} - {date}</h3>
                                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                    {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                                        <div key={mealType} className={`flex-1 p-4 rounded-lg shadow-inner 
                                            ${mealType === 'Breakfast' ? 'bg-[#d5f1d0]' : 
                                              mealType === 'Lunch' ? 'bg-[#d9edcf]' : 'bg-[#b4db9f]'}`}>
                                            <p className="font-semibold text-gray-900 mb-2">{mealType}</p>
                                            {menusByDate[date][mealType] ? (
                                                <>
                                                    <div className="text-sm text-gray-700">
                                                        <p>1. {menusByDate[date][mealType].option1?.name}</p>
                                                        <p>2. {menusByDate[date][mealType].option2?.name || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex space-x-2 mt-4">
                                                        <button 
                                                            onClick={() => handleEdit(menusByDate[date][mealType])}
                                                            className="text-[#63ab45] hover:text-primary-green-900 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(menusByDate[date][mealType].id)}
                                                            className="text-red-600 hover:text-red-900 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-400">Not set</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No daily menus have been created yet.</p>
                )}
            </div>
        </div>
    );
};

export default DailyMenusPage;