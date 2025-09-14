'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProfileIcon from './components/ProfileIcon';

export default function ConditionalLayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsLoggedIn(!!token);
    }, [pathname]);

    if (isAdminRoute) {
        return <>{children}</>;
    }

    const isActive = (path) => pathname === path;

    // Non-logged-in user header links
    const nonLoggedInLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Login/Register', href: '/login' },
    ];

    // Logged-in user footer links
    const loggedInLinks = [
        { name: 'Home', href: '/dashboard', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.44.966-.66 1.5-.66s1.06.22 1.5.66L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h3.75a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v4.875c0 .621.504 1.125 1.125 1.125h3.75a1.125 1.125 0 001.125-1.125V9.75M16.5 6L12 1.5 7.5 6" />
            </svg>
        )},
        { name: 'Menu', href: '/menu', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3.003.524a3.753 3.753 0 00-1.023 2.228c-.59 2.155-.194 4.254.855 5.927A10.514 10.514 0 0012 21c2.316 0 4.54-1.065 6-2.738a4.525 4.525 0 01.855-5.926c1.049-1.673 1.445-3.772.855-5.927a3.753 3.753 0 00-1.023-2.228A8.967 8.967 0 0012 6.042z" />
            </svg>
        )},
        { name: 'Plans', href: '/plans', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { name: 'Review', href: '/reviews', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-.937-.219-1.855-.659-2.673A3.375 3.375 0 0018.5 4.5h-13c-.636 0-1.25.26-1.691.727A3.375 3.375 0 002.25 8.25v7.5c0 .937.219 1.855.659 2.673A3.375 3.375 0 005.5 19.5h13c.636 0 1.25-.26 1.691-.727A3.375 3.375 0 0021.75 15.75v-7.5z" />
            </svg>
        )}
    ];

    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-md h-16 px-6 fixed top-0 left-0 w-full z-20">
                <div className="max-w-5xl mx-auto flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link href="/">
                        <div className="text-2xl font-extrabold text-[#63ab45] tracking-tight cursor-pointer">
                            Lunch<span className="text-gray-800">Mate</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    {isLoggedIn ? (
                        <ProfileIcon />
                    ) : (
                        <nav className="hidden sm:flex space-x-6">
                            {nonLoggedInLinks.map(link => (
                                <Link key={link.name} href={link.href}>
                                    <span
                                        className={`
                                            relative px-2 py-1 text-gray-700 font-medium transition
                                            hover:text-[#63ab45] hover:after:w-full
                                            ${isActive(link.href) ? 'text-[#63ab45] font-semibold after:w-full' : 'after:w-0'}
                                            after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#63ab45] after:transition-all after:duration-300
                                        `}
                                    >
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="mt-16 pb-20">{children}</main>

            {/* Footer Navigation */}
            {isLoggedIn && (
                <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-10">
                    <div className="max-w-5xl mx-auto flex justify-around items-center h-16 text-gray-600">
                        {loggedInLinks.map(link => (
                            <Link key={link.name} href={link.href}>
                                <span className={`flex flex-col items-center cursor-pointer transition-colors duration-200 hover:text-[#4e8737]
                                                  ${isActive(link.href) ? 'text-[#63ab45]' : ''}`}>
                                    {link.icon}
                                    <span className="text-xs mt-1">{link.name}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </>
    );
}
