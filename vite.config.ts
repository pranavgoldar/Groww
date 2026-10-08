/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` keeps the build portable (Vercel, any static host or sub-path).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
