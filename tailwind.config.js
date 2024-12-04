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
        blueHover: 'rgb(59 130 246)',
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
      backgroundImage: {
        'primary-gradient':
          'linear-gradient(0.6turn, rgba(38,142,200,1), rgb(6,34,92))',
        'secondary-gradient':
          'linear-gradient(0.6turn, rgba(79,76,227,1), rgba(16,130,178,1))',
      },
    },
  },
};
