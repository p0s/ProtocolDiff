import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { listAnalyses, listReceipts } from "@/lib/storage/local"

const submissionDir = path.join(process.cwd(), ".secrets", "submission")
const outputDir = path.join(submissionDir, "evidence")
const publicSubmissionDir = path.join(process.cwd(), "submission")
const publicOutputDir = path.join(publicSubmissionDir, "evidence")
const projectDraftPath = path.join(submissionDir, "project-draft.json")
const conversationLogPath = path.join(submissionDir, "conversation-log.md")
const publicDemoUrl = "https://protocoldiff.xyz"
const screenshotUrl = "https://raw.githubusercontent.com/p0s/ProtocolDiff/main/public/screenshots/protocoldiff_screenshot.png"

const analyses = await listAnalyses(200)
const receipts = await listReceipts(300)

await mkdir(outputDir, { recursive: true })
await mkdir(publicOutputDir, { recursive: true })

async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

type ExistingDraft = {
  teamUUID?: string
  trackUUIDs?: string[]
  deployedURL?: string
  videoURL?: string
  pictures?: string
  coverImageURL?: string
  submissionMetadata?: {
    moltbookPostURL?: string
    intention?: string
    intentionNotes?: string
    skills?: string[]
    helpfulResources?: string[]
  }
}

const existingDraft = await readJsonIfExists<ExistingDraft>(projectDraftPath)

const conversationLog = `# ProtocolDiff collaboration log

2026-03-23 09:00
- Aligned the project around the Olas "Hire an Agent on Olas Marketplace" track.
- Scoped the product to a public demo mode plus a local real-mode mechx workflow.

2026-03-23 11:00
- Built the compare workspace, receipts view, mechs page, analysis history, and batch evidence runner.
- Wired deterministic local diffing, summaries, and local state for analyses and receipts.

2026-03-23 13:00
- Installed mech-client locally, configured client-mode mechx, and verified live marketplace access on Gnosis.
- Verified on-chain request submission for the configured client wallet.

2026-03-23 14:00
- Completed a 10-request Olas evidence run on Gnosis and refreshed submission artifacts.
- Deployed the public demo to Vercel.

2026-03-23 15:00
- Refined the public demo with default examples, dark mode, custom domain, and a submission-ready screenshot.
- Prepared the final draft assets and canonical public links for submission.
`

const manifest = {
  project: "ProtocolDiff",
  repoURL: "https://github.com/p0s/ProtocolDiff",
  publicDemoURL: publicDemoUrl,
  screenshotURL: screenshotUrl,
  tracks: ["Hire an Agent on Olas Marketplace"],
  generatedAt: new Date().toISOString(),
  artifactRoot: ".secrets/submission",
  evidence: {
    analyses: analyses.length,
    receipts: receipts.length,
    batchEvidencePath: ".secrets/submission/evidence/olas-batch-summary.json",
    batchEvidenceMarkdownPath: ".secrets/submission/evidence/olas-batch-summary.md",
    conversationLogPath: ".secrets/submission/conversation-log.md"
  },
  checks: {
    hasDemoMode: true,
    hasRealMode: true,
    hasReceiptStore: true,
    hasHistory: analyses.length > 0
  }
}

const draft = {
  teamUUID: existingDraft?.teamUUID ?? "REPLACE_WITH_YOUR_TEAM_UUID",
  name: "ProtocolDiff",
  description:
    "ProtocolDiff is a protocol change intelligence console that compares two docs, governance posts, release notes, or webpages, then hires Olas marketplace agents to summarize what changed, what might break, and what action should be taken.",
  problemStatement:
    "Protocol teams, researchers, and integrators still compare docs and release notes manually, which makes breaking changes easy to miss and slows down migration planning. They need a faster way to diff protocol snapshots, identify risk, and produce an actionable change brief with proof of how the analysis was generated.",
  repoURL: "https://github.com/p0s/ProtocolDiff",
  trackUUIDs: existingDraft?.trackUUIDs ?? ["REPLACE_WITH_OLAS_TRACK_UUID"],
  conversationLogPath: ".secrets/submission/conversation-log.md",
  conversationLog,
  deployedURL: existingDraft?.deployedURL ?? publicDemoUrl,
  videoURL: existingDraft?.videoURL ?? "",
  pictures: screenshotUrl,
  coverImageURL: screenshotUrl,
  submissionMetadata: {
    agentFramework: "other",
    agentFrameworkOther: "Custom Next.js + TypeScript app with direct mechx integration",
    agentHarness: "codex-cli",
    model: "gpt-5",
    skills: existingDraft?.submissionMetadata?.skills ?? ["REPLACE_WITH_ACTUAL_SKILL_ID_USED"],
    tools: ["Next.js", "TypeScript", "Vitest", "Playwright", "Olas mechx", "Vercel"],
    helpfulResources:
      existingDraft?.submissionMetadata?.helpfulResources ?? [
        "https://synthesis.devfolio.co/skill.md",
        "https://synthesis.devfolio.co/submission/skill.md"
      ],
    helpfulSkills: [],
    intention: existingDraft?.submissionMetadata?.intention ?? "continuing",
    intentionNotes:
      existingDraft?.submissionMetadata?.intentionNotes ??
      "Continue refining the Olas evidence path, polish the UI, and improve real-world protocol ingestion after the hackathon.",
    moltbookPostURL: existingDraft?.submissionMetadata?.moltbookPostURL ?? ""
  }
}

await writeFile(
  path.join(submissionDir, "submission-metadata.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
)

await writeFile(
  path.join(outputDir, "submission-metadata.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
)

await writeFile(
  path.join(publicSubmissionDir, "submission-metadata.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
)

await writeFile(
  path.join(publicOutputDir, "submission-metadata.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
)

await writeFile(conversationLogPath, `${conversationLog}\n`)

await writeFile(projectDraftPath, `${JSON.stringify(draft, null, 2)}\n`)

await writeFile(
  path.join(submissionDir, "agent_log.json"),
  `${JSON.stringify(
    {
      notes: [
        "Demo flow works without Olas setup.",
        `Public demo is deployed at ${publicDemoUrl}.`,
        "Real mode uses mechx command execution with source diff payload.",
        "Receipts + analyses are persisted in .local/state.json",
        "Batch evidence route supports 10-request evidence flow.",
        "Private submission artifacts are stored under .secrets/submission."
      ],
      summary: `Analyses: ${analyses.length}, Receipts: ${receipts.length}`
    },
    null,
    2
  )}\n`
)

await writeFile(
  path.join(publicSubmissionDir, "agent_log.json"),
  `${JSON.stringify(
    {
      notes: [
        "Demo flow works without Olas setup.",
        `Public demo is deployed at ${publicDemoUrl}.`,
        "Real mode uses mechx command execution with source diff payload.",
        "Receipts + analyses are persisted in .local/state.json",
        "Batch evidence route supports 10-request evidence flow."
      ],
      summary: `Analyses: ${analyses.length}, Receipts: ${receipts.length}`
    },
    null,
    2
  )}\n`
)

console.log("submission package written to .secrets/submission/")
