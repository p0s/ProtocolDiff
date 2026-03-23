import { test, expect } from '@playwright/test'

test('demo comparison flow', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Compare' }).first().click()

  await page.getByRole('textbox', { name: 'Project label' }).fill('Demo ProtocolDiff')
  await page.getByRole('textbox', { name: 'Source A label' }).fill('A')
  await page.getByRole('textbox', { name: 'Source A' }).fill('A has x and y')
  await page.getByRole('textbox', { name: 'Source B label' }).fill('B')
  await page.getByRole('textbox', { name: 'Source B' }).fill('B has x and z')
  await page.getByRole('button', { name: 'Analyze with demo mode' }).click()

  await expect(page.getByText('Analysis result')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('Diff summary')).toBeVisible()
})
