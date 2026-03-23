'use client'

import { useMemo } from 'react'
import { AnalysisRecord, Receipt } from '@/lib/types'

export default function ResultPanel({ analysis, receipt }: { analysis?: AnalysisRecord; receipt?: Receipt }) {
  const riskClass = useMemo(() => {
    const score = analysis?.result.riskScore ?? 1
    if (score <= 2) return 'low'
    if (score <= 4) return 'medium'
    return 'high'
  }, [analysis?.result.riskScore])

  if (!analysis) return null

  return (
    <div className="card">
      <h2>Analysis result</h2>
      <div>
        <span className={`badge ${riskClass}`}>Risk {analysis.result.riskScore}/5</span>
        <span className="badge">Mode: {analysis.mode}</span>
        <span className="badge">Created: {new Date(analysis.createdAt).toLocaleString()}</span>
      </div>
      <h3>Diff summary</h3>
      <pre>{analysis.diffSummary}</pre>
      <h3>Source snapshots</h3>
      <section>
        <strong>{analysis.sourceLabelA}</strong>
        <pre>{analysis.sourceSnapshotA}</pre>
        <strong>{analysis.sourceLabelB}</strong>
        <pre>{analysis.sourceSnapshotB}</pre>
      </section>
      <h3>Executive summary</h3>
      <p>{analysis.result.summary}</p>
      <h3>Breaking changes</h3>
      <ul>{analysis.result.breakingChanges.map((row) => <li key={row}>{row}</li>)}</ul>
      <h3>New capabilities</h3>
      <ul>{analysis.result.newCapabilities.map((row) => <li key={row}>{row}</li>)}</ul>
      <h3>Action items</h3>
      <ul>{analysis.result.migrationActions.map((row) => <li key={row}>{row}</li>)}</ul>
      <h3>Evidence</h3>
      <ul>{analysis.result.evidence.map((row) => <li key={row}>{row}</li>)}</ul>
      {receipt ? (
        <section>
          <h3>Receipt</h3>
          <div>
            <span className="badge">Action: {receipt.action}</span>
            <span className="badge">Status: {receipt.success ? 'success' : 'failed'}</span>
          </div>
          <p><strong>Command</strong>: <code>{receipt.sanitizedCommandPreview}</code></p>
          {receipt.stderr ? <p><strong>stderr</strong>: {receipt.stderr}</p> : null}
          <pre>{JSON.stringify(receipt, null, 2)}</pre>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' })
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = `${receipt.id}.json`
              link.click()
              URL.revokeObjectURL(link.href)
            }}
          >
            Export receipt JSON
          </button>
        </section>
      ) : null}
    </div>
  )
}
