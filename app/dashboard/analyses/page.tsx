'use client'

import { useEffect, useState } from "react"
import ResultPanel from "@/components/ResultPanel"
import { AnalysisRecord, Receipt } from "@/lib/types"

type DisplayItem = {
  analysis: AnalysisRecord
  receipt?: Receipt
}

export default function AnalysisHistoryPage() {
  const [items, setItems] = useState<AnalysisRecord[]>([])
  const [selected, setSelected] = useState<DisplayItem | undefined>()

  const loadAnalyses = async () => {
    const response = await fetch("/api/analyses")
    if (!response.ok) return
    const list = (await response.json()) as AnalysisRecord[]
    setItems(list)
  }

  useEffect(() => {
    loadAnalyses()
  }, [])

  const openAnalysis = async (item: AnalysisRecord) => {
    let receipt: Receipt | undefined
    if (item.receiptId) {
      const response = await fetch(`/api/receipts/${item.receiptId}`)
      if (response.ok) {
        receipt = (await response.json()) as Receipt
      }
    }
    setSelected({ analysis: item, receipt })
  }

  return (
    <div>
      <section className="card">
        <h1>Analysis history</h1>
        <p>Saved analyses are retained locally and can be opened again for review.</p>
      </section>

      <section className="card">
        <h2>Saved analyses</h2>
        {items.length === 0 ? (
          <p>No analyses yet. Run one from Compare.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="card">
                <div className="row">
                  <strong>{item.title}</strong>
                  <span className="badge">{item.mode}</span>
                  <span className="badge">Risk {item.result.riskScore}/5</span>
                </div>
                <p>{item.sourceLabelA} ↔ {item.sourceLabelB}</p>
                <p>{new Date(item.createdAt).toLocaleString()}</p>
                <p>Receipts: {item.receiptId ? 1 : 0}</p>
                <button onClick={() => openAnalysis(item)}>Quick open</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected ? <ResultPanel analysis={selected.analysis} receipt={selected.receipt} /> : null}
    </div>
  )
}
