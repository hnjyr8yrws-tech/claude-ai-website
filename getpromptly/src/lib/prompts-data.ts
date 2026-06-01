import "server-only";
import fs from 'fs'
import path from 'path'

export interface PromptEntry {
  id: string
  title: string
  audience: string
  category: string
  subcategory: string
  keyStage: string
  subject: string
  sendTag: string
  complianceTags: string[]
  access: 'Free' | 'Premium'
  seoKeyword: string
  prompt: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"' && !inQuotes) { inQuotes = true; continue }
    if (char === '"' && inQuotes && line[i + 1] === '"') { current += '"'; i++; continue }
    if (char === '"' && inQuotes) { inQuotes = false; continue }
    if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue }
    current += char
  }
  result.push(current.trim())
  return result
}

function expandKeyStage(ks: string): string[] {
  const all = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']
  if (!ks || ks === 'All' || ks === 'Any') return all
  if (ks === 'School Leader') return ['School Leader']
  if (ks.includes('-')) {
    const parts = ks.split('-').map(s => s.trim())
    const start = parts[0]
    // The data writes ranges as "KS1-4" (bare digit end), not "KS1-KS4".
    const end = /^\d+$/.test(parts[1]) ? `KS${parts[1]}` : parts[1]
    const si = all.indexOf(start)
    const ei = all.indexOf(end)
    if (si !== -1 && ei !== -1) return all.slice(si, ei + 1)
  }
  return [ks]
}

export function getAllPrompts(): PromptEntry[] {
  const filePath = path.join(process.cwd(), 'prompts_master.csv')
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())
  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line)
    return {
      id: cols[0] ?? '',
      title: cols[1] ?? '',
      audience: cols[2] ?? '',
      category: cols[3] ?? '',
      subcategory: cols[4] ?? '',
      keyStage: cols[5] ?? '',
      subject: cols[6] ?? '',
      sendTag: cols[7] ?? '',
      complianceTags: (cols[8] ?? '').split(',').map(t => t.trim()).filter(Boolean),
      access: ((cols[9] ?? 'Free').trim()) as 'Free' | 'Premium',
      seoKeyword: cols[10] ?? '',
      prompt: cols[11] ?? '',
    }
  }).filter(p => p.id && p.title)
}

export function expandKeyStageForFilter(ks: string): string[] {
  return expandKeyStage(ks)
}
