import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to match your GitHub Pages repo name
// e.g., if your repo is https://github.com/username/wedding
// then base should be '/wedding/'
const base = process.env.GITHUB_PAGES === 'true' ? '/wedding/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
        },
      },
    },
  },
})
