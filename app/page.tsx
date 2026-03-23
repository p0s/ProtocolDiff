import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      <section className="card">
        <h1>ProtocolDiff</h1>
        <p>
          Compare protocol docs, governance drafts, release notes, and product pages, then hire Olas agents to summarize breakage,
          capability updates, migration tasks, and risk.
        </p>
        <div className="row">
          <Link href="/dashboard"><button>Try demo</button></Link>
          <Link href="/dashboard/mechs"><button className="secondary">Run real Olas mode</button></Link>
          <Link href="/dashboard/receipts"><button className="secondary">View receipts</button></Link>
          <Link href="/dashboard/analyses"><button className="secondary">History</button></Link>
          <a href="/README.md" target="_blank" rel="noreferrer"><button className="secondary">View README</button></a>
        </div>
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol>
          <li>Paste two sources (URL or text) and label each snapshot.</li>
          <li>Run local diff for instant deterministic insight.</li>
          <li>Run Olas analysis through `mechx` and get a structured brief + receipts.</li>
          <li>Keep a history of analyses and export receipts for audit.</li>
          <li>Use batch evidence to run 10 Olas requests for sponsor proof.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Modes</h2>
        <p><strong>Demo mode:</strong> always works with no setup.</p>
        <p><strong>Real mode:</strong> calls `mechx` when installed and key configured.</p>
      </section>
    </div>
  )
}
