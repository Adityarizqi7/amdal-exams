import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    outDir: 'public',
  },
  content: [
        './index.html', './src/**/*.{js,ts,jsx,tsx}',
        "./node_modules/flowbite-react/**/*.js",
        "./node_modules/flowbite/**/*.js", 
        // './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {    
        extend: {
            colors: {
                'green-base': '#005952',
                'second-base': '#147def',
                'error-color': '#B8351C',
                'indigo-low': '#f1f1ff',
                'dark-theme': '#1E1E2C',
            },
            screens: {
                '8xs': { max: '145px' },
                '7xs': { max: '195px' },
                '6xs': { max: '240px' },
                '5xs': { max: '320px' },
                '4xs': { max: '375px' },
                '3xs': { max: '411px' },
                '2xs': { max: '480px' },
                xs: { max: '540px' },
                xxs: { max: '639px' },
            },
            aspectRatio: {
                '3/2': '3 / 2',
                '9/16': '9 / 16'
            },
        },
    },
})