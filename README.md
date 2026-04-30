# ProtocolDiff

ProtocolDiff is a protocol change intelligence console. Paste two protocol snapshots, governance posts, release notes, docs pages, or raw text blocks; the app extracts readable text, computes a structured diff, and produces an operator-friendly change brief with receipt trails.

## Live Demo

- Product site: [protocoldiff.xyz](https://protocoldiff.xyz)
- Compare workspace: [protocoldiff.xyz/dashboard](https://protocoldiff.xyz/dashboard)
- Public README route: [protocoldiff.xyz/README.md](https://protocoldiff.xyz/README.md)

## What It Does

- Compares two text or URL snapshots.
- Highlights additions, removals, breaking changes, migration tasks, and risk signals.
- Runs in deterministic demo mode with no external dependencies.
- Can use a local Olas `mechx` setup for real marketplace requests and raw receipts.
- Keeps public deployments demo-safe by disabling server-side persistence and local Olas controls unless explicitly enabled.

## Demo And Real Modes

`demo` mode is the default. It runs locally, uses deterministic analysis, and is safe for public hosted deployments.

`real` mode is intended for a private local operator environment. It shells out to `mechx`, sends the diff payload to an Olas mech, and records sanitized command receipts in local state.

For public deployments, keep:

```bash
ALLOW_PUBLIC_PERSISTENCE=false
ALLOW_PUBLIC_LOCAL_OLAS=false
```

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Environment

Copy `.env.example` and set only the values needed for your mode.

```bash
NEXT_PUBLIC_DEFAULT_MODE=demo
ALLOW_PUBLIC_PERSISTENCE=false
ALLOW_PUBLIC_LOCAL_OLAS=false

MECH_PRIVATE_KEY_PATH=
MECH_CHAIN_CONFIG=gnosis
MECH_PRIORITY_ADDRESS=
MECH_TOOL_NAME=
MECH_USE_OFFCHAIN=true
MECHX_CHAIN_RPC=
MECHX_BIN=
MECHX_REQUEST_TIMEOUT_MS=45000
```

Never commit private keys, authenticated RPC URLs, wallet files, `.env.local`, `.local/`, `.secrets/`, or Vercel state.

## Olas Setup

1. Install and configure `mech-client` / `mechx` locally.
2. Put sensitive wallet material outside the repo and point `MECH_PRIVATE_KEY_PATH` at it.
3. Set `MECH_CHAIN_CONFIG`, `MECH_PRIORITY_ADDRESS`, and `MECH_TOOL_NAME`.
4. Open `/dashboard/mechs` to verify local availability.
5. Run a real analysis from `/dashboard`.

## Architecture

- Next.js App Router serves the product UI and API routes.
- `lib/analysis/demo-adapter.ts` provides deterministic demo results.
- `lib/analysis/olas-adapter.ts` wraps local `mechx` execution for real mode.
- `lib/security/runtime.ts` gates public persistence and local Olas controls.
- `lib/storage/local.ts` stores local analyses and receipts under ignored local state.

## Public Proof

ProtocolDiff includes public Olas proof links from the real request flow:

- [Gnosis tx 1](https://gnosisscan.io/tx/0x414f0d62de8d073e80026204803191c4967381b0586091e14ff0c87bdf4a5e56)
- [Gnosis tx 2](https://gnosisscan.io/tx/0x169f6b7da0be94e8e4fd775334a72b43d6e9e7a26ba1ad51e5d62d6f4df2c415)
- [Gnosis tx 3](https://gnosisscan.io/tx/0xb1cd9c681ca89e9ef33a32a487dcff868f4fc581ee1de277d9b6161bb1c581cd)

Private submission drafts and raw local evidence belong in `.secrets/`, not in git.

## Scripts

```bash
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run verify:mech
npm run batch:evidence
```

## Limits

- Real Olas mode depends on a locally installed and configured `mechx`.
- Public hosted mode intentionally avoids server-side wallet custody.
- The current product is a focused protocol-diff workflow, not a general observability platform.
