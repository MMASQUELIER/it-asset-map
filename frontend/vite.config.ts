import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration used to build and serve the React frontend.
 */
const viteConfig = defineConfig({
  plugins: [react()],
})

export default viteConfig
