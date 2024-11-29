/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#007bff',
        lightBlue: '#1082b2',
        darkBlue: '#2123a7',
        secondaryBlue: '#268ec8',
        lightGray: '#fafafa',
        darkGray: '#111',
        accent: '#f7fcff',
        hoverBlue: '#0056b3',
        white: '#ffffff',
      },
      fontFamily: {
        base: ['Work Sans', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        button: '8px',
        default: '10px',
      },
      boxShadow: {
        card: '0px 2px 2px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
