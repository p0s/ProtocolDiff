import { NextResponse } from "next/server"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { canUseLocalOlas } from "@/lib/security/runtime"

export async function GET() {
  if (!canUseLocalOlas()) {
    return NextResponse.json({
      configured: false,
      mechxInstalled: false,
      privateKeyConfigured: false,
      chainConfig: "gnosis",
      missing: ["Local Olas operations are disabled in public deployments."]
    })
  }

  const status = await new OlasAdapter().getStatus()
  return NextResponse.json(status)
}
