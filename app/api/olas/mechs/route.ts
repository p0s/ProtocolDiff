import { NextResponse } from "next/server"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"

export async function GET() {
  const mechs = await new OlasAdapter().listMechs()
  return NextResponse.json({ mechs })
}
