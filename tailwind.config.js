module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
