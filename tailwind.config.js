/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#6C7C88',
        lightAccent: '#72838A',
        darkAccent: '#4D6870',
        darkShade: '#2A282C',
        lightShade: '#ACDEEC',
        darkBlue : '#314756',
      },
      fontFamily: {
        'poppins': ['Poppins', 'Arial', 'sans-serif']
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
