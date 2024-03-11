/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      height: {
        header: 'var(--header-height, 60px)',

        'main-container-height': 'calc(100vh - var(--header-height, 60px))',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          darker: 'hsl(var(--background-darker))',
          lighter: 'hsl(var(--background-lighter))',
          lightest: 'hsl(var(--background-lightest))',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          100: '#F8FAFC',
          200: '#D0DEF1',
          300: '#A4C2EA',
          400: '#72A5E9',
          '500-main': '#3D88ED',
          600: '#096AEC',
          700: '#0053C2',
          800: '#003D8F',
          900: '#00275C',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        lighter: {
          DEFAULT: 'hsl(var(--lighter))',
        },
        shading: {
          DEFAULT: 'hsl(var(--shading))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          lighter: 'hsl(var(--success-lighter))',
          darker: 'hsl(var(--success-darker))',
          100: '#EDF7EE',
          200: '#C6ECC9',
          300: '#99E5A1',
          400: '#67E474',
          '500-main': '#30E843',
          600: '#0BDA20',
          700: '#00B512',
          800: '#00800D',
          900: '#004D08',
        },
        error: {
          DEFAULT: '#FF3333',
          lighter: 'hsl(var(--error-lighter))',
          darker: 'hsl(var(--error-darker))',
          100: '#F7D4D4',
          200: '#F5A3A3',
          300: '#F76E6E',
          '400-main': '#FF3333',
          500: '#FF0000',
          600: '#CC0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },

        stroke: {
          DEFAULT: 'hsl(var(--stroke))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        text: {
          DEFAULT: 'hsl(var(--text-color))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neutral: {
          white: '#fff',
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#0D0D0D',
          black: '#000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        ping: {
          '75%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1.5)' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'ping-cs': 'ping 1s linear infinite',
      },
      boxShadow: {
        '1': 'var(--shadow-1)',
        '2': 'var(--shadow-2)',
        '3': 'var(--shadow-3)',
        'n-1': 'var(--shadow-n-1)',
        glow: 'var(--glow)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
