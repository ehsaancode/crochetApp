/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                silk: {
                    50: '#fdfbf7',
                    100: '#f7f1e6',
                    200: '#ece0cc',
                    300: '#dec6a6',
                    400: '#d0a67d',
                    500: '#c58a5b',
                    600: '#b97047',
                    700: '#9a583b',
                    800: '#7f4935',
                    900: '#673c2e',
                },
                accent: {
                    light: '#d4d4d8', // Zinc 300
                    DEFAULT: '#71717a', // Zinc 500
                    dark: '#27272a', // Zinc 800
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
