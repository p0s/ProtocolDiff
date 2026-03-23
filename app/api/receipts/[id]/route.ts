import { NextRequest, NextResponse } from "next/server"
import { getReceipt } from "@/lib/storage/local"
import { canPersistServerState } from "@/lib/security/runtime"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!canPersistServerState()) {
    return NextResponse.json({ error: "Receipts are disabled in public deployments." }, { status: 404 })
  }

  const receipt = await getReceipt(params.id)
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 })
  }
  return NextResponse.json(receipt)
}
