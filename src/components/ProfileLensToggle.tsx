import { useState } from 'react'
import { EditableText } from './editor/Editable'
import { useEditMode, useEditor } from '../context/EditorContext'
import { useProfileLens, type ProfileLens } from '../context/ProfileLensContext'
import styles from './ProfileLensToggle.module.css'

type Props = {
  className?: string
  /** Compact header control: no hint, denser track. */
  variant?: 'page' | 'header'
}

export function ProfileLensToggle({ className, variant = 'page' }: Props) {
  const { lens, setLens, fading, defaultLens, shareUrl } = useProfileLens()
  const editing = useEditMode()
  const editor = useEditor()
  const [copied, setCopied] = useState(false)

  function choose(next: ProfileLens) {
    setLens(next)
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function saveAsDefault() {
    if (!editor) {
      throw new Error('Editor is required to set the default profile lens')
    }
    editor.setPath('profileLens.defaultLens', lens)
  }

  return (
    <div
      className={[styles.wrap, variant === 'header' ? styles.wrapHeader : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {variant === 'page' ? (
        <EditableText path="profileLens.hint" as="p" className={styles.hint} />
      ) : (
        <span className="sr-only">
          <EditableText path="profileLens.hint" as="span" />
        </span>
      )}
      <div
        className={`${styles.track} ${variant === 'header' ? styles.trackHeader : ''}`}
        role="tablist"
        aria-label="Profile lens"
        data-lens={lens}
        data-busy={fading ? 'true' : 'false'}
      >
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.thumb} aria-hidden="true" />
        <button
          type="button"
          role="tab"
          aria-selected={lens === 'data'}
          className={styles.option}
          disabled={fading}
          onClick={() => choose('data')}
        >
          <EditableText path="profileLens.dataLabel" as="span" />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lens === 'design'}
          className={styles.option}
          disabled={fading}
          onClick={() => choose('design')}
        >
          <EditableText path="profileLens.designLabel" as="span" />
        </button>
      </div>

      {editing && editor ? (
        <div className={styles.shareRow}>
          <button type="button" className={styles.shareBtn} onClick={() => void copyShareLink()}>
            {copied ? 'Link copied' : 'Copy profile link'}
          </button>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={saveAsDefault}
            title={`New visitors without a link currently open on ${defaultLens}`}
          >
            {defaultLens === lens ? `Default is ${lens}` : `Make ${lens} default`}
          </button>
        </div>
      ) : null}
    </div>
  )
}
