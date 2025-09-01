/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050713',
        neonTeal: '#6ee7ff',
        neonPink: '#ff6ad5',
        lime: '#7cfa7b',
        lemon: '#ffe66d',
      },
      fontFamily: {
        'fredoka': ['Fredoka', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #6ee7ff, 0 0 10px #6ee7ff, 0 0 15px #6ee7ff' },
          '100%': { boxShadow: '0 0 10px #6ee7ff, 0 0 20px #6ee7ff, 0 0 30px #6ee7ff' },
        },
      },
    },
  },
  plugins: [],
}

