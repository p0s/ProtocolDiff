import { NextRequest, NextResponse } from "next/server"
import { getAnalysis } from "@/lib/storage/local"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const analysis = await getAnalysis(params.id)
  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 })
  }
  return NextResponse.json(analysis)
}
