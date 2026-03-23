# ProtocolDiff

ProtocolDiff is a protocol change intelligence console for comparing two snapshots (documents, governance proposals, release notes, or web pages) and producing a practical change brief.

## Why this is useful

Protocol teams usually diff raw text manually and miss risk signals. ProtocolDiff gives a deterministic local baseline and then hires Olas marketplace agents for deeper interpretation.

## Demo vs real mode

- `demo` mode runs entirely locally and always works.
- `real` mode uses local `mechx` to send an external analysis request and stores raw receipts.
- In production deployments, saved history/receipts and local Olas operations are disabled by default to avoid exposing local server state.

## Quick setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

For a public deployment, leave `ALLOW_PUBLIC_PERSISTENCE=false` and `ALLOW_PUBLIC_LOCAL_OLAS=false`.
Only enable them for a private deployment where exposing server-side history or local Olas controls is acceptable.

## Real Olas setup

1. Install and configure `mech-client` / `mechx`.
2. Set environment variables:

```bash
MECH_PRIVATE_KEY_PATH=/absolute/path/to/key.txt
MECH_CHAIN_CONFIG=gnosis
MECH_PRIORITY_ADDRESS=0x...
MECH_TOOL_NAME=protocol_diff
MECH_USE_OFFCHAIN=true
```

3. Open `/dashboard/mechs` to verify status and list mechs.
4. Run real analysis from `/dashboard`.

## Screens and workflow

- `dashboard` compare form
- `dashboard/analyses` history
- `dashboard/receipts` raw receipts
- `dashboard/mechs` Olas config and mech list
- `dashboard/batch` 10-request batch runner

## Architecture

- Next.js app router for pages and API routes.
- Adapters in `lib/analysis`:
  - `DemoAdapter` for deterministic mode
  - `OlasAdapter` for `mechx` command execution
- Persistent local state in `.local/state.json`.
- Receipts and analyses are stored and exportable.

## End-to-end screens

- `/dashboard` Compare workspace
- `/dashboard/analyses` saved history
- `/dashboard/receipts` command receipts and JSON export
- `/dashboard/mechs` Olas setup + discovery
- `/dashboard/batch` 10-request evidence runner

## Sponsor alignment (Olas)

ProtocolDiff has a real Olas Hire path:
- Detects `mechx` availability.
- Sends `mechx request --prompts ... --chain-config ... --priority-mech ... --tools ... --use-offchain`.
- Stores raw command output as receipts.
- Includes a 10-request evidence runner at `/dashboard/batch` and `scripts/run-batch-evidence.ts`.

## Testing

```bash
npm run test:unit
npm run test:e2e
npm run build
```

## Submission helpers

- `npm run batch:evidence` writes private evidence files under `.secrets/submission/evidence/`.
- `npm run submission:prepare` writes the private Synthesis draft package under `.secrets/submission/`.
- Keep Synthesis team IDs, track UUIDs, cover assets, and conversation logs in `.secrets/submission/`; do not commit them.
- `node_modules` is intentionally not included in `.gitignore` artifacts.

## Limits

- This project intentionally ships a minimal Olas-hire-first workflow.
- Custom monetized mech integration is optional and not required for the core path.
