'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

const GNOSIS_CHAIN_ID_HEX = '0x64'
const GNOSIS_CHAIN_ID_DEC = '100'

export default function WalletModePanel() {
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')
  const [message, setMessage] = useState(
    'Connect a wallet to prepare for public self-funded Olas requests. Current sponsor proof was completed locally on Gnosis.'
  )

  useEffect(() => {
    if (!window.ethereum) return

    const load = async () => {
      try {
        const accounts = (await window.ethereum?.request({ method: 'eth_accounts' })) as string[]
        const currentChainId = (await window.ethereum?.request({ method: 'eth_chainId' })) as string
        setAddress(accounts?.[0] || '')
        setChainId(currentChainId || '')
      } catch {
        setMessage('Wallet detected, but account details could not be loaded yet.')
      }
    }

    void load()
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      setMessage('No EVM wallet detected. Install MetaMask, Rabby, or another injected wallet to use browser wallet mode.')
      return
    }

    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[]
      const currentChainId = (await window.ethereum.request({ method: 'eth_chainId' })) as string
      setAddress(accounts?.[0] || '')
      setChainId(currentChainId || '')
      setMessage('Wallet connected. ProtocolDiff can now guide a self-funded Olas request flow from the browser.')
    } catch {
      setMessage('Wallet connection was cancelled or failed.')
    }
  }

  const switchToGnosis = async () => {
    if (!window.ethereum) {
      setMessage('No wallet detected for chain switching.')
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GNOSIS_CHAIN_ID_HEX }]
      })
      setChainId(GNOSIS_CHAIN_ID_HEX)
      setMessage('Switched to Gnosis. Browser wallet mode is ready for a future client-side Olas transaction path.')
    } catch {
      setMessage('Could not switch to Gnosis automatically. Switch manually in your wallet if needed.')
    }
  }

  return (
    <section className="card">
      <h2>Real wallet mode</h2>
      <p>
        This is the public-safe Olas path: users connect their own wallet, fund their own request, and keep private keys
        out of the server. The current site ships the wallet-connect and Gnosis preparation layer first, while the
        qualifying Olas run was already completed locally and is proven below.
      </p>

      <div className="row">
        <span className="badge">Wallet: {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : 'not connected'}</span>
        <span className="badge">Chain: {chainId === GNOSIS_CHAIN_ID_HEX ? `Gnosis (${GNOSIS_CHAIN_ID_DEC})` : chainId || 'unknown'}</span>
      </div>

      <div className="row">
        <button type="button" onClick={() => void connect()}>Connect wallet</button>
        <button type="button" className="secondary" onClick={() => void switchToGnosis()}>
          Switch to Gnosis
        </button>
      </div>

      <p className="status-line">{message}</p>

      <div className="card inline-card">
        <h3>Why this path matters</h3>
        <ul>
          <li>No private key touches the server.</li>
          <li>Each user funds their own Olas request.</li>
          <li>The public site becomes an honest self-service sponsor demo instead of a fake relay.</li>
        </ul>
      </div>
    </section>
  )
}
