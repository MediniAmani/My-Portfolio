import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from './ContentContext'

export type ProfileLens = 'data' | 'design'

type ProfileLensContextValue = {
  lens: ProfileLens
  displayLens: ProfileLens
  fading: boolean
  defaultLens: ProfileLens
  setLens: (next: ProfileLens) => void
  shareUrl: string
}

const STORAGE_KEY = 'amani-profile-lens'
export const PROFILE_LENS_SHARE_PARAM = 'lens'
const FADE_MS = 320

const ProfileLensContext = createContext<ProfileLensContextValue | null>(null)

export function parseProfileLens(value: string | null | undefined): ProfileLens | null {
  if (value === 'data' || value === 'design') return value
  return null
}

function readSessionLens(): ProfileLens | null {
  return parseProfileLens(sessionStorage.getItem(STORAGE_KEY))
}

export function ProfileLensProvider({ children }: { children: ReactNode }) {
  const { profileLens } = useContent()
  const [, setSearchParams] = useSearchParams()

  const cmsDefault = parseProfileLens(profileLens.defaultLens)
  if (!cmsDefault) {
    throw new Error('profileLens.defaultLens must be "data" or "design"')
  }

  const [lens, setLensState] = useState<ProfileLens>(() => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = parseProfileLens(params.get(PROFILE_LENS_SHARE_PARAM))
    if (fromUrl) return fromUrl
    const fromSession = readSessionLens()
    if (fromSession) return fromSession
    return cmsDefault
  })
  const [displayLens, setDisplayLens] = useState<ProfileLens>(lens)
  const [fading, setFading] = useState(false)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, lens)
    document.documentElement.dataset.profileLens = lens
  }, [lens])

  // Keep the address bar shareable. Only write when needed; never read URL back into state.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        if (prev.get(PROFILE_LENS_SHARE_PARAM) === lens) return prev
        const params = new URLSearchParams(prev)
        params.set(PROFILE_LENS_SHARE_PARAM, lens)
        return params
      },
      { replace: true },
    )
  }, [lens, setSearchParams])

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current)
      }
    }
  }, [])

  const setLens = useCallback(
    (next: ProfileLens) => {
      if (next === lens || fading) return
      setFading(true)
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current)
      }
      fadeTimerRef.current = window.setTimeout(() => {
        setLensState(next)
        setDisplayLens(next)
        setFading(false)
        fadeTimerRef.current = null
      }, FADE_MS)
    },
    [lens, fading],
  )

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href)
    url.searchParams.set(PROFILE_LENS_SHARE_PARAM, lens)
    return url.toString()
  }, [lens])

  const value = useMemo(
    () => ({
      lens,
      displayLens,
      fading,
      defaultLens: cmsDefault,
      setLens,
      shareUrl,
    }),
    [lens, displayLens, fading, cmsDefault, setLens, shareUrl],
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
