import { test, expect } from '@playwright/test'

test('landing and readme flow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'ProtocolDiff' })).toBeVisible()
  await page.getByRole('link', { name: 'Read setup guide' }).click()
  await expect(page.getByRole('heading', { name: 'README' })).toBeVisible()
})

test('demo comparison flow', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.getByRole('textbox', { name: 'Project label' })).toHaveValue('ProtocolDiff: API upgrade review')
  await page.getByRole('button', { name: 'Analyze with demo mode' }).click()

  await expect(page.getByText('Analysis result')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('Diff summary')).toBeVisible()
})

test('history, receipts, mechs, and batch pages render', async ({ page }) => {
  await page.goto('/dashboard/analyses')
  await expect(page.getByRole('heading', { name: 'Analysis history' })).toBeVisible()

  await page.goto('/dashboard/receipts')
  await expect(page.getByRole('heading', { name: 'Receipts' })).toBeVisible()

  await page.goto('/dashboard/mechs')
  await expect(page.getByRole('heading', { name: /Mechs & Olas setup/i })).toBeVisible()

  await page.goto('/dashboard/batch')
  await expect(page.getByRole('heading', { name: /Batch evidence runner/i })).toBeVisible()
})
