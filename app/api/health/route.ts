import { NextResponse } from "next/server"
import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { getOlasConfig, getRuntimeMode, listAnalyses, listReceipts } from "@/lib/storage/local"

export async function GET() {
  const status = await new OlasAdapter().getStatus()
  const [config, receipts, analyses, runtimeMode] = await Promise.all([
    getOlasConfig(),
    listReceipts(1),
    listAnalyses(1),
    getRuntimeMode()
  ])
  return NextResponse.json({
    service: "ok",
    mode: runtimeMode,
    olas: status,
    config,
    receiptCount: receipts.length,
    analysesCount: analyses.length,
    checks: {
      runtimeStorage: Boolean(config),
      mode: status.configured
    }
  })
}
