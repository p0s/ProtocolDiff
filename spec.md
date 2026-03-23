# spec.md — ProtocolDiff (Olas)

## 0) Read this first

This spec is written for Codex to execute end-to-end on the user's MacBook.

The job is to fully build, test, fix, document, commit, and push a complete hackathon-ready project called **ProtocolDiff**.

Do **not** leak or commit any secrets, private keys, wallet files, RPC URLs with credentials, or personal data.

Do **not** auto-submit the project to Synthesis without explicit user confirmation in the active session.

This project should be optimized for the **easiest strong Olas path**:
- primary target: **Hire an Agent on Olas Marketplace**
- real Olas integration via `mech-client` / `mechx`
- demo mode that always works without any Olas setup

Do **not** overbuild.
Do **not** make Pearl the core path.
Do **not** make custom mech monetization the core path unless everything else is already complete and stable.

Why:
- Pearl access is officially described as temporarily limited.
- `mech-client` is clearly documented and directly aligned with the sponsor track.
- The Hire track is a much easier reliable path than standing up a full monetized custom mech first.

Design should be **modern minimalist**:
- clean and calm
- sparse, professional layout
- neutral surfaces
- subtle accent
- clear diff views
- monospace receipts / request logs

Build **two layers**:
1. **Demo layer** — works instantly, no Olas dependency.
2. **Real integration layer** — uses real `mechx` requests on the user's machine when configured.

The user must be able to experience both.

Execution note:
- use subagents when useful for bounded, parallelizable work such as isolated codebase inspection, screenshot capture follow-ups, or independent docs checks
- do not delegate the main blocking implementation path if it would slow down integration
- keep delegated work scoped, concrete, and easy to merge back into the main flow

---

## 1) Project choice

### Name
**ProtocolDiff**

### One-line pitch
A protocol change intelligence console that compares two docs, governance posts, release notes, or webpages, then hires Olas marketplace agents to summarize what changed, what might break, and what action should be taken.

### Primary sponsor target
- **Hire an Agent on Olas Marketplace**

### Optional stretch target
- **Monetize Your Agent on Olas Marketplace**
  - only attempt this after the core hire workflow is stable
  - do not let this delay completion
  - it is a stretch, not the MVP

### Explicitly avoid
Do **not** select any track the user already used in the first project.

---

## 2) Why this is the easiest strong Olas build

ProtocolDiff is the easiest good Olas project because:
- it can work beautifully in demo mode even without any chain setup
- it only needs one clear real integration to qualify: using `mech-client` to hire agents and make requests
- it avoids the complexity of building a full Pearl-native agent first
- it avoids the complexity of making a custom monetized mech the required path
- it is distinct from many visible Olas entries focused on memory, hiring markets, trust layers, or agent infrastructure

This is a product, not just infra.

---

## 3) Product definition

### Core use case
A founder, operator, researcher, or developer wants to compare:
- two versions of protocol docs
- a docs page and a release note
- two governance proposal texts
- two product pages
- two pasted text snapshots

The app should:
1. ingest both sources
2. extract readable text
3. compute a structured diff
4. produce a deterministic local summary in demo mode
5. in real mode, send the diff to an Olas marketplace agent using `mechx request`
6. show:
   - what changed
   - breaking changes
   - new capabilities
   - migration tasks
   - risk level
   - raw Olas receipt

### Key user promise
**“Paste two protocol snapshots, hire an Olas agent, and get a change brief with receipts.”**

### Non-goals
Do not build:
- a full observability platform
- broad governance analytics
- custom Pearl integration as MVP
- a complex multi-agent backend
- a large auth system
- a browser extension
- a knowledge graph

Keep it scoped and sponsor-shaped.

---

## 4) Success criteria

The project is complete when all of the following are true:

### Product
- polished landing page
- working compare workflow
- demo mode works with no setup
- real Olas mode works locally if `mechx` is installed and configured
- receipts are first-class
- there is a saved history of analyses

### Olas integration
- app can detect `mechx`
- app can optionally list mechs from the marketplace
- app can send a real request via `mechx request`
- app captures and stores the real response receipt
- app supports a guided “run 10 requests” evidence flow for sponsor proof if configured

### Engineering
- local app runs cleanly
- unit tests pass
- demo E2E tests pass
- real mode smoke tests exist
- build passes

### Submission readiness
- README sponsor section is strong
- private submission package is complete under `.secrets/submission/`
- screenshots exist
- cover image exists
- evidence log exists
- Synthesis project creation is prepared
- final submission stops and waits for user confirmation

