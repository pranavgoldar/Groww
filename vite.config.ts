/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps the build portable (any static host / sub-path) — routing uses a hash router.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
