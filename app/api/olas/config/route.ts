import { NextRequest, NextResponse } from "next/server"
import { configSchema } from "@/lib/validation/compare"
import { getOlasConfig, setOlasConfig } from "@/lib/storage/local"

export async function GET() {
  const config = await getOlasConfig()
  return NextResponse.json({ config })
}

export async function POST(request: NextRequest) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  try {
    const parsed = configSchema.parse(raw)
    await setOlasConfig(parsed)
    return NextResponse.json({ config: parsed })
  } catch (error: unknown) {
    return NextResponse.json({ error: "Invalid config payload.", details: `${error}` }, { status: 400 })
  }
}
