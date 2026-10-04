/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#003539',
        'primary-container': '#004d53',
        'on-primary': '#ffffff',
        'primary-fixed': '#b0edf4',
        'primary-fixed-dim': '#95d1d7',
        'on-primary-fixed': '#002023',
        'on-primary-fixed-variant': '#034f55',
        'on-primary-container': '#81bdc3',
        
        'secondary': '#934b00',
        'secondary-container': '#ff9f53',
        'on-secondary': '#ffffff',
        'secondary-fixed': '#ffdcc5',
        'secondary-fixed-dim': '#ffb782',
        'on-secondary-fixed': '#301400',
        'on-secondary-container': '#713800',

        'tertiary': '#003717',
        'tertiary-container': '#005025',
        'on-tertiary': '#ffffff',
        'tertiary-fixed': '#a6f4b5',
        'tertiary-fixed-dim': '#8bd79b',
        'on-tertiary-fixed': '#00210b',
        'on-tertiary-container': '#77c387',

        'surface': '#fff8f6',
        'surface-dim': '#e1d8d6',
        'surface-bright': '#fff8f6',
        'surface-variant': '#e9e1df',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fbf2f0',
        'surface-container': '#f5ecea',
        'surface-container-high': '#efe6e4',
        'surface-container-highest': '#e9e1df',
        'on-surface': '#1e1b1a',
        'on-surface-variant': '#3f4849',

        'dark-base': '#061214',
        'dark-card': '#0a1e22',
        'dark-card-elevated': '#0f292e',
        'dark-border': '#173a41',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