---

## 5) Recommended stack

Use the simplest viable stack:

- **Next.js 14 or 15** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Zod**
- **Vitest**
- **Playwright**
- **Node child_process / execa** to call `mechx`
- minimal local persistence:
  - local JSON in `.local/`
  - localStorage fallback for public demo
- text extraction:
  - `@mozilla/readability` + `jsdom` OR `cheerio`
  - `turndown` if useful
- diffing:
  - `diff` npm package or a small custom structural diff helper

Do not introduce Python app code unless strictly needed.
For the MVP, `mechx` should be treated as an external local tool invoked by the Next backend.

### Hosting
- public demo on Vercel in **demo mode**
- real Olas integration used locally on the user's MacBook
- GitHub Pages only if a good demo still works; otherwise use Vercel

---

## 6) Repo structure

Suggested structure:

```text
protocoldiff/
  app/
    (marketing)/
    dashboard/
      page.tsx
      analyses/
      receipts/
      mechs/
      settings/
    api/
      health/route.ts
      mode/route.ts
      compare/route.ts
      analyses/route.ts
      analyses/[id]/route.ts
      olas/status/route.ts
      olas/mechs/route.ts
      olas/request/route.ts
      olas/batch-evidence/route.ts
      receipts/route.ts
  components/
  lib/
    config.ts
    storage/
    extraction/
    diff/
    analysis/
      adapter.ts
      demo-adapter.ts
      olas-adapter.ts
      prompt.ts
      parser.ts
    receipts/
    validation/
  scripts/
    verify-olas-mode.ts
    run-batch-evidence.ts
    capture-screenshots.ts
    prepare-submission.ts
  .secrets/
    submission/
    submission-metadata.json
    tracks.md
    sponsor-notes.md
    demo-script.md
    checklist.md
    evidence/
    agent.json
    agent_log.json
  tests/
    unit/
    e2e/
  public/
    cover.png
    screenshots/
  README.md
  spec.md
  .env.example
```

---

## 7) Core feature set

### 7.1 Landing page
Must clearly show:
- what ProtocolDiff does
- why Olas matters
- demo vs real mode
- quick workflow illustration:
  - source A
  - source B
  - diff
  - hire agent
  - receive brief
- call-to-action buttons:
  - Try demo
  - Run real Olas mode locally
  - View receipts
  - View GitHub

### 7.2 Compare workspace
Single clean page with:
- Source A input
- Source B input
- input type selector:
  - URL
  - pasted text
- “Run local diff”
- “Analyze with demo mode”
- “Analyze with Olas”

Output sections:
- extracted source summaries
- unified diff / structured change list
- executive summary
- breaking changes
- action items
- risk score
- receipt panel

### 7.3 Analysis history
List saved analyses with:
- title
- source labels
- mode
- timestamp
- risk score
- receipt count
- quick-open action

### 7.4 Mechs page
A simple helper page:
- detect whether Olas real mode is configured
- optionally list mechs from `mechx mech list --chain-config <network>`
- let user paste / store:
  - preferred mech address
  - preferred tool name
  - chain config (gnosis/base/polygon/optimism)
- show copyable commands for setup

Do not overcomplicate mech discovery.

### 7.5 Receipts page
Critical page.
Show:
- each analysis request
- mode (demo / real)
- request payload preview
- selected mech/tool
- command preview
- stdout/stderr excerpt
- parsed result
- export JSON

### 7.6 Batch evidence runner
A dedicated utility page or button that:
- loads 10 small example compare jobs
- runs them one by one in real mode if configured
- stores receipts
- produces a sponsor evidence bundle

This is important because the Olas sponsor text for the Hire track explicitly mentions making **10 requests** on a supported chain.
Build this in a reliable, explicit way.

---

## 8) Demo layer vs real integration layer

Mandatory.

### 8.1 Demo layer
Must always work.
No Olas setup required.

Provide:
- seeded examples:
  - “Docs v1 vs Docs v2”
  - “Governance proposal draft vs final”
  - “Release notes old vs new”
- local deterministic summarizer:
  - extract headings
  - count added/removed sections
  - identify changed numeric values
  - classify changes into:
    - summary
    - breaking changes
    - new capabilities
    - action items
    - risk score
- demo receipts that look like real internal workflow receipts

This mode should feel polished and useful.

### 8.2 Real integration layer
Use `mechx` as the real Olas request rail.

