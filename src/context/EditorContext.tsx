import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { saveContent } from '../api/client'
import type { PortfolioContent, Project } from '../data/types'
import { getAt, setAt, slugify } from '../lib/pathUtils'
import { getToken } from '../pages/admin/authStorage'
import { ContentContext, useContentActions, isPortfolioContent } from './ContentContext'
import { fetchContent } from '../api/client'

type EditorContextValue = {
  editMode: true
  dirty: boolean
  saving: boolean
  status: string | null
  error: string | null
  setPath: (path: string, value: unknown) => void
  getPath: (path: string) => unknown
  save: () => Promise<void>
  discard: () => Promise<void>
  addProject: () => string
  addNowItem: () => void
  addExperience: () => void
  addDesignExperience: () => void
  addWorkProcessStep: () => void
  addTechnicalSkill: () => void
  addSoftSkill: () => void
  addTrait: () => void
  addAward: () => void
  addTimelineItem: () => void
  addSpeaking: () => void
  addCertification: () => void
  addHighlight: () => void
  addAudience: () => void
  addChip: () => void
  appendItem: (arrayPath: string, value: unknown) => void
  removeAt: (arrayPath: string, index: number) => void
  moveItem: (arrayPath: string, index: number, direction: -1 | 1) => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

function cloneContent(content: PortfolioContent): PortfolioContent {
  return structuredClone(content)
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const parent = useContext(ContentContext)
  if (!parent) {
    throw new Error('EditorProvider must be used within ContentProvider')
  }

  const { reload: reloadParent } = useContentActions()
  const [draft, setDraft] = useState<PortfolioContent>(() => cloneContent(parent.content))
  const [baseline, setBaseline] = useState(() => JSON.stringify(parent.content))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(cloneContent(parent.content))
    setBaseline(JSON.stringify(parent.content))
    setStatus(null)
    setError(null)
  }, [parent.content])

  const dirty = useMemo(() => JSON.stringify(draft) !== baseline, [draft, baseline])

  const setPath = useCallback((path: string, value: unknown) => {
    setDraft((prev) => setAt(prev, path, value))
    setStatus(null)
    setError(null)
  }, [])

  const getPath = useCallback((path: string) => getAt(draft, path), [draft])

  const discard = useCallback(async () => {
    const data = await fetchContent()
    if (!isPortfolioContent(data)) {
      throw new Error('API returned unexpected content shape')
    }
    setDraft(cloneContent(data))
    setBaseline(JSON.stringify(data))
    await reloadParent()
    setStatus('Discarded local changes')
    setError(null)
  }, [reloadParent])

  const save = useCallback(async () => {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      const saved = await saveContent(token, draft)
      if (!isPortfolioContent(saved)) {
        throw new Error('Save response had unexpected shape')
      }
      setDraft(cloneContent(saved))
      setBaseline(JSON.stringify(saved))
      await reloadParent()
      setStatus('Saved')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      throw err
    } finally {
      setSaving(false)
    }
  }, [draft, reloadParent])

  const removeAt = useCallback((arrayPath: string, index: number) => {
    setDraft((prev) => {
      const list = getAt(prev, arrayPath)
      if (!Array.isArray(list)) {
        throw new Error(`${arrayPath} is not an array`)
      }
      const next = list.filter((_, i) => i !== index)
      return setAt(prev, arrayPath, next)
    })
  }, [])

  const moveItem = useCallback((arrayPath: string, index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const list = getAt(prev, arrayPath)
      if (!Array.isArray(list)) {
        throw new Error(`${arrayPath} is not an array`)
      }
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      const next = [...list]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return setAt(prev, arrayPath, next)
    })
  }, [])

  const addProject = useCallback(() => {
    const title = 'New project'
    let slug = slugify(title)
    const existing = new Set(draft.projects.map((p) => p.slug))
    let n = 1
    while (existing.has(slug)) {
      slug = `${slugify(title)}-${n}`
      n += 1
    }
    const project: Project = {
      slug,
      title,
      tagline: 'Short tagline',
      category: 'Data analysis',
      summary: 'Project summary',
      problem: 'What was unclear or broken?',
      approach: 'What did you do?',
      impact: 'What changed as a result?',
      highlights: ['Highlight one'],
      tools: ['SQL'],
      image: '/images/project-retail.jpg',
      externalUrl: '',
      externalLabel: '',
    }
    setDraft((prev) => setAt(prev, 'projects', [...prev.projects, project]))
    return slug
  }, [draft.projects])

  const addNowItem = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'nowItems', [...prev.nowItems, { title: 'New focus', body: 'Describe what you are doing now.' }]),
    )
  }, [])

  const addExperience = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'experience', [
        ...prev.experience,
        {
          company: 'Company',
          title: 'Role title',
          dates: 'YYYY - YYYY',
          bullets: ['What you delivered'],
        },
      ]),
    )
  }, [])

  const addDesignExperience = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'designExperience', [
        ...prev.designExperience,
        {
          company: 'Client',
          title: 'Independent UX designer',
          dates: 'YYYY - YYYY',
          bullets: ['What you designed'],
        },
      ]),
    )
  }, [])

  const addWorkProcessStep = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'workProcess', [
        ...prev.workProcess,
        {
          title: 'New step',
          body: 'Describe this step in your UX process.',
        },
      ]),
    )
  }, [])

  const addTechnicalSkill = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'skills.technical', [...prev.skills.technical, 'New skill']),
    )
  }, [])

  const addSoftSkill = useCallback(() => {
    setDraft((prev) => setAt(prev, 'skills.soft', [...prev.skills.soft, 'New soft skill']))
  }, [])

  const addTrait = useCallback(() => {
    setDraft((prev) => setAt(prev, 'traits', [...prev.traits, 'New trait']))
  }, [])

  const addAward = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'awards', [...prev.awards, { title: 'New award', detail: 'Details' }]),
    )
  }, [])

  const addTimelineItem = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'timeline', [...prev.timeline, { year: String(new Date().getFullYear()), text: 'What happened' }]),
    )
  }, [])

  const addSpeaking = useCallback(() => {
    setDraft((prev) => setAt(prev, 'speaking', [...prev.speaking, 'New speaking credit']))
  }, [])

  const addCertification = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'certifications', [...prev.certifications, 'New certification']),
    )
  }, [])

  const addHighlight = useCallback(() => {
    const first = draft.projects[0]
    setDraft((prev) =>
      setAt(prev, 'highlights', [
        ...prev.highlights,
        {
          slug: first?.slug ?? 'new-highlight',
          title: 'New highlight',
          meta: 'Meta',
          image: first?.image ?? '/images/guide-1.jpg',
        },
      ]),
    )
  }, [draft.projects])

  const addAudience = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'home.rotatingAudiences', [...prev.home.rotatingAudiences, 'New audience']),
    )
  }, [])

  const addChip = useCallback(() => {
    setDraft((prev) =>
      setAt(prev, 'home.communityCard.chips', [...prev.home.communityCard.chips, 'New tag']),
    )
  }, [])

  const appendItem = useCallback((arrayPath: string, value: unknown) => {
    setDraft((prev) => {
      const list = getAt(prev, arrayPath)
      if (!Array.isArray(list)) {
        throw new Error(`${arrayPath} is not an array`)
      }
      return setAt(prev, arrayPath, [...list, value])
    })
  }, [])

  const editorValue = useMemo<EditorContextValue>(
    () => ({
      editMode: true,
      dirty,
      saving,
      status,
      error,
      setPath,
      getPath,
      save,
      discard,
      addProject,
      addNowItem,
      addExperience,
      addDesignExperience,
      addWorkProcessStep,
      addTechnicalSkill,
      addSoftSkill,
      addTrait,
      addAward,
      addTimelineItem,
      addSpeaking,
      addCertification,
      addHighlight,
      addAudience,
      addChip,
      appendItem,
      removeAt,
      moveItem,
    }),
    [
      dirty,
      saving,
      status,
      error,
      setPath,
      getPath,
      save,
      discard,
      addProject,
      addNowItem,
      addExperience,
      addDesignExperience,
      addWorkProcessStep,
      addTechnicalSkill,
      addSoftSkill,
      addTrait,
      addAward,
      addTimelineItem,
      addSpeaking,
      addCertification,
      addHighlight,
      addAudience,
      addChip,
      appendItem,
      removeAt,
      moveItem,
    ],
  )

  const contentValue = useMemo(
    () => ({
      content: draft,
      reload: discard,
    }),
    [draft, discard],
  )

  return (
    <ContentContext.Provider value={contentValue}>
      <EditorContext.Provider value={editorValue}>{children}</EditorContext.Provider>
    </ContentContext.Provider>
  )
}

export function useEditor(): EditorContextValue | null {
  return useContext(EditorContext)
}

export function useEditMode(): boolean {
  return useContext(EditorContext)?.editMode === true
}

export function useEditorLink(path: string): string {
  const editing = useEditMode()
  if (!path.startsWith('/')) {
    throw new Error('useEditorLink expects an absolute path')
  }
  if (!editing) return path
  if (path === '/') return '/admin'
  return `/admin${path}`
}
