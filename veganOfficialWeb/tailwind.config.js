/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
      },
    },
    corePlugins: {
    },
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      // addComponents({
      //   '.container': {
      //     maxWidth: '80%',
      //     '@screen sm': {
      //       maxWidth: '80%'
      //     },
      //     '@screen md': {
      //       maxWidth: '80%'
      //     },
      //     '@screen lg': {
      //       maxWidth: '1440px'
      //     },
      //     '@screen xl': {
      //       maxWidth: '1920px'
      //     }
      //   }
      // });
    }
  ],
}

