/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      xl: '1200px',
    },
    colors: {
      overlay: 'rgba(36, 36, 36, 0.45)',
      white: '#FFFFFF',
      black: '#000000',
      'off-white': '#F8F8F8',
      primary: {
        light: '#ABE1FF',
        DEFAULT: '#2DB3FF',
        hover: '#2698D9',
        dark: '#0C3045',
      },
      danger: {
        DEFAULT: '#E83333',
        hover: '#C52B2B',
      },
      green: {
        light: '#E2FEED',
        DEFAULT: '#198E48',
      },
      grey: {
        lighter: '#F5F5F5', // white-hover
        light: '#ECE3E3', // border
        DEFAULT: '#B3B3B3', // placeholder
        dark: '#656060', // text-secondary
        darkest: '#242424', // text-primary
      },
    },
    extend: {
      boxShadow: {
        item: '0px 4px 12px 0px rgba(173, 173, 173, 0.1)',
        'item-hover': '0px 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
