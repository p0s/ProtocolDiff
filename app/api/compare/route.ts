import { NextRequest, NextResponse } from "next/server"
import { compareRequestSchema } from "@/lib/validation/compare"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { runAnalysis } from "@/lib/analysis/workflow"
import { z } from "zod"

export async function POST(request: NextRequest) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  let parsed: z.infer<typeof compareRequestSchema>
  try {
    parsed = compareRequestSchema.parse(raw)
  } catch (error: unknown) {
    return NextResponse.json({ error: "Validation failed.", issues: `${error}` }, { status: 400 })
  }

  if (parsed.mode === "real") {
    const status = await new OlasAdapter().getStatus()
    if (!status.configured) {
      return NextResponse.json(
        {
          error: "Real mode is not configured.",
          missing: status.missing
        },
        { status: 409 }
      )
    }
  }

  const result = await runAnalysis(parsed)
  return NextResponse.json(result)
}
