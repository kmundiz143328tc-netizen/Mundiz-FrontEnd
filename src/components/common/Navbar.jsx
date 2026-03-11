import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-blue-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9zm0 2.18L19.5 9 12 12.82 4.5 9 12 5.18z" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg">SchoolMS</span>
                        <span className="hidden sm:block text-blue-300 text-sm">Dashboard</span>
                    </div>

                    {/* Desktop User Menu */}
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white text-sm font-medium">{user?.name}</p>
                            <p className="text-blue-300 text-xs">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="sm:hidden text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {menuOpen && (
                    <div className="sm:hidden pb-4 border-t border-blue-800 pt-4">
                        <p className="text-white text-sm font-medium px-2">{user?.name}</p>
                        <p className="text-blue-300 text-xs px-2 mb-3">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;