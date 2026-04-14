/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nothing Design System - Dark Mode Primary Palette
        background: '#000000', // --black
        surface: '#111111',
        'surface-raised': '#1A1A1A',
        border: '#222222',
        'border-visible': '#333333',
        
        // Text Colors
        'text-disabled': '#666666',
        'text-secondary': '#999999',
        'text-primary': '#E8E8E8',
        'text-display': '#FFFFFF',
        
        // Accent & Status
        accent: '#D71921',
        'accent-subtle': 'rgba(215,25,33,0.15)',
        success: '#4A9E5C',
        warning: '#D4A843',
        error: '#D71921',
        info: '#999999',
        interactive: '#5B9BF6',
      },
      fontFamily: {
        display: ['Doto', 'Space Mono', 'monospace'],
        body: ['Space Grotesk', 'DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['48px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['18px', { lineHeight: '1.3', letterSpacing: '0' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'label': ['11px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      spacing: {
        '2xs': '2px',
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'pill': '9999px',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'in-out': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'out': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'in': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        'fast': '150ms',
        'slow': '400ms',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #333333 1px, transparent 1px)',
        'dot-grid-subtle': 'radial-gradient(circle, #222222 0.5px, transparent 0.5px)',
      },
      backgroundSize: {
        'dot-grid': '16px 16px',
        'dot-grid-subtle': '12px 12px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' }
        }
      }
    },
  },
  plugins: [],
}