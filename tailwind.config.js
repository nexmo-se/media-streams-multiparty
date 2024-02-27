/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        hello: "url('/images/img-entrance-1.jpg')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
    },
  },
  plugins: [],
};
