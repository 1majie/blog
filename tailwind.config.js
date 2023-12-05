/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  plugins: [require("daisyui")],
  theme: {
    extend: {
      fontFamily: {
        // 中文使用 'Noto Sans SC'，英文使用 'Roboto'
        'sans': ['Noto Sans SC', 'Roboto', 'sans-serif'],
        'serif': ['Noto Serif SC', 'serif'],
        'mono': ['Inconsolata', 'monospace'],
      }
    }
  },
};
