export function parsePath(path: string): (string | number)[] {
  return path.split('.').map((part) => (/^\d+$/.test(part) ? Number(part) : part))
}

export function getAt(root: unknown, path: string): unknown {
  const parts = parsePath(path)
  let current: unknown = root
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string | number, unknown>)[part]
  }
  return current
}

export function setAt<T>(root: T, path: string, value: unknown): T {
  const parts = parsePath(path)
  if (parts.length === 0) return root

  const clone = structuredClone(root) as unknown
  let cursor: Record<string | number, unknown> = clone as Record<string | number, unknown>

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]
    const next = cursor[part]
    if (next == null || typeof next !== 'object') {
      throw new Error(`Invalid path segment at ${parts.slice(0, i + 1).join('.')}`)
    }
    cursor[part] = Array.isArray(next) ? [...next] : { ...(next as object) }
    cursor = cursor[part] as Record<string | number, unknown>
  }

  cursor[parts[parts.length - 1]] = value
  return clone as T
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
