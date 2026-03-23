import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { listAnalyses, listReceipts } from "@/lib/storage/local"

const submissionDir = path.join(process.cwd(), ".secrets", "submission")
const outputDir = path.join(submissionDir, "evidence")
const publicSubmissionDir = path.join(process.cwd(), "submission")
const publicOutputDir = path.join(publicSubmissionDir, "evidence")
const projectDraftPath = path.join(submissionDir, "project-draft.json")
const conversationLogPath = path.join(submissionDir, "conversation-log.md")

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

Human requested a hackathon-ready project focused on the strongest Olas submission path.
The build was scoped to a crisp demo first, with a real local Olas path behind \`mechx\`.
The resulting product compares two protocol snapshots, generates a deterministic local brief, and can escalate to a real Olas marketplace request with stored receipts.

Key implementation decisions:
- Built the app as a Next.js + TypeScript console with a hard cut between demo mode and real mode.
- Kept Olas integration local and explicit by calling \`mechx\` from backend routes instead of building a custom mech backend.
- Made receipts, saved analyses, mech diagnostics, and batch evidence first-class so sponsor judging has visible proof artifacts.
- Added a 10-request batch evidence flow for Olas sponsor validation.

Evidence snapshot at generation time:
- analyses stored locally: ${analyses.length}
- receipts stored locally: ${receipts.length}
- batch evidence path: .secrets/submission/evidence/olas-batch-summary.json
`

const manifest = {
  project: "ProtocolDiff",
  repoURL: "https://github.com/p0s/ProtocolDiff",
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
  deployedURL: existingDraft?.deployedURL ?? "",
  videoURL: existingDraft?.videoURL ?? "",
  pictures: existingDraft?.pictures ?? "",
  coverImageURL: existingDraft?.coverImageURL ?? "",
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
