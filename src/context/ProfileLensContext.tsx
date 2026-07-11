import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ProfileLens = 'data' | 'design'

type ProfileLensContextValue = {
  lens: ProfileLens
  displayLens: ProfileLens
  fading: boolean
  setLens: (next: ProfileLens) => void
}

const STORAGE_KEY = 'amani-profile-lens'
const FADE_MS = 320

const ProfileLensContext = createContext<ProfileLensContextValue | null>(null)

function readStoredLens(): ProfileLens {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw === 'data' || raw === 'design') return raw
  return 'data'
}

export function ProfileLensProvider({ children }: { children: ReactNode }) {
  const [lens, setLensState] = useState<ProfileLens>(() => readStoredLens())
  const [displayLens, setDisplayLens] = useState<ProfileLens>(() => readStoredLens())
  const [fading, setFading] = useState(false)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, lens)
  }, [lens])

  const setLens = useCallback(
    (next: ProfileLens) => {
      if (next === lens || fading) return
      setFading(true)
      window.setTimeout(() => {
        setLensState(next)
        setDisplayLens(next)
        setFading(false)
      }, FADE_MS)
    },
    [lens, fading],
  )

  const value = useMemo(
    () => ({
      lens,
      displayLens,
      fading,
      setLens,
    }),
    [lens, displayLens, fading, setLens],
  )

  return <ProfileLensContext.Provider value={value}>{children}</ProfileLensContext.Provider>
}

export function useProfileLens(): ProfileLensContextValue {
  const ctx = useContext(ProfileLensContext)
  if (!ctx) {
    throw new Error('useProfileLens must be used within ProfileLensProvider')
  }
  return ctx
}

export function isDesignCategory(category: string): boolean {
  const normalized = category.trim().toLowerCase()
  return normalized === 'ux design' || normalized === 'community'
}

export function isDataCategory(category: string): boolean {
  const normalized = category.trim().toLowerCase()
  return normalized === 'data analysis' || normalized === 'data quality'
}
