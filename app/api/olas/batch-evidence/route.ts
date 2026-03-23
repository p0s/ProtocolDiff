import { NextResponse } from "next/server"
import { BATCH_EXAMPLES } from "@/lib/config"
import { runBatchEvidence } from "@/lib/analysis/workflow"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { canUseLocalOlas } from "@/lib/security/runtime"

export async function POST() {
  if (!canUseLocalOlas()) {
    return NextResponse.json({ error: "Batch evidence is disabled in public deployments." }, { status: 403 })
  }

  const status = await new OlasAdapter().getStatus()
  if (!status.configured) {
    return NextResponse.json({ error: "Real mode is not configured.", missing: status.missing }, { status: 409 })
  }

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
  return NextResponse.json(summary)
}
