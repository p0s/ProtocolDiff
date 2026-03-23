import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-static'

export default async function ReadmePage() {
  const readmePath = path.join(process.cwd(), 'README.md')
  const content = await fs.readFile(readmePath, 'utf8')

  return (
    <div className="stack-page">
      <section className="page-head">
        <span className="eyebrow">Repository guide</span>
        <h1>README</h1>
        <p>Project instructions, real-mode setup, testing, and submission notes.</p>
      </section>

      <section className="card readme-card">
        <pre className="readme-pre">{content}</pre>
      </section>
    </div>
  )
}
