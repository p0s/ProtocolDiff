import { chromium } from "playwright"
import path from "node:path"
import { mkdir } from "node:fs/promises"

const baseUrl = "http://127.0.0.1:3000"
const targets: Array<{ path: string; route: string }> = [
  { path: "home.png", route: "/" },
  { path: "compare.png", route: "/dashboard" },
  { path: "analyses.png", route: "/dashboard/analyses" },
  { path: "receipts.png", route: "/dashboard/receipts" },
  { path: "mechs.png", route: "/dashboard/mechs" },
  { path: "batch.png", route: "/dashboard/batch" }
]

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })
const outDir = path.join(process.cwd(), "public", "screenshots")
await mkdir(outDir, { recursive: true })

for (const target of targets) {
  await page.goto(`${baseUrl}${target.route}`, { waitUntil: "networkidle" })
  await page.screenshot({
    path: path.join(outDir, target.path),
    fullPage: true
  })
}

await browser.close()
console.log(`Screenshots saved to ${outDir}`)
