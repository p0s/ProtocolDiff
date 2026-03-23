import Link from 'next/link'
import ModeSwitch from '@/components/ModeSwitch'

export default function LandingPage() {
  return (
    <div className="stack-page">
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">Protocol operations</span>
          <h1>Track what changed before it breaks your rollout.</h1>
          <p className="hero-text">
            Compare protocol docs, governance drafts, release notes, and product pages, then send the structured
            diff to Olas agents for a practical change brief with receipts.
          </p>
          <div className="row">
            <Link href="/dashboard"><button>Open demo workspace</button></Link>
            <Link href="/dashboard/mechs"><button className="secondary">Configure real Olas mode</button></Link>
            <Link href="/readme"><button className="secondary">Read setup guide</button></Link>
          </div>
          <ModeSwitch />
          <div className="metric-strip">
            <div className="metric-card">
              <span className="metric-label">Default mode</span>
              <strong>Zero-setup demo</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Proof path</span>
              <strong>10 Olas requests on Gnosis</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Public real path</span>
              <strong>Browser wallet signing plan</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-window">
            <div className="hero-window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-art">
              <img src="/brand/protocoldiff-minimal.svg" alt="ProtocolDiff minimalist mark" />
            </div>
            <div className="hero-window-grid">
              <div className="hero-step">
                <span className="hero-step-label">A</span>
                <strong>Snapshot input</strong>
                <p>Paste docs, release notes, or governance text.</p>
              </div>
              <div className="hero-step">
                <span className="hero-step-label">B</span>
                <strong>Structured diff</strong>
                <p>Highlight removals, additions, and numeric changes.</p>
              </div>
              <div className="hero-step">
                <span className="hero-step-label">C</span>
                <strong>Risk brief</strong>
                <p>Summaries, migration actions, and receipts in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="three-up">
        <article className="card feature-card">
          <h2>How it works</h2>
          <ol>
            <li>Paste two sources and label both snapshots.</li>
            <li>Run the local diff for deterministic signal.</li>
            <li>Escalate to Olas for a receipt-backed analysis.</li>
            <li>Review saved analyses, receipts, and batch evidence.</li>
          </ol>
        </article>

        <article className="card feature-card">
          <h2>Modes</h2>
          <p><strong>Demo mode</strong> is always available and prefilled for fast click-through.</p>
          <p><strong>Real wallet mode</strong> is the public-safe direction: users connect their own wallet, fund their own request, and keep keys off the server.</p>
        </article>

        <article className="card feature-card">
          <h2>Navigate</h2>
          <div className="stack-links">
            <Link href="/dashboard">Compare workspace</Link>
            <Link href="/dashboard/analyses">Analysis examples</Link>
            <Link href="/dashboard/receipts">Receipts</Link>
            <Link href="/dashboard/batch">Batch evidence</Link>
          </div>
        </article>
      </section>
    </div>
  )
}
