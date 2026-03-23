import { NextRequest, NextResponse } from "next/server"
import { getReceipt } from "@/lib/storage/local"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const receipt = await getReceipt(params.id)
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 })
  }
  return NextResponse.json(receipt)
}
