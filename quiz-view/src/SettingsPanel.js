import React, { useState, useEffect, useMemo } from 'react';
import countryList from 'country-list'; // We installed this
import ReactCountryFlag from 'react-country-flag'; // We installed this

// A simple loading spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

function SettingsPanel({ show, onClose, currentCountryCode, onSave, isSubmitting }) {
    // State for the dropdown
    const [selectedCode, setSelectedCode] = useState(currentCountryCode || '');

    // Get the list of countries
    const countryOptions = useMemo(() => {
        // 'country-list' gives { code: 'US', name: 'United States' }
        return countryList.getData().map(country => ({
            value: country.code,
            label: country.name
        })).sort((a, b) => a.label.localeCompare(b.label)); // Sort them alphabetically
    }, []);

    // Reset the form if the panel is opened and the user's data has changed
    useEffect(() => {
        setSelectedCode(currentCountryCode || '');
    }, [currentCountryCode, show]);

    if (!show) {
        return null; // Don't render anything if not visible
    }

    const handleSave = () => {
        onSave(selectedCode);
    };

    const isSaveDisabled = isSubmitting || (selectedCode === (currentCountryCode || ''));

    return (
        // Modal overlay
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-start items-start z-50"
            onClick={onClose} // Close when clicking the overlay
        >
            {/* Settings Panel */}
            <div
                className="relative w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
                style={{ transform: show ? 'translateX(0)' : 'translateX(-100%)' }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Country Update Form */}
                    <div className="space-y-2">
                        <label htmlFor="countrySelect" className="block text-sm font-semibold text-gray-700">
                            Update Your Country
                        </label>

                        <div className="flex items-center space-x-2">
                            {/* Flag Preview */}
                            <span className="text-2xl border rounded-sm overflow-hidden w-9 h-7 flex items-center justify-center bg-gray-50">
                                {selectedCode && (
                                    <ReactCountryFlag
                                        countryCode={selectedCode}
                                        svg
                                        style={{ width: '2rem', height: '2rem' }}
                                    />
                                )}
                            </span>

                            {/* Country Dropdown */}
                            <select
                                id="countrySelect"
                                value={selectedCode}
                                onChange={(e) => setSelectedCode(e.target.value)}
                                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Select a country...</option>
                                {countryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">This will be shown on your public profile.</p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[40px]"
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;