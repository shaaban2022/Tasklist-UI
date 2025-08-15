import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ensure Vite server binds to all network interfaces
    port: process.env.PORT || 5173, // Use Render's PORT or fallback for local dev
    hmr: {
      host: '0.0.0.0', // Essential for Hot Module Replacement to work on Render
      port: process.env.PORT || 5173,
      clientPort: process.env.PORT || 5173, // Sometimes needed for client-side HMR connections
    },
  },
  preview: { // This section is used by 'npm run preview' command on Render
    host: '0.0.0.0', // Bind to all network interfaces for preview
    port: process.env.PORT || 4173, // Use Render's PORT or fallback
    strictPort: true, // Ensure the specified port is used
    allowedHosts: [ // Crucial: Add your deployed frontend URL here
      'tasklist-frontend-p2pl.onrender.com',
      // Add any other domains your frontend might be accessed from in production
    ],
  },
  build: {
    outDir: 'dist', // Default build output directory for Vite
  }
})
