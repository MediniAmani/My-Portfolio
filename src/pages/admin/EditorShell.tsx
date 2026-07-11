import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useEditor } from '../../context/EditorContext'
import { clearToken, getToken } from './authStorage'
import styles from './EditorShell.module.css'

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = getToken()
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export function EditorShell() {
  const editor = useEditor()
  const location = useLocation()
  const navigate = useNavigate()
  const [addOpen, setAddOpen] = useState(false)
  const addWrapRef = useRef<HTMLDivElement>(null)

  if (!editor) {
    throw new Error('EditorShell requires EditorProvider')
  }

  const activeEditor = editor

  useEffect(() => {
    if (!addOpen) return
    function onPointer(event: MouseEvent) {
      if (!addWrapRef.current?.contains(event.target as Node)) {
        setAddOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setAddOpen(false)
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [addOpen])

  async function handleSave() {
    try {
      await activeEditor.save()
    } catch {
      // error surfaced on editor.error
    }
  }

  async function handleDiscard() {
    if (activeEditor.dirty) {
      const ok = window.confirm('Discard all unsaved changes?')
      if (!ok) return
    }
    await activeEditor.discard()
  }

  function handleLogout() {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  function onAboutPath() {
    return location.pathname.startsWith('/admin/about')
  }

  function onWorkishPath() {
    return (
      location.pathname === '/admin' ||
      location.pathname === '/admin/' ||
      location.pathname.startsWith('/admin/work')
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.left}>
          <strong>Live editor</strong>
          <span className={styles.meta}>
            {editor.dirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
          {editor.status ? <span className={styles.status}>{editor.status}</span> : null}
          {editor.error ? <span className={styles.error}>{editor.error}</span> : null}
        </div>
        <div className={styles.actions}>
          <div className={styles.addWrap} ref={addWrapRef}>
            <button type="button" className={styles.btnGhost} onClick={() => setAddOpen((v) => !v)}>
              Add
            </button>
            {addOpen ? (
              <div className={styles.addMenu}>
                {onWorkishPath() ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const slug = editor.addProject()
                        setAddOpen(false)
                        navigate(`/admin/work/${slug}`)
                      }}
                    >
                      Project
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addHighlight()
                        setAddOpen(false)
                      }}
                    >
                      Highlight
                    </button>
                  </>
                ) : null}
                {onAboutPath() ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addNowItem()
                        setAddOpen(false)
                      }}
                    >
                      Now item
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addExperience()
                        setAddOpen(false)
                      }}
                    >
                      Experience
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addAward()
                        setAddOpen(false)
                      }}
                    >
                      Award
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addTimelineItem()
                        setAddOpen(false)
                      }}
                    >
                      Timeline entry
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addSpeaking()
                        setAddOpen(false)
                      }}
                    >
                      Speaking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.addCertification()
                        setAddOpen(false)
                      }}
                    >
                      Certification
                    </button>
                  </>
                ) : null}
                {!onWorkishPath() && !onAboutPath() ? (
                  <p className={styles.hint}>Open Home/Work or About to add items.</p>
                ) : null}
              </div>
            ) : null}
          </div>
          <button type="button" className={styles.btnGhost} onClick={handleDiscard} disabled={editor.saving}>
            Discard
          </button>
          <button type="button" className={styles.btn} onClick={handleSave} disabled={editor.saving || !editor.dirty}>
            {editor.saving ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className={styles.btnGhost} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
