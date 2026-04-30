import { defineConfig } from '@playwright/test'

const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    launchOptions: executablePath ? { executablePath } : {}
  }
})