Important:
- Do not hardcode a mech address if avoidable.
- Let the user provide a preferred mech address and tool name.
- Provide a default sample configuration only if it is easy to discover and verify.

If real mode is not configured, the UI should not fail; it should show:
- what is missing
- exactly how to fix it
- a button to return to demo mode

---

## 9) Olas integration design

Create an interface:

```ts
interface AnalysisAdapter {
  getStatus(): Promise<AnalysisStatus>;
  listMechs?(): Promise<MechSummary[]>;
  analyze(input: AnalyzeInput): Promise<AnalyzeResult>;
  runBatchEvidence?(inputs: AnalyzeInput[]): Promise<BatchEvidenceResult>;
}
```

Implement two adapters:

### 9.1 Demo adapter
Pure local logic.
Returns structured analysis with no external dependency.

### 9.2 Olas adapter
Calls `mechx` commands through a safe wrapper.

#### Read-only / helper commands
- `mechx mech list --chain-config <network>`

#### Request command
Use the documented form:
```bash
mechx request --prompts "<prompt>" --priority-mech <mech_address> --tools <tool_name> --chain-config <network> --use-offchain
```

Use `--use-offchain` by default for faster UX.
If it fails, allow retry without `--use-offchain`.

#### Private key handling
`mech-client` expects a key file.
Do not commit this.
Support a local env var such as:
- `MECH_PRIVATE_KEY_PATH=/absolute/path/to/ethereum_private_key.txt`

When calling `mechx`, pass `--key` if needed.

Also support:
- `MECH_CHAIN_CONFIG`
- `MECH_PRIORITY_ADDRESS`
- `MECH_TOOL_NAME`
- `MECHX_CHAIN_RPC` (optional local env)

If these are missing, the app should explain exactly what needs to be configured.

#### Request strategy
For every real analysis:
1. build a concise but structured prompt
2. send request via `mechx`
3. store full raw receipt
4. parse result
5. if parsing fails, still show raw result

---

## 10) Prompt design

Build a strong, explicit prompt template.

Example structure:

```text
You are an agent analyzing differences between two protocol or product snapshots.

Context:
- project name: {label}
- source A label: {aLabel}
- source B label: {bLabel}

Source A summary:
{aSummary}

Source B summary:
{bSummary}

Structured diff:
{diffText}

Return a strict JSON object with:
{
  "summary": "2-4 sentence summary",
  "breakingChanges": ["..."],
  "newCapabilities": ["..."],
  "migrationActions": ["..."],
  "riskScore": 1,
  "evidence": ["short bullet evidence strings"]
}
```

Rules:
- keep prompt size bounded
- truncate/chunk large inputs
- prefer high-signal snippets over full raw documents
- if source text is too large, summarize locally first, then send the summarized diff

---

## 11) Parsing strategy

The mech may not return perfect JSON.
Build defensively.

### Parse order
1. try `JSON.parse`
2. if wrapped in markdown code fences, strip and parse
3. if not JSON:
   - parse markdown headings / bullets
   - fallback to text sections
4. always store raw output

Never discard the raw Olas response.

---

## 12) Local diff pipeline

Keep this deterministic and reliable.

### Source ingestion
For URL mode:
- fetch HTML server-side
- extract readable article/body text
- remove nav/footer/noise
- store a short source snapshot

For pasted text mode:
- use as-is

### Diffing
Generate:
- heading-level changes
- added/removed lines
- changed numeric values if simple
- section title additions/removals
- a compact “structured diff” text block for the demo summarizer and Olas prompt

Do not build a huge diff engine. A practical high-signal diff is enough.

---

## 13) Data model

### AnalysisRecord
```ts
type AnalysisRecord = {
  id: string;
  title: string;
  mode: "demo" | "real";
  sourceTypeA: "url" | "text";
  sourceTypeB: "url" | "text";
  sourceLabelA: string;
  sourceLabelB: string;
  sourceSnapshotA: string;
  sourceSnapshotB: string;
  diffSummary: string;
  result: {
    summary: string;
    breakingChanges: string[];
    newCapabilities: string[];
    migrationActions: string[];
    riskScore: number;
    evidence: string[];
  };
  createdAt: string;
};
```

### OlasConfig
```ts
type OlasConfig = {
  chainConfig: string;
  mechAddress: string;
  toolName: string;
  useOffchain: boolean;
};
```

