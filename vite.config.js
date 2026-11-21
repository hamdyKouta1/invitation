import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Parameterized Base Path (ARC-003, CFG-009, ISO-003):
// Each customer repository can define VITE_BASE_PATH (e.g. '/invite-customer-a/' or '/' for custom domain).
// Falls back to '/invitation/' in production for backward compatibility with the default repo.
const base =
  process.env.VITE_BASE_PATH ||
  (process.env.NODE_ENV === 'production' || process.env.GITHUB_PAGES === 'true' ? '/invitation/' : '/')

// Build-time Open Graph & SEO meta tag replacement per customer repository (CFG-001)
const customerMetaHtmlPlugin = () => ({
  name: 'customer-meta-html-transform',
  transformIndexHtml(html) {
    let out = html
    if (process.env.VITE_OG_TITLE) {
      const safeTitle = process.env.VITE_OG_TITLE.replace(/"/g, '&quot;')
      out = out.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`)
      out = out.replace(/(property="og:title" content=").*?(")/, `$1${safeTitle}$2`)
      out = out.replace(/(name="twitter:title" content=").*?(")/, `$1${safeTitle}$2`)
    }
    if (process.env.VITE_OG_DESCRIPTION) {
      const safeDesc = process.env.VITE_OG_DESCRIPTION.replace(/"/g, '&quot;')
      out = out.replace(/(name="description" content=").*?(")/, `$1${safeDesc}$2`)
      out = out.replace(/(property="og:description" content=").*?(")/, `$1${safeDesc}$2`)
      out = out.replace(/(name="twitter:description" content=").*?(")/, `$1${safeDesc}$2`)
    }
    if (process.env.VITE_SITE_URL) {
      const safeUrl = process.env.VITE_SITE_URL.replace(/"/g, '&quot;')
      out = out.replace(/(property="og:url" content=").*?(")/, `$1${safeUrl}$2`)
    }
    if (process.env.VITE_OG_IMAGE) {
      const safeImg = process.env.VITE_OG_IMAGE.replace(/"/g, '&quot;')
      out = out.replace(/(property="og:image" content=").*?(")/, `$1${safeImg}$2`)
      out = out.replace(/(name="twitter:image" content=").*?(")/, `$1${safeImg}$2`)
    }
    return out
  },
})

export default defineConfig({
  plugins: [react(), customerMetaHtmlPlugin()],
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
