'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            await axios.post('http://127.0.0.1:8000/api/register', {
                name, email, password,
            });
            setMessage('Registration successful! Please switch to Login.');
            setIsLogin(true);
        } catch (error) {
            const backendErrorMsg = error.response?.data?.errors?.email?.[0] || 
                                     error.response?.data?.message || 
                                     'Registration failed. Please try again.';
            setMessage(`Error: ${backendErrorMsg}`);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email, password,
            });
            
            localStorage.setItem('auth_token', response.data.access_token);
            
            if (response.data.user.is_admin) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setMessage(`Error: ${errorMsg}`);
        }
    };
    
    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 p-4">
            <Head>
                <title>{isLogin ? 'Login' : 'Register'}</title>
            </Head>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    {isLogin ? 'Welcome Back!' : 'Create an Account'}
                </h1>
                
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#63ab45]"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#63ab45]"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#63ab45]"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            style={{ backgroundColor: '#63ab45' }}
                            className="w-full px-4 py-2 font-semibold text-white rounded-md shadow-md hover:brightness-90 transition-colors duration-200"
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: '#63ab45' }}
                        className="ml-2 font-medium hover:brightness-90 transition-colors duration-200"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-[#63ab45]'}`}>
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}