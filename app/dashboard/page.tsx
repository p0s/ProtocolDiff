"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ResultPanel from "@/components/ResultPanel"
import { EXAMPLES } from "@/lib/config"
import type { AnalysisMode, AnalysisRecord, Receipt } from "@/lib/types"

type SourceKind = "url" | "text"

type OlasStatus = {
  configured: boolean
  mechxInstalled: boolean
  privateKeyConfigured: boolean
  chainConfig?: string
  missing: string[]
}

type OlasConfig = {
  chainConfig: string
  mechAddress: string
  toolName: string
  useOffchain: boolean
}

export default function DashboardPage() {
  const [projectName, setProjectName] = useState("ProtocolDiff Analysis")
  const [sourceLabelA, setSourceLabelA] = useState("Source A")
  const [sourceLabelB, setSourceLabelB] = useState("Source B")
  const [sourceTypeA, setSourceTypeA] = useState<SourceKind>("text")
  const [sourceTypeB, setSourceTypeB] = useState<SourceKind>("text")
  const [sourceValueA, setSourceValueA] = useState("")
  const [sourceValueB, setSourceValueB] = useState("")
  const [runtimeMode, setRuntimeMode] = useState<AnalysisMode>("demo")
  const [status, setStatus] = useState<OlasStatus | null>(null)
  const [config, setConfig] = useState<OlasConfig>({
    chainConfig: "gnosis",
    mechAddress: "",
    toolName: "",
    useOffchain: true
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisRecord | undefined>()
  const [receipt, setReceipt] = useState<Receipt | undefined>()

  useEffect(() => {
    const load = async () => {
      const [modeResponse, statusResponse, configResponse] = await Promise.all([
        fetch("/api/mode"),
        fetch("/api/olas/status"),
        fetch("/api/olas/config")
      ])

      if (modeResponse.ok) {
        const payload = await modeResponse.json()
        setRuntimeMode(payload.mode || "demo")
      }

      if (statusResponse.ok) {
        const payload = await statusResponse.json()
        setStatus(payload)
      }

      if (configResponse.ok) {
        const payload = await configResponse.json()
        setConfig(payload.config)
      }
    }

    load()
  }, [])

  const fillExample = (index: number) => {
    const example = EXAMPLES[index]
    setSourceLabelA(example.labelA)
    setSourceLabelB(example.labelB)
    setSourceTypeA(example.sourceTypeA)
    setSourceTypeB(example.sourceTypeB)
    setSourceValueA(example.textA || "")
    setSourceValueB(example.textB || "")
  }

  const execute = async (mode: AnalysisMode) => {
    if (mode === "real" && status && !status.configured) {
      setErrorMessage(`Real mode unavailable: ${status.missing.join(", ")}`)
      return
    }

    setLoading(true)
    setErrorMessage("")

    const payload = {
      projectName,
      sourceA: {
        label: sourceLabelA,
        kind: sourceTypeA,
        value: sourceValueA
      },
      sourceB: {
        label: sourceLabelB,
        kind: sourceTypeB,
        value: sourceValueB
      },
      mode,
      chainConfig: config.chainConfig,
      preferredMech: config.mechAddress || undefined,
      preferredTool: config.toolName || undefined,
      useOffchain: config.useOffchain
    }

    await fetch("/api/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    })

    const response = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    setLoading(false)

    if (!response.ok) {
      const parsed = await response.json().catch(() => ({ error: "Analysis failed." }))
      setErrorMessage(parsed.error || "Analysis failed.")
      return
    }

    const result = (await response.json()) as { analysis: AnalysisRecord; receipt: Receipt }
    setRuntimeMode(mode)
    setAnalysis(result.analysis)
    setReceipt(result.receipt)
    setErrorMessage("")
  }

  return (
    <div>
      <section className="card">
        <h1>Compare workspace</h1>
        <p>
          Paste two protocol snapshots, run a deterministic local diff, and then optionally send the
          structured diff to Olas.
        </p>
        <div className="row">
          <Link href="/dashboard/mechs"><button type="button" className="secondary">Mech setup</button></Link>
          <Link href="/dashboard/receipts"><button type="button" className="secondary">Receipts</button></Link>
        </div>
      </section>

      <section className="card">
        <h2>Seeded examples</h2>
        <div className="row">
          {EXAMPLES.map((_, index) => (
            <button type="button" key={EXAMPLES[index].labelA + index} onClick={() => fillExample(index)}>
              Example {index + 1}
            </button>
          ))}
        </div>
      </section>

      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault()
          void execute("demo")
        }}
      >
        <h2>Inputs</h2>
        <label>
          Project label
          <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
        </label>

        <div className="grid">
          <div className="form-grid">
            <label>
              Source A label
              <input value={sourceLabelA} onChange={(event) => setSourceLabelA(event.target.value)} />
            </label>
            <label>
              Source A type
              <select value={sourceTypeA} onChange={(event) => setSourceTypeA(event.target.value as SourceKind)}>
                <option value="text">Text</option>
                <option value="url">URL</option>
              </select>
            </label>
            <label>
              Source A
              <textarea
                rows={10}
                value={sourceValueA}
                onChange={(event) => setSourceValueA(event.target.value)}
                placeholder="Paste text or place a URL."
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Source B label
              <input value={sourceLabelB} onChange={(event) => setSourceLabelB(event.target.value)} />
            </label>
            <label>
              Source B type
              <select value={sourceTypeB} onChange={(event) => setSourceTypeB(event.target.value as SourceKind)}>
                <option value="text">Text</option>
                <option value="url">URL</option>
              </select>
            </label>
            <label>
              Source B
              <textarea
                rows={10}
                value={sourceValueB}
                onChange={(event) => setSourceValueB(event.target.value)}
                placeholder="Paste text or place a URL."
              />
            </label>
          </div>
        </div>

        <div className="row">
          <button
            type="submit"
            disabled={loading || sourceValueA.trim().length < 3 || sourceValueB.trim().length < 3}
          >
            Analyze with demo mode
          </button>
          <button
            type="button"
            className="warn"
            disabled={loading}
            onClick={() => {
              void execute("real")
            }}
          >
            Analyze with Olas
          </button>
        </div>
        {loading ? <p>Running...</p> : null}
      </form>

      <section className="card">
        <h2>Runtime status</h2>
        <div className="row">
          <span className="badge">Mode: {runtimeMode}</span>
          <span className="badge">Configured chain: {config.chainConfig}</span>
          <span className="badge">Mechx installed: {status?.mechxInstalled ? "yes" : "no"}</span>
          <span className="badge">Private key: {status?.privateKeyConfigured ? "yes" : "no"}</span>
        </div>
        {status?.missing.length ? <p>Missing in real mode: {status.missing.join(", ")}</p> : null}
      </section>

      {errorMessage ? <p style={{ color: "#b91c1c" }}>{errorMessage}</p> : null}

      {analysis ? <ResultPanel analysis={analysis} receipt={receipt} /> : null}
    </div>
  )
}