### Receipt
```ts
type Receipt = {
  id: string;
  mode: "demo" | "real";
  action: "analyze" | "batch-evidence" | "mech-list";
  command?: string[];
  sanitizedCommandPreview: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  parsed?: Record<string, unknown>;
  success: boolean;
  createdAt: string;
};
```

---

## 14) UX notes

### Design language
- roomy compare form
- large diff/result cards
- sticky results nav if helpful
- clear tabs:
  - Local Diff
  - Demo Analysis
  - Olas Analysis
  - Receipt
- risk badge from 1–5
- clean markdown rendering for results
- monospace for raw output

### Tone
- operator-grade
- “protocol change intelligence”
- factual, not hypey

Suggested copy:
- “Hire an Olas agent to explain what changed.”
- “Demo mode always works.”
- “Real mode uses mech-client on your machine.”

---

## 15) Security / privacy rules

Mandatory:
- never commit private key files
- never commit RPC URLs with embedded credentials
- never commit local env files
- sanitize all command output before storing if it may include sensitive paths
- `.gitignore` must include:
  - `.env*`
  - `.local/`
  - `ethereum_private_key.txt`
  - any logs or chain-specific envs
- if the user configures a key path, only store the path locally or in env, never in repo
- do not claim trustlessness where the app is just wrapping a local CLI

Be honest.

---

## 16) Real mode local setup

Document this clearly in README + settings page.

### Required setup
1. install Python and Poetry if needed by `mech-client`
2. install `mech-client`
3. create/fund an EOA key file outside the repo
4. set env vars
5. start the app
6. switch to real mode
7. test mech listing
8. run a single analysis
9. optionally run the 10-request evidence batch

### Environment variables
Use an `.env.example` like:

```bash
NEXT_PUBLIC_DEFAULT_MODE=demo

MECH_PRIVATE_KEY_PATH=
MECH_CHAIN_CONFIG=gnosis
MECH_PRIORITY_ADDRESS=
MECH_TOOL_NAME=
MECH_USE_OFFCHAIN=true
MECHX_CHAIN_RPC=
```

The app must work with none of these set by falling back to demo mode.

---

## 17) Batch evidence runner

This is a core sponsor utility.

Build a script and/or API route that runs a fixed set of 10 small compare jobs when real mode is configured.

Examples:
1. docs intro old vs new
2. release notes old vs new
3. API guide old vs new
4. governance text old vs revised
5. FAQ old vs new
6. product page old vs new
7. terms summary old vs new
8. roadmap old vs new
9. tokenomics paragraph old vs new
10. integration guide old vs new

Each run should store:
- prompt preview
- selected mech
- tool
- timestamp
- success/failure
- raw result
- parsed summary

At the end, generate:
- `.secrets/submission/evidence/olas-batch-summary.json`
- `.secrets/submission/evidence/olas-batch-summary.md`

This makes submission easier.

---

## 18) Testing plan

### 18.1 Unit tests
At minimum:
- text extraction helpers
- diff generation
- prompt builder
- response parser
- mode switching
- storage adapter
- CLI wrapper error handling

### 18.2 End-to-end tests
Demo mode only:
- landing page loads
- user pastes two sample texts
- user runs demo analysis
- result sections appear
- receipt appears
- history entry saved
- user can export receipts

### 18.3 Real mode smoke tests
Guard behind env flags and skip when unavailable.

Smoke cases:
- `mechx` detection
- mech list command
- one real analysis request
- store receipt

Do not make batch 10-request evidence mandatory in automated tests.

### 18.4 CI
If GitHub Actions available:
- install deps
- lint
- typecheck
- unit tests
- demo E2E
- build

Real mode tests opt-in only.

---

## 19) README requirements

README must include:
- what ProtocolDiff does
- why it is useful
- why Olas benefits from it
- demo vs real mode
- how to run locally
- how to set up `mech-client`
- screenshots
- architecture overview
- sponsor alignment
- limitations / honest notes

### Sponsor-focused README section
Explain clearly:
- the app hires marketplace agents using `mech-client`
- the app makes real requests and stores receipts
- the batch evidence runner exists specifically to make the Olas integration concrete
- the product turns Olas mech access into a practical workflow, not just infra

Do not overclaim monetization if the stretch goal is not shipped.

---

## 20) Submission files to generate

Create a private `.secrets/submission/` folder with:

### 20.1 `submission-metadata.json`
Populate from the latest official Synthesis schema by reading:
- `https://synthesis.md/skill.md`
- `https://synthesis.md/submission/skill.md`

