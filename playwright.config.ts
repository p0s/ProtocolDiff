import { defineConfig } from '@playwright/test'

const executablePath =
  process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
  '/Users/p/Library/Caches/ms-playwright/chromium_headless_shell-1187/chrome-mac/headless_shell'

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    launchOptions: {
      executablePath
    }
  }
})
