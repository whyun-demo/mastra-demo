import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: '.env.test' })
const exclude = ['**/.mastra/**', '**/dist/**', '**/node_modules/**']
export default defineConfig({
  test: {
    environment: 'node',
    silent: false,
    reporters: ['default', 'junit', 'verbose'],
    setupFiles: ['./test/log.ts'],
    outputFile: {
      junit: './coverage/junit.xml',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'cobertura'],
      include: ['src/**/*.{ts}'],
      exclude,
    },
    globals: true,
    root: './',
    exclude,
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      // module: { type: 'es6' },
      exclude,
    }),
  ],
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      src: resolve(__dirname, './src'),
    },
  },
})
