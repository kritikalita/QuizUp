// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         "./src/**/*.{js,jsx,ts,tsx}",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: { // Define a primary color palette based on indigo
                    light: '#67e8f9', // Lighter shade for hover/accents
                    DEFAULT: '#0ea5e9', // Main primary color
                    dark: '#0369a1', // Darker shade for active/focus
                },
                // You could add secondary, accent colors etc. here
            },
            fontFamily: {
                // Add a clean sans-serif font stack
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
        },
    },
    plugins: [],
}