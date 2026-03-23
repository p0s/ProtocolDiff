import { OlasAdapter } from "@/lib/analysis/olas-adapter"
import { getOlasConfig } from "@/lib/storage/local"

const adapter = new OlasAdapter()
const status = await adapter.getStatus()
const config = await getOlasConfig()

console.log(
  JSON.stringify(
    {
      status,
      config,
      checklist: {
        mechxInstalled: status.mechxInstalled,
        privateKeyConfigured: status.privateKeyConfigured,
        chainConfigured: status.chainConfig,
        ready: status.configured
      }
    },
    null,
    2
  )
)
