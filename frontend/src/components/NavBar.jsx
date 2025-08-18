import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText, User, LogIn, LogOut } from 'lucide-react';

const Navbar = ({ onNavigate, hidden = false }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const handleNavigation = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            const userId = localStorage.getItem('userId');
            setIsLoggedIn(!!userId);
        };

        checkAuthStatus();

        window.addEventListener('storage', checkAuthStatus);
        
        return () => window.removeEventListener('storage', checkAuthStatus);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include', 
            });

            localStorage.removeItem('userId');

            setIsLoggedIn(false);

            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);

            localStorage.removeItem('userId');
            setIsLoggedIn(false);
            window.location.href = '/';
        }
    };


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    if (hidden) {
        return null;
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ease-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => handleNavigation('/')}
                                className="text-2xl font-bold text-teal-700 hover:text-teal-800 transition-colors"
                            >
                                SkillSwap
                            </button>
                        </div>

                        <div className="flex items-center space-x-1">
                            {/* Afișează navigația doar dacă utilizatorul e logat */}
                            {isLoggedIn && (
                                <>
                                    <button
                                        onClick={() => handleNavigation('/conv')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <MessageCircle size={20} />
                                        <span className="hidden sm:block font-medium">Chat</span>
                                    </button>

                                    <button
                                        onClick={() => handleNavigation('/requests')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <FileText size={20} />
                                        <span className="hidden sm:block font-medium">Requests</span>
                                    </button>

                                    <button
                                        onClick={() => handleNavigation('/my-profile')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <User size={20} />
                                        <span className="hidden sm:block font-medium">My Profile</span>
                                    </button>
                                </>
                            )}

                            {/* Buton Login/Logout */}
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 ml-2 rounded-lg bg-red-700/80 text-white hover:bg-red-800/80 transition-colors shadow-sm"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Log Out</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleNavigation('/auth')}
                                    className="flex items-center space-x-2 px-4 py-2 ml-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
                                >
                                    <LogIn size={20} />
                                    <span className="font-medium">Log In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile navigation - se afizeaza doar cand esti logat */}
                {isLoggedIn && (
                    <div className="sm:hidden border-t border-gray-200 bg-gray-50">
                        <div className="px-2 py-2 space-x-1 flex justify-around">
                            <button
                                onClick={() => handleNavigation('/conv')}
                                className="flex flex-col items-center py-2 px-3 rounded text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <MessageCircle size={20} />
                                <span className="text-xs mt-1">Chat</span>
                            </button>
                            
                            <button
                                onClick={() => handleNavigation('/requests')}
                                className="flex flex-col items-center py-2 px-3 rounded text-gray-700 hover:text-orange-600 transition-colors"
                            >
                                <FileText size={20} />
                                <span className="text-xs mt-1">Requests</span>
                            </button>
                            
                            <button
                                onClick={() => handleNavigation('/my-profile')}
                                className="flex flex-col items-center py-2 px-3 rounded text-gray-700 hover:text-purple-600 transition-colors"
                            >
                                <User size={20} />
                                <span className="text-xs mt-1">Profile</span>
                            </button>
                            
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center py-2 px-3 rounded text-red-600 hover:text-red-700 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="text-xs mt-1">Log Out</span>
                            </button>
                        </div>
                    </div>
                )}
                
                {!isLoggedIn && (
                    <div className="sm:hidden border-t border-gray-200 bg-gray-50">
                        <div className="px-2 py-2 flex justify-center">
                            <button
                                onClick={() => handleNavigation('/auth')}
                                className="flex flex-col items-center py-2 px-3 rounded text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                <LogIn size={20} />
                                <span className="text-xs mt-1">Log In</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
            
            <div className="h-16 sm:h-16"></div>
        </>
    );
};

export default Navbar;