import './globals.css'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'ProtocolDiff',
  description: 'Protocol change intelligence with optional Olas hiring workflow',
  metadataBase: new URL('https://protocoldiff.xyz'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'ProtocolDiff',
    description: 'Protocol change intelligence with optional Olas hiring workflow',
    url: 'https://protocoldiff.xyz',
    siteName: 'ProtocolDiff'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('protocoldiff-theme');
                  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.dataset.theme = theme;
                } catch (error) {}
              })();
            `
          }}
        />
      </head>
      <body>
        <div className="page-shell">
          <header className="topbar">
            <div className="brand-group">
              <div className="brand-mark">PD</div>
              <div>
                <div className="brand">ProtocolDiff</div>
                <div className="brand-subtitle">Change intelligence for protocol teams</div>
              </div>
            </div>
            <div className="topbar-actions">
              <nav>
                <Link href="/">Home</Link>
                <Link href="/dashboard">Compare</Link>
                <Link href="/dashboard/analyses">History</Link>
                <Link href="/dashboard/receipts">Receipts</Link>
                <Link href="/dashboard/mechs">Mechs</Link>
                <Link href="/dashboard/batch">Batch Evidence</Link>
                <Link href="/readme">README</Link>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
          <footer>ProtocolDiff • Built for Olas hire track</footer>
        </div>
      </body>
    </html>
  )
}
