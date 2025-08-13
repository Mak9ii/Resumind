import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';
import netlifyPlugin from '@netlify/vite-plugin-react-router';
import tailwindcss from "@tailwindcss/vite"; 
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
});