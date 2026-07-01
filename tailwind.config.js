/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './node_modules/desy-ionic/**/*.{html,ts,mjs}',
    './node_modules/desy-html/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        // DESY Ionic exposes CSS custom properties; map them to Tailwind utilities.
        'desy-primary': 'var(--desy-color-primary, #00529b)',
        'desy-secondary': 'var(--desy-color-secondary, #4a8cca)',
        'desy-success': 'var(--desy-color-success, #2e7d32)',
        'desy-warning': 'var(--desy-color-warning, #f9a825)',
        'desy-danger': 'var(--desy-color-danger, #c62828)'
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};