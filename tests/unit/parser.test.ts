import { describe, it, expect } from "vitest"
import { parseOlasOutput } from "@/lib/analysis/parser"

describe("parseOlasOutput", () => {
  it("reads strict json from mech output", () => {
    const parsed = parseOlasOutput(
      "{\"summary\":\"ok\",\"breakingChanges\":[\"x\"],\"newCapabilities\":[],\"migrationActions\":[],\"riskScore\":3,\"evidence\":[\"a\"]}"
    )
    expect(parsed?.summary).toBe("ok")
    expect(parsed?.riskScore).toBe(3)
  })

  it("falls back to heuristics when non-json is returned", () => {
    const parsed = parseOlasOutput("Summary: changed value 2\nBreaking: none\nRisk: 2")
    expect(parsed?.summary).toContain("changed value")
  })
})
