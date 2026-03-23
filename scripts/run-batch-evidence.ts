import { BATCH_EXAMPLES } from "@/lib/config"
import { runBatchEvidence } from "@/lib/analysis/workflow"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const jobs = BATCH_EXAMPLES.map((entry, index) => ({
  projectName: `Batch Job ${index + 1}`,
  mode: "real" as const,
  sourceA: {
    label: entry.sourceA.label,
    kind: entry.sourceA.kind,
    value: entry.sourceA.value
  },
  sourceB: {
    label: entry.sourceB.label,
    kind: entry.sourceB.kind,
    value: entry.sourceB.value
  }
}))

const summary = await runBatchEvidence(jobs)
const evidenceDir = path.join(process.cwd(), ".secrets", "submission", "evidence")
await mkdir(evidenceDir, { recursive: true })

const markdown = `# Olas batch evidence summary\n\n` +
  `action: real mode\n` +
  `total: ${summary.total}\n` +
  `success: ${summary.successCount}\n` +
  `failure: ${summary.failureCount}\n` +
  `createdAt: ${new Date().toISOString()}\n\n` +
  `## records\n\n` +
  summary.records
    .map((row) => `${row.run}. ${row.label} -> ${row.success ? "success" : `failed: ${row.error ?? "error"}`}`)
    .join("\n")

await writeFile(path.join(evidenceDir, "olas-batch-summary.json"), `${JSON.stringify(summary, null, 2)}\n`)
await writeFile(path.join(evidenceDir, "olas-batch-summary.md"), `${markdown}\n`)
console.log(markdown)
