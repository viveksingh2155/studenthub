/* ============================================
   Student Hub — Tailwind Config (White & Green Theme)
   js/config.js  (must load BEFORE tailwind CDN)
   ============================================ */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        /* Remapping "slate" to green-tinted neutrals for light mode */
        slate: {
          950: '#f0fdf4',  /* green-50 — body bg */
          900: '#ffffff',  /* pure white — card bg */
          850: '#f9fafb',  /* gray-50 — subtle off-white */
          800: '#e8f5e9',  /* very light green — borders */
          700: '#bbf7d0',  /* green-200 — muted borders */
          600: '#6b7280',  /* gray-500 — secondary text */
          500: '#9ca3af',  /* gray-400 — placeholder text */
          400: '#374151',  /* gray-700 — body text */
          300: '#111827',  /* gray-900 — headings */
          200: '#1f2937',  /* gray-800 — strong text */
          100: '#d1fae5',  /* emerald-100 */
        }
      },
      boxShadow: {
        'glow-green':   '0 0 20px -2px rgba(22, 163, 74, 0.35)',
        'glow-blue':    '0 0 20px -2px rgba(59, 130, 246, 0.35)',
        'glow-emerald': '0 0 20px -2px rgba(16, 185, 129, 0.35)',
        'glow-rose':    '0 0 20px -2px rgba(244, 63, 94, 0.35)',
        'glow-purple':  '0 0 20px -2px rgba(168, 85, 247, 0.35)',
        'glow-amber':   '0 0 20px -2px rgba(245, 158, 11, 0.35)',
      }
    }
  }
};
