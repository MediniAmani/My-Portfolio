import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchContent } from '../api/client'
import type { PortfolioContent } from '../data/types'

export type ContentContextValue = {
  content: PortfolioContent
  reload: () => Promise<void>
}

export const ContentContext = createContext<ContentContextValue | null>(null)

export function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.site === 'object' &&
    Array.isArray(record.projects) &&
    typeof record.hero === 'object' &&
    typeof record.home === 'object' &&
    typeof record.nav === 'object' &&
    typeof record.footer === 'object'
  )
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    const data = await fetchContent()
    if (!isPortfolioContent(data)) {
      throw new Error('API returned unexpected content shape')
    }
    setContent(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload().catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to load content'
      setError(message)
      setLoading(false)
    })
  }, [reload])

  const value = useMemo(() => {
    if (!content) return null
    return { content, reload }
  }, [content, reload])

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading…</p>
        </div>
      </div>
    )
  }

  if (error || !value) {
    return (
      <div className="section">
        <div className="container">
          <h1>Content unavailable</h1>
          <p>{error ?? 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): PortfolioContent {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return ctx.content
}

export function useContentActions() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContentActions must be used within ContentProvider')
  }
  return { reload: ctx.reload }
}
