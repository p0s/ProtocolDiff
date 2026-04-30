import { NextRequest, NextResponse } from "next/server"
import { getAnalysis } from "@/lib/storage/local"
import { canPersistServerState } from "@/lib/security/runtime"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!canPersistServerState()) {
    return NextResponse.json({ error: "Analysis history is disabled in public deployments." }, { status: 404 })
  }

  const { id } = await params
  const analysis = await getAnalysis(id)
  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 })
  }
  return NextResponse.json(analysis)
}
