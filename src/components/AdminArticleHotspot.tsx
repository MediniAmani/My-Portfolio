import { useNavigate } from 'react-router-dom'
import { EditableText } from './editor/Editable'
import { useEditMode } from '../context/EditorContext'
import styles from './AdminArticleHotspot.module.css'

type Props = {
  /** Public site path, e.g. `/work/my-slug` or `/about`. */
  articlePath: string | null
  /** Optional CMS path for editing the related work slug on the banner. */
  relatedSlugPath?: string
  openLabel?: string
}

function toAdminPath(articlePath: string): string {
  if (articlePath.startsWith('/admin')) return articlePath
  if (articlePath === '/') return '/admin'
  return `/admin${articlePath}`
}

export function AdminArticleHotspot({
  articlePath,
  relatedSlugPath,
  openLabel = 'Open related article',
}: Props) {
  const editing = useEditMode()
  const navigate = useNavigate()

  if (!editing) return null

  const canOpen = Boolean(articlePath && articlePath.trim())
  const adminPath = canOpen && articlePath ? toAdminPath(articlePath) : null

  return (
        <div className={styles.hotspot} data-admin-hotspot aria-label="Admin article controls">
      <div className={styles.panel}>
        <p className={styles.hint}>Hover controls (admin)</p>
        {relatedSlugPath ? (
          <label className={styles.slugRow}>
            <span>Related article slug</span>
            <EditableText path={relatedSlugPath} as="span" className={styles.slugValue} />
          </label>
        ) : null}
        <button
          type="button"
          className={styles.openBtn}
          disabled={!adminPath}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (!adminPath) return
            navigate(adminPath)
          }}
        >
          {openLabel}
        </button>
      </div>
    </div>
  )
}
