declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DEFAULT_MODE?: string
    MECH_PRIVATE_KEY_PATH?: string
    MECH_CHAIN_CONFIG?: string
    MECH_PRIORITY_ADDRESS?: string
    MECH_TOOL_NAME?: string
    MECH_USE_OFFCHAIN?: string
    MECHX_CHAIN_RPC?: string
    MECHX_BIN?: string
    MECHX_REQUEST_TIMEOUT_MS?: string
  }
}
