export function canPersistServerState() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_PUBLIC_PERSISTENCE === 'true'
}

export function canUseLocalOlas() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_PUBLIC_LOCAL_OLAS === 'true'
}

