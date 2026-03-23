import { NextRequest, NextResponse } from "next/server"
import { setRuntimeMode, getRuntimeMode } from "@/lib/storage/local"
import { AnalysisMode } from "@/lib/types"
import { canPersistServerState } from "@/lib/security/runtime"

export async function GET() {
  if (!canPersistServerState()) {
    return NextResponse.json({ mode: "demo" })
  }

  const mode = await getRuntimeMode()
  return NextResponse.json({ mode })
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const mode = (payload as { mode?: string })?.mode
  if (mode !== "demo" && mode !== "real") {
    return NextResponse.json({ error: "Mode must be demo or real." }, { status: 400 })
  }

  if (!canPersistServerState()) {
    return NextResponse.json({ mode })
  }

  await setRuntimeMode(mode as AnalysisMode)
  return NextResponse.json({ mode })
}
