import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar (Left Menu) */}
            <aside className="w-64 bg-gray-800 text-white p-6 md:flex hidden flex-col">
                <div className="text-2xl font-bold mb-8">Admin Panel</div>
                <nav className="flex-1">
                    <Link href="/admin">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 cursor-pointer">
                            Dashboard
                        </span>
                    </Link>
                    <Link href="/admin/users">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                            Users
                        </span>
                    </Link>
                    <Link href="/admin/menu-items">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                            Menu Items
                        </span>
                    </Link>
                    <Link href="/admin/daily-menus">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                            Daily Menus
                        </span>
                    </Link>
                    <Link href="/admin/reports">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                            Reports
                        </span>
                    </Link>

                      <Link href="/admin/reviews">
                        <span className="block py-2 px-4 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                            Reviews
                        </span>
                    </Link>
                </nav>
            </aside>
            
            {/* Main Content Area */}
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}