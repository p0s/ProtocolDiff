import { diffLines } from 'diff'

interface DiffItem {
  addedSections: string[]
  removedSections: string[]
  raw: string
  changedLines: number
  numericChanges: string[]
}

const NUMERIC_DIFF = /(\"?\d[\d,]*(?:\.\d+)?\"?)/g
const HEADING = /^#{1,4}\s+/.source

function unique<T>(values: T[]) {
  return [...new Set(values)]
}

export function buildStructuredDiff(left: string, right: string): DiffItem {
  const changes = diffLines(left, right)
  const addedSections: string[] = []
  const removedSections: string[] = []
  let changedLines = 0

  for (const part of changes) {
    if (!part.value) continue
    const lines = part.value.split('\n').map((line) => line.trim()).filter(Boolean)
    if (part.added) {
      changedLines += lines.length
      addedSections.push(...lines)
    }
    if (part.removed) {
      changedLines += lines.length
      removedSections.push(...lines)
    }
  }

  const allText = `${left}\n${right}`
  const numericChanges = (allText.match(NUMERIC_DIFF)?.filter(Boolean) ?? []).map((n: string) => n.replace(/\"/g, ''))

  const addedHeadings = addedSections.filter((line) => new RegExp(HEADING).test(line))
  const removedHeadings = removedSections.filter((line) => new RegExp(HEADING).test(line))

  return {
    addedSections: unique(addedHeadings.length ? addedHeadings : addedSections).slice(0, 16),
    removedSections: unique(removedHeadings.length ? removedHeadings : removedSections).slice(0, 16),
    raw: changes.map((chunk: { value: string }) => chunk.value).join(''),
    changedLines,
    numericChanges: unique(numericChanges)
  }
}
