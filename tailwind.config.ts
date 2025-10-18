import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Pitch Black Theme - Primary Colors */
        primary: {
          DEFAULT: '#7da6ff' /* Bright Blue */,
          dark: '#7da6ff',
          light: '#a8c5ff',
        },
        secondary: {
          DEFAULT: '#da70d6' /* Vibrant Mauve */,
          dark: '#da70d6',
          light: '#e896e0',
        },
        success: {
          DEFAULT: '#51cf66' /* Bright Green */,
          dark: '#51cf66',
          light: '#7fde88',
        },
        warning: {
          DEFAULT: '#ffd700' /* Gold Yellow */,
          dark: '#ffd700',
          light: '#ffdd4d',
        },
        danger: {
          DEFAULT: '#ff6b6b' /* Bright Red */,
          dark: '#ff6b6b',
          light: '#ff9999',
        },
        info: {
          DEFAULT: '#4da6ff' /* Sky Blue */,
          dark: '#4da6ff',
          light: '#7fc3ff',
        },

        /* Pitch Black Theme - Neutral Colors */
        pitchblack: {
          base: '#000000' /* Pure Black */,
          mantle: '#0a0a0a',
          crust: '#050505',
          surface0: '#1a1a1a',
          surface1: '#2a2a2a',
          surface2: '#3a3a3a',
          text: '#ffffff',
          subtext1: '#e0e0e0',
          subtext0: '#b0b0b0',
        },

        /* Catppuccin Colors (retained for compatibility) */
        latte: {
          base: '#eff1f5',
          mantle: '#e6e9ef',
          crust: '#dce0e8',
          text: '#4c4f69',
          subtext1: '#5c5f77',
          subtext0: '#6c6f85',
          surface0: '#ccd0da',
          surface1: '#bcc0cc',
          surface2: '#acb0be',
          rosewater: '#dc8a78',
          flamingo: '#dd7878',
          pink: '#ea76cb',
          mauve: '#8839ef',
          red: '#d20f39',
          maroon: '#e64553',
          peach: '#fe640b',
          yellow: '#df8e1d',
          green: '#40a02b',
          teal: '#179299',
          sky: '#04a5e5',
          sapphire: '#209fb5',
          blue: '#1e66f5',
          lavender: '#7287fd',
        },
        mocha: {
          base: '#1e1e2e',
          mantle: '#181825',
          crust: '#11111b',
          text: '#cdd6f4',
          subtext1: '#bac2de',
          subtext0: '#a6adc8',
          surface0: '#313244',
          surface1: '#45475a',
          surface2: '#585b70',
          rosewater: '#f5e0dc',
          flamingo: '#f2cdcd',
          pink: '#f5c2e7',
          mauve: '#cba6f7',
          red: '#f38ba8',
          maroon: '#eba0ac',
          peach: '#fab387',
          yellow: '#f9e2af',
          green: '#a6e3a1',
          teal: '#94e2d5',
          sky: '#89dceb',
          sapphire: '#74c7ec',
          blue: '#89b4fa',
          lavender: '#b4befe',
        },
      },
      backgroundColor: {
        'pitch-black': '#000000',
        'pitch-dark': '#0a0a0a',
        'pitch-surface': '#1a1a1a',
      },
      textColor: {
        'pitch-white': '#ffffff',
        'pitch-light': '#e0e0e0',
        'pitch-muted': '#b0b0b0',
      },
      borderColor: {
        'pitch-border': '#2a2a2a',
        'pitch-focus': '#7da6ff',
      },
    },
  },
  plugins: [],
} satisfies Config;
