# AGENTS.md

This repo is a hackathon repo. Optimize for a crisp working demo and a clean submission, not architectural purity.

## Build posture

- Use a hard cutover approach. Do not prioritize backward compatibility unless the human explicitly asks for it.
- Keep code boring, explicit, and readable.
- Prefer simple contracts and straightforward app flows over clever abstractions.
- Use strong typing end to end wherever the stack supports it.
- If an integration is blocked, replace it with the smallest honest implementation that preserves the demo loop.
- Do not spend time on generic marketplace features, growth features, or unrelated dashboards.

## Product alignment

- `SPEC.md` is the current product-alignment document. Use it to determine what to build and to stay aligned to the goal.
- If the human asks for something materially different from `SPEC.md`, confirm the new direction first and then update `SPEC.md` after that direction is agreed.
- If `SPEC.md` does not exist yet, create it before substantial product work so the repo has a current alignment document.

## Security and privacy

- Keep secrets, env vars, API keys, and private data out of git.
- Keep secrets and private data out of logs, screenshots, and shared artifacts.
- Use repo-local ignored files such as `.secrets/`, `tooling.md`, and `.vercel/` for local-only operational state.

## Tooling memory

- Record important tooling realities in `tooling.md` whenever something materially works, fails, or needs a non-obvious workaround in this environment.
