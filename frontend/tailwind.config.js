/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // ─── VenueAura Color System ─────────────────────────────────────────────
      colors: {
        // Primary – Emerald Green brand color
        primary: {
          DEFAULT: '#00C853',
          50: '#E8FFF1',
          100: '#C3FFD9',
          200: '#8BFBB5',
          300: '#4FF58D',
          400: '#1AEB6B',
          500: '#00C853',
          600: '#009B45',
          700: '#007535',
          800: '#005027',
          900: '#002B15',
          950: '#001409',
        },

        // Backgrounds
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7F8F6', // Warm off-white for section backgrounds
          card: '#FFFFFF',
        },

        // Typography
        text: {
          DEFAULT: '#171717',
          muted: '#777777',
          light: '#AAAAAA',
        },

        // Borders
        border: {
          DEFAULT: '#E8E8E8',
          light: '#F0F0F0',
        },

        // Status colors
        success: '#00C853',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },

      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        // Elegant serif for headings (matches reference screenshots)
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        // Clean sans-serif for body text
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md': ['2.25rem', { lineHeight: '1.25' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],
      },

      // ─── Shadows ─────────────────────────────────────────────────────────────
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.14)',
        nav: '0 1px 0 rgba(0, 0, 0, 0.08)',
        dropdown: '0 4px 20px rgba(0, 0, 0, 0.12)',
        modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
        'primary-sm': '0 2px 8px rgba(0, 200, 83, 0.3)',
        'primary-md': '0 4px 16px rgba(0, 200, 83, 0.4)',
      },

      // ─── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        card: '12px',
        'card-lg': '16px',
        button: '8px',
        pill: '999px',
      },

      // ─── Spacing ──────────────────────────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        section: '5rem', // Standard section padding
      },

      // ─── Max Widths ───────────────────────────────────────────────────────────
      maxWidth: {
        'screen-2xl': '1400px',
        'content': '1280px',
      },

      // ─── Transitions ──────────────────────────────────────────────────────────
      transitionDuration: {
        250: '250ms',
      },

      // ─── Background Images ────────────────────────────────────────────────────
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #009B45 0%, #00C853 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
      },

      // ─── Animations ───────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-primary': 'pulsePrimary 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulsePrimary: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },

  plugins: [],
};

