/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
    extend: {
      fontFamily: {
        sans: 'var(--font-poppins)',
      },
      backgrounImage: {
        'hero-pattern': "url('/background-image.jpg')",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
