import { NextRequest, NextResponse } from "next/server"
import { compareRequestSchema } from "@/lib/validation/compare"
import { runAnalysis } from "@/lib/analysis/workflow"

export async function POST(request: NextRequest) {
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
