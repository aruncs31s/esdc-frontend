import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic color tokens - use these in your components
        primary: {
          DEFAULT: '#1e66f5', // latte blue
          dark: '#89b4fa', // mocha blue
        },
        secondary: {
          DEFAULT: '#8839ef', // latte mauve
          dark: '#cba6f7', // mocha mauve
        },
        success: {
          DEFAULT: '#40a02b', // latte green
          dark: '#a6e3a1', // mocha green
        },
        warning: {
          DEFAULT: '#df8e1d', // latte yellow
          dark: '#f9e2af', // mocha yellow
        },
        danger: {
          DEFAULT: '#d20f39', // latte red
          dark: '#f38ba8', // mocha red
        },
        info: {
          DEFAULT: '#04a5e5', // latte sky
          dark: '#89dceb', // mocha sky
        },

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
    },
  },
  plugins: [],
} satisfies Config;
