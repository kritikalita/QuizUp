// src/TopNavBar.js
import React from 'react';

// Simple Heroicon SVGs (replace if you install an icon library)
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996-.608 2.296-.07 2.572 1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);


function TopNavBar({ username, onLogout, onSearchClick, onChatClick, onSettingsClick, chatNotifications = 0 }) {
    return (
        // Updated background to primary (red) and removed transparency/blur
        <nav className="fixed top-0 left-0 right-0 bg-primary text-white p-4 flex items-center justify-between shadow-md z-50">
            {/* Settings Icon */}
            <button onClick={onSettingsClick} className="text-xl mr-4 opacity-90 hover:opacity-100 transition-opacity focus:outline-none" title="Settings">
                <SettingsIcon />
            </button>

            {/* Username - Centered */}
            <div className="flex-grow text-center">
                {/* Use a placeholder name if username is not available, matching screenshot */}
                <span className="font-semibold text-lg capitalize">{username || 'User Profile'}</span>
            </div>

            {/* Icons on the Right */}
            <div className="flex items-center space-x-5">
                {/* Search Icon */}
                <button onClick={onSearchClick} className="text-white hover:text-gray-200 transition-colors focus:outline-none" title="Search Users">
                    <SearchIcon />
                </button>

                {/* Chat Icon with Badge */}
                <div className="relative">
                    <button onClick={onChatClick} className="text-white hover:text-gray-200 transition-colors focus:outline-none" title="Conversations">
                        <ChatIcon />
                    </button>
                    {/* Updated badge to match screenshot (dark with white number) */}
                    {chatNotifications > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none">
                            {chatNotifications > 9 ? '9+' : chatNotifications}
                        </span>
                    )}
                </div>

                {/* Logout Button (Hidden on this profile-centric nav, but kept logic) */}
                <button
                    onClick={onLogout}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-md shadow-sm text-sm transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default TopNavBar;
