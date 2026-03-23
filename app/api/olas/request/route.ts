import { NextRequest, NextResponse } from "next/server"
import { compareRequestSchema } from "@/lib/validation/compare"
import { runAnalysis } from "@/lib/analysis/workflow"
import { canUseLocalOlas } from "@/lib/security/runtime"

export async function POST(request: NextRequest) {
  if (!canUseLocalOlas()) {
    return NextResponse.json({ error: "Real Olas mode is disabled in public deployments." }, { status: 403 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }
  try {
    const objectPayload = typeof raw === "object" && raw !== null ? raw : {}
    const payload = compareRequestSchema.parse({ ...objectPayload, mode: "real" })
    const result = await runAnalysis(payload)
    return NextResponse.json(result)
  } catch (error: unknown) {
    return NextResponse.json({ error: "Validation failed.", details: `${error}` }, { status: 400 })
  }
}
