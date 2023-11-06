/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { colors: {
      primary: '#6A1D57',
      secondary: '#ffffff',
      success: '#efefef',
      hover: '#9B30FF',
      input: '#33475b',
      border: '#cbd6e2',
    }},
  },
  plugins: [],
}