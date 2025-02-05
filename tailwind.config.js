/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#1D4ED8', // blue-700
        },
        secondary: {
          DEFAULT: '#6B7280', // gray-500
          dark: '#374151', // gray-700
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#111827', // gray-900
          secondary: {
            DEFAULT: '#F3F4F6', // gray-100
            dark: '#1F2937', // gray-800
          }
        },
        text: {
          DEFAULT: '#111827', // gray-900
          dark: '#F9FAFB', // gray-50
          secondary: {
            DEFAULT: '#4B5563', // gray-600
            dark: '#9CA3AF', // gray-400
          }
        },
        border: {
          DEFAULT: '#E5E7EB', // gray-200
          dark: '#374151', // gray-700
        },
        accent: {
          DEFAULT: '#8B5CF6', // violet-500
          dark: '#6D28D9', // violet-700
        }
      }
    },
  },
  plugins: [],
}
