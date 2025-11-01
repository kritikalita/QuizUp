// src/ChatList.js (or src/components/ChatList.js)
import React from 'react';

function ChatList({ chatPartners, onUserSelect, onClose }) {
    return (
        // Positioned similarly to the chat window, but maybe wider/taller
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col transition-all duration-300 ease-in-out z-40 h-96 sm:h-[500px]">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h3 className="font-semibold">Conversations</h3>
                <button
                    onClick={onClose}
                    className="text-xl font-bold leading-none p-1 -m-1 rounded-full hover:bg-indigo-700"
                    title="Close chat list"
                >
                    &times;
                </button>
            </div>

            {/* User List Area */}
            <div className="flex-grow p-3 overflow-y-auto bg-gray-50">
                {chatPartners.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">No active conversations.</p>
                ) : (
                    <ul className="space-y-2">
                        {chatPartners.map(partner => (
                            <li key={partner}>
                                <button
                                    onClick={() => onUserSelect(partner)}
                                    className="w-full text-left p-2 rounded hover:bg-indigo-100 transition-colors capitalize text-gray-800"
                                >
                                    {partner}
                                    {/* TODO: Add unread indicator later if needed */}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Optional Footer (e.g., for starting new chat later) */}
            {/* <div className="p-2 border-t border-gray-200 text-center">
                 <button className="text-indigo-600 text-sm">Start New Chat</button>
            </div> */}
        </div>
    );
}

export default ChatList;