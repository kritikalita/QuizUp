/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New color palette based on the screenshot
                primary: {
                    DEFAULT: '#ef4444', // red-500
                    dark: '#dc2626', // red-600
                },
                secondary: '#3b82f6', // blue-500 (for Chat)
                accent: '#22c55e', // green-500 (for Play)
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
        },
    },
    plugins: [],
}
