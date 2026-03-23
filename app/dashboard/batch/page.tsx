'use client'

import { useEffect, useState } from "react"
import { BatchEvidenceResult } from "@/lib/types"
import { BATCH_EXAMPLES } from "@/lib/config"

export default function BatchEvidencePage() {
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle")
  const [summary, setSummary] = useState<BatchEvidenceResult | null>(null)
  const [message, setMessage] = useState("")
  const [realConfigured, setRealConfigured] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/olas/status")
      if (response.ok) {
        const payload = await response.json()
        setRealConfigured(payload.configured)
        if (!payload.configured && Array.isArray(payload.missing) && payload.missing.some((item: string) => item.includes("disabled in public deployments"))) {
          setStatusMessage("Public demo deployments intentionally disable local Olas execution. ProtocolDiff already completed the qualifying 10-request Olas run locally on Gnosis.")
        } else if (payload.configured) {
          setStatusMessage("Ready for local real-mode evidence runs.")
        } else {
          setStatusMessage("Real mode still needs local mechx configuration.")
        }
      }
    }
    load()
  }, [])

  const run = async () => {
    setStatus("running")
    setMessage("")
    const response = await fetch("/api/olas/batch-evidence", { method: "POST" })
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Batch request failed." }))
      setMessage(body.error || "Batch request failed.")
      setStatus("done")
      return
    }
    const payload = (await response.json()) as BatchEvidenceResult
    setSummary(payload)
    setStatus("done")
  }

  return (
    <div>
      <section className="card">
        <h1>Batch evidence runner</h1>
        <p>Loads 10 sample jobs and runs them sequentially in real Olas mode to generate submission evidence.</p>
      </section>

      <section className="card">
        <h2>Real mode check</h2>
        <p>{statusMessage}</p>
        <ul>
          <li>Qualifying sponsor run completed: 10 successful requests</li>
          <li>Chain used: Gnosis</li>
          <li>Prize target: Hire an Agent on Olas Marketplace</li>
        </ul>
      </section>

      <section className="card">
        <h2>Examples</h2>
        <p>Total jobs: {BATCH_EXAMPLES.length}</p>
        <ol>
          {BATCH_EXAMPLES.map((entry, index) => (
            <li key={`${entry.sourceA.label}-${index}`}>
              {entry.sourceA.label} → {entry.sourceB.label}
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Run evidence</h2>
        <button className="warn" disabled={status === "running" || !realConfigured} onClick={run}>
          {status === "running" ? "Running 10 requests..." : "Run 10 real requests"}
        </button>
        {message ? <p>{message}</p> : null}
      </section>

      {summary ? (
        <section className="card">
          <h2>Summary</h2>
          <p>Total: {summary.total}</p>
          <p>Success: {summary.successCount}</p>
          <p>Failed: {summary.failureCount}</p>
          <ul>
            {summary.records.map((entry) => (
              <li key={entry.run}>
                {entry.run}. {entry.label} — {entry.success ? "success" : `failed (${entry.error})`}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
