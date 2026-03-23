import { NextResponse } from "next/server"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"

export async function GET() {
  const status = await new OlasAdapter().getStatus()
  return NextResponse.json(status)
}
