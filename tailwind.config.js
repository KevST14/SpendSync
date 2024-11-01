/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a00e0',
        secondary: '#8e2de2',
        accent: '#00fff0',
        background: '#0f0f1e',
        surface: '#1a1a2e',
        textPrimary: '#ffffff',
        textSecondary: '#b3b3b3',
        success: '#00ff9d',
        warning: '#ffd700',
        danger: '#ff4757',
      },
      boxShadow: {
        custom: '0 10px 20px rgba(0, 0, 0, 0.2)',
        glow: '0 0 15px rgba(0, 255, 240, 0.5)',
      },
    },
  },
  plugins: [],
};
