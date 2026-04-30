# Security Policy

## Supported Branch

Security fixes are handled on `main`.

## Reporting

Please do not open public issues for suspected vulnerabilities or leaked secrets. Report privately to the repository owner through GitHub.

Include:

- affected commit or release
- reproduction steps
- expected and actual behavior
- impact assessment

## Secret Handling

Never commit wallet keys, private RPC URLs, API keys, `.env.local`, `.local/`, `.secrets/`, Vercel state, or raw operational receipts that contain private data.

Real Olas mode is intended for local operator use. Public deployments should keep local Olas controls and server-side persistence disabled unless the deployment is private and intentionally configured otherwise.
