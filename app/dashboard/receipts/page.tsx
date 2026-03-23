'use client'

import { useEffect, useMemo, useState } from "react"
import { Receipt } from "@/lib/types"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/receipts")
      if (!response.ok) return
      const payload = (await response.json()) as Receipt[]
      setReceipts(payload)
    }
    load()
  }, [])

  const grouped = useMemo(() => receipts.filter((entry) => Boolean(entry.id)), [receipts])

  const exportReceipt = (entry: Receipt) => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = href
    anchor.download = `${entry.id}.json`
    anchor.click()
    URL.revokeObjectURL(href)
  }

  return (
    <div>
      <section className="card">
        <h1>Receipts</h1>
        <p>
          Every real or demo analysis writes a raw execution receipt, including request metadata and captured output.
        </p>
      </section>

      <section className="card">
        <h2>Stored receipts</h2>
        {grouped.length === 0 ? (
          <p>No receipts yet.</p>
        ) : (
          <ul>
            {grouped.map((entry) => (
              <li className="card" key={entry.id}>
                <div className="row">
                  <span className="badge">{entry.mode}</span>
                  <span className="badge">{entry.success ? "success" : "failed"}</span>
                  <span className="badge">Action: {entry.action}</span>
                </div>
                <p>{entry.createdAt}</p>
                <p>Command: {entry.sanitizedCommandPreview}</p>
                <pre>{entry.stdout ? entry.stdout.slice(0, 700) : "[No stdout]"}</pre>
                <button onClick={() => exportReceipt(entry)}>Export JSON</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