### 20.2 `tracks.md`
Primary:
- Hire an Agent on Olas Marketplace

Optional stretch:
- Monetize Your Agent on Olas Marketplace only if a real custom mech was actually implemented and tested

Do **not** include previously used tracks.

### 20.3 `sponsor-notes.md`
Include:
- exact Olas commands / flow used
- proof that requests were made
- note on 10-request evidence batch
- screenshots / receipts references

### 20.4 `demo-script.md`
Suggested demo:
1. open landing page
2. compare two docs in demo mode
3. show local diff
4. show demo analysis
5. switch to real mode
6. show Olas status
7. run one real Olas analysis
8. show raw receipt
9. show batch evidence page

### 20.5 `checklist.md`
Final checklist including:
- build/tests/docs/screenshots/deploy/submission ready

### 20.6 `agent.json` and `agent_log.json`
Generate honest artifacts only.
No fabricated logs.

---

## 21) Stretch goal: custom monetized mech (optional only)

Only do this if the core hire flow is already complete, tested, documented, committed, and deployed.

Possible stretch:
- create a custom mech tool called `protocol_diff`
- scaffold with:
  ```bash
  mech add-tool <author> protocol_diff -d "Summarize changes between two protocol snapshots"
  ```
- implement simple tool logic
- publish metadata
- update on-chain metadata
- run mech
- then use ProtocolDiff as both:
  - client
  - service

But again:
**this is optional**
and must not delay the core project.

---

## 22) Synthesis project creation + submission flow

This is mandatory but must stop before final submit unless the user explicitly confirms.

### Runtime flow
When project is complete:
1. fetch latest:
   - `https://synthesis.md/skill.md`
   - `https://synthesis.md/submission/skill.md`
2. read the current project/team creation method
3. create a new project inside the user's existing team if possible
4. prepare metadata and assets
5. ask user for explicit final confirmation
6. only then submit

### Rules
- do not auto-submit
- do not include private info
- do not select tracks already used by the user
- if API/project creation fails, leave a manual fallback doc with exact steps and ready payloads

---

## 23) Git and commit plan

Use meaningful commits such as:

1. `feat: scaffold ProtocolDiff app shell and compare workspace`
2. `feat: add demo diff engine and analysis history`
3. `feat: implement receipts and export flows`
4. `feat: add Olas mechx adapter and status detection`
5. `feat: support real Olas analysis and batch evidence runner`
6. `test: add unit and demo e2e coverage`
7. `docs: write sponsor-focused README and submission package`
8. `chore: prepare deployment and synthesis submission assets`

Push to GitHub when stable.
Use `gh` if authenticated.
Otherwise initialize locally and leave exact instructions.

---

## 24) Deployment plan

### Public deployment
Deploy demo mode to Vercel.

### Local real integration
The user's MacBook run is the primary real Olas environment.

If everything is stable, support:
```bash
npm run build
npm run start
```

But do not force public hosting of real Olas mode if it complicates completion.

---

## 25) Nice-to-have additions (only after core is stable)

Only after everything works:
- source snapshot side-by-side view
- markdown export
- JSON export of analysis
- multiple saved mech profiles
- keyboard shortcuts
- optional custom monetized mech integration

Do not let these slow the core path.

---

## 26) Final acceptance checklist

### Product
- [ ] landing page polished
- [ ] compare flow polished
- [ ] demo mode works fully
- [ ] real mode detects mechx
- [ ] one real Olas request works if configured
- [ ] receipts page works
- [ ] history works
- [ ] batch evidence tool exists

### Quality
- [ ] lint passes
- [ ] typecheck passes
- [ ] unit tests pass
- [ ] Playwright demo tests pass
- [ ] build passes

### Docs
- [ ] README complete
- [ ] screenshots captured
- [ ] cover image created
- [ ] private submission package complete under `.secrets/submission/`
- [ ] sponsor notes written

### Git / deployment
- [ ] meaningful commits made
- [ ] repo pushed
- [ ] demo deployed

### Submission
- [ ] latest Synthesis method re-read
- [ ] project prepared inside existing team
- [ ] user explicitly confirmed before final submit

---

## 27) Final instruction to Codex

Be ruthless about scope.

A polished ProtocolDiff app with:
- a great demo layer
- a real `mechx` integration
- honest receipts
- a 10-request evidence helper

is much better than a sprawling Olas project that half-attempts Pearl, monetization, and custom infra all at once.

Ship the strong simple thing.
