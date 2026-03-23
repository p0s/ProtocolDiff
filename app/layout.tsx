import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'ProtocolDiff',
  description: 'Protocol change intelligence with optional Olas hiring workflow'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <header className="topbar">
            <div className="brand">ProtocolDiff</div>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/dashboard">Compare</Link>
              <Link href="/dashboard/analyses">History</Link>
              <Link href="/dashboard/receipts">Receipts</Link>
              <Link href="/dashboard/mechs">Mechs</Link>
              <Link href="/dashboard/batch">Batch Evidence</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>ProtocolDiff • Built for Olas hire track</footer>
        </div>
      </body>
    </html>
  )
}
