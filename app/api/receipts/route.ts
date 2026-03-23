import { NextRequest, NextResponse } from "next/server"
import { listReceipts } from "@/lib/storage/local"

export async function GET(request: NextRequest) {
  const query = new URL(request.url)
  const limit = Number(query.searchParams.get("limit") || 80)
  const list = await listReceipts(Number.isFinite(limit) ? limit : 80)
  return NextResponse.json(list)
}
