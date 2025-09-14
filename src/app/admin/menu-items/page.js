'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const MenuItemsPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('');

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formState, setFormState] = useState({ name: '', description: '', meal_type: '', image: null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMenuItems = async () => {
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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete menu item.');
            }

            setMessage('Menu item deleted successfully!');
            fetchMenuItems();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };
    
    const openAddForm = () => {
        setEditingItem(null);
        setFormState({ name: '', description: '', meal_type: '', image: null });
        setIsFormVisible(true);
    };

    const openEditForm = (item) => {
        setEditingItem(item);
        setFormState({
            name: item.name,
            description: item.description,
            meal_type: item.meal_type,
            image: null
        });
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('name', formState.name);
        formData.append('description', formState.description);
        formData.append('meal_type', formState.meal_type);
        if (formState.image) {
            formData.append('image', formState.image);
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/menu-items`;
        let method = 'POST';

        if (editingItem) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${editingItem.id}`;
            method = 'PUT'; // Use PUT for edits
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMsg = `Failed to ${editingItem ? 'update' : 'add'} item.`;
                if (errorData.message === 'Please upload an image for the menu item.') {
                    errorMsg = 'Please upload a valid image for the menu item.';
                } else if (errorData.errors && errorData.errors.name) {
                    errorMsg = `Error: The name "${formState.name}" is already taken.`;
                }
                throw new Error(errorMsg);
            }

            setMessage(`Menu item ${editingItem ? 'updated' : 'added'} successfully!`);
            setIsFormVisible(false);
            fetchMenuItems();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    if (loading) {
        return <div className="p-6">Loading Menu Items...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <Head>
                <title>Manage Menu Items</title>
            </Head>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Menu Items</h1>
                <button 
                    onClick={openAddForm}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    + Add New Item
                </button>
            </div>

            {message && <p className="mb-4 text-center text-sm text-green-600">{message}</p>}

            {isFormVisible && (
                <div className="mb-8 p-6 border rounded-xl shadow-inner bg-gray-50">
                    <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" value={formState.name} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" name="description" value={formState.description} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                            <select name="meal_type" value={formState.meal_type} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="">Select Meal Type</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input type="file" name="image" onChange={handleFormChange} className="mt-1 block w-full" />
                            {editingItem && <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current image.</p>}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsFormVisible(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-green-400"
                            >
                                {isSubmitting ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update Item' : 'Add Item')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.image_url ? (
                                        <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${item.image_url}`} alt={item.name} className="h-10 w-10 rounded-full" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.meal_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                                    <button 
                                        onClick={() => openEditForm(item)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuItemsPage;