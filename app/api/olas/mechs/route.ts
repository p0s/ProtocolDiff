import { NextResponse } from "next/server"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { canUseLocalOlas } from "@/lib/security/runtime"

export async function GET() {
  if (!canUseLocalOlas()) {
    return NextResponse.json({ mechs: [] })
  }

  const mechs = await new OlasAdapter().listMechs()
  return NextResponse.json({ mechs })
}
