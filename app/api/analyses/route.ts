import { NextRequest, NextResponse } from "next/server"
import { listAnalyses } from "@/lib/storage/local"
import { canPersistServerState } from "@/lib/security/runtime"

export async function GET(request: NextRequest) {
  if (!canPersistServerState()) {
    return NextResponse.json([])
  }

  const query = new URL(request.url)
  const limit = Number(query.searchParams.get("limit") || 50)
  const list = await listAnalyses(Number.isFinite(limit) ? limit : 50)
  return NextResponse.json(list)
}
