'use client'

import { FormEvent, useEffect, useState } from "react"

type OlasConfig = {
  chainConfig: string
  mechAddress: string
  toolName: string
  useOffchain: boolean
}

type OlasStatus = {
  configured: boolean
  mechxInstalled: boolean
  privateKeyConfigured: boolean
  chainConfig?: string
  missing: string[]
}

type MechSummary = {
  address: string
  name: string
  tools: string[]
}

export default function MechsPage() {
  const [status, setStatus] = useState<OlasStatus | null>(null)
  const [mechs, setMechs] = useState<MechSummary[]>([])
  const [loadingMechs, setLoadingMechs] = useState(false)
  const [config, setConfig] = useState<OlasConfig>({
    chainConfig: "gnosis",
    mechAddress: "",
    toolName: "",
    useOffchain: true
  })
  const [message, setMessage] = useState("")
  const publicDemoMode = status?.missing.some((item) => item.includes("disabled in public deployments")) ?? false

  useEffect(() => {
    const load = async () => {
      const [statusResponse, configResponse] = await Promise.all([
        fetch("/api/olas/status"),
        fetch("/api/olas/config")
      ])
      if (statusResponse.ok) setStatus(await statusResponse.json())
      if (configResponse.ok) {
        const payload = await configResponse.json()
        setConfig(payload.config)
      }
    }

    load()
  }, [])

  const listMechs = async () => {
    setLoadingMechs(true)
    setMessage("")
    const response = await fetch("/api/olas/mechs")
    if (!response.ok) {
      setMessage("Unable to list mechs. Verify mechx is installed and configured.")
      setLoadingMechs(false)
      return
    }

    const payload = await response.json()
    setMechs(payload.mechs || [])
    setLoadingMechs(false)
  }

  const saveConfig = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await fetch("/api/olas/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    })
    if (response.ok) {
      setMessage("Configuration saved.")
      setTimeout(() => setMessage(""), 2500)
    } else {
      const body = await response.json().catch(() => ({ error: "Unable to save config." }))
      setMessage(body.error || "Unable to save config.")
    }
  }

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setMessage("Command copied.")
    setTimeout(() => setMessage(""), 2000)
  }

  return (
    <div>
      <section className="card">
        <h1>Mechs & Olas setup</h1>
        <p>
          Store your preferred mech and tool to keep the demo simple and reproducible.
          Real analysis reads these values automatically.
        </p>
      </section>

      <section className="card">
        <h2>Current status</h2>
        <div className="row">
          <span className="badge">mechx installed: {status?.mechxInstalled ? "yes" : "no"}</span>
          <span className="badge">private key: {status?.privateKeyConfigured ? "yes" : "no"}</span>
          <span className="badge">chain: {status?.chainConfig || config.chainConfig}</span>
        </div>
        {publicDemoMode ? (
          <p>
            Public demo deployments intentionally disable local Olas controls. The real client-mode mechx flow was
            verified locally on Gnosis and used for the 10-request sponsor evidence run.
          </p>
        ) : status?.missing.length ? (
          <p>{status.missing.join(", ")}</p>
        ) : null}
      </section>

      <section className="card">
        <h2>Olas proof snapshot</h2>
        <p>
          ProtocolDiff targets the Olas “Hire an Agent on Olas Marketplace” prize and has already completed the
          qualifying 10-request run on Gnosis.
        </p>
        <ul>
          <li>Track UUID: <code>7d6e542ff0674030925fbc2c7ef96210</code></li>
          <li>Completed local evidence run: 10 successful requests</li>
          <li>Sample request txs: <code>0x414f0d62de8d073e80026204803191c4967381b0586091e14ff0c87bdf4a5e56</code></li>
          <li>Sample request txs: <code>0x169f6b7da0be94e8e4fd775334a72b43d6e9e7a26ba1ad51e5d62d6f4df2c415</code></li>
          <li>Sample request txs: <code>0xb1cd9c681ca89e9ef33a32a487dcff868f4fc581ee1de277d9b6161bb1c581cd</code></li>
        </ul>
      </section>

      <form className="card" onSubmit={saveConfig}>
        <h2>Saved preferences</h2>
        <label>
          Chain config
          <input
            value={config.chainConfig}
            onChange={(event) => setConfig({ ...config, chainConfig: event.target.value })}
          />
        </label>
        <label>
          Preferred mech address
          <input
            value={config.mechAddress}
            onChange={(event) => setConfig({ ...config, mechAddress: event.target.value })}
          />
        </label>
        <label>
          Preferred tool name
          <input
            value={config.toolName}
            onChange={(event) => setConfig({ ...config, toolName: event.target.value })}
          />
        </label>
        <label>
          Use offchain mode
          <select
            value={config.useOffchain ? "true" : "false"}
            onChange={(event) => setConfig({ ...config, useOffchain: event.target.value === "true" })}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>
        <button type="submit">Save config</button>
      </form>

      <section className="card">
        <h2>Mech setup commands</h2>
        <p>Copy these directly in terminal for manual validation.</p>
        <div className="row">
          <button
            type="button"
            onClick={() => {
              void copyCommand(`mechx mech list --chain-config ${config.chainConfig}`)
            }}
          >
            Copy: list mechs
          </button>
          <button
            type="button"
            onClick={() => {
              void copyCommand(`mechx request --prompts "..." --chain-config ${config.chainConfig} --use-offchain`)
            }}
          >
            Copy: real request shell
          </button>
          <button
            type="button"
            onClick={() => {
              void listMechs()
            }}
            disabled={loadingMechs}
          >
            {loadingMechs ? "Loading mechs..." : "Load mechs"}
          </button>
        </div>
        {mechs.length ? (
          <ul>
            {mechs.map((entry) => (
              <li key={entry.address}>
                <strong>{entry.name}</strong>
                <p>{entry.address}</p>
                <p>Tools: {entry.tools.length ? entry.tools.join(", ") : "unknown"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Run list mechs to view available marketplace agents.</p>
        )}
      </section>

      {message ? <p>{message}</p> : null}
    </div>
  )
}
