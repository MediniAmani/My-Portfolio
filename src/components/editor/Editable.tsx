import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { resolveMediaUrl, uploadImage } from '../../api/client'
import { useContent } from '../../context/ContentContext'
import { useEditMode, useEditor } from '../../context/EditorContext'
import { getAt } from '../../lib/pathUtils'
import { getToken } from '../../pages/admin/authStorage'
import styles from './Editable.module.css'

type EditableTextProps = {
  path: string
  as?: ElementType
  className?: string
  multiline?: boolean
}

export function EditableText({ path, as: Tag = 'span', className, multiline = false }: EditableTextProps) {
  const content = useContent()
  const editing = useEditMode()
  const editor = useEditor()
  const value = String(getAt(content, path) ?? '')
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active || !ref.current) return
    ref.current.textContent = value
    ref.current.focus()
  }, [active, value])

  if (!editing || !editor) {
    return <Tag className={className}>{value}</Tag>
  }

  return (
    <Tag
      ref={ref as never}
      className={`${className ?? ''} ${styles.editable} ${active ? styles.active : ''}`.trim()}
      contentEditable={active}
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setActive(true)
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const next = event.currentTarget.textContent ?? ''
        setActive(false)
        if (next !== value) {
          editor.setPath(path, next)
        }
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && event.key === 'Enter') {
          event.preventDefault()
          event.currentTarget.blur()
        }
        if (event.key === 'Escape') {
          event.currentTarget.textContent = value
          event.currentTarget.blur()
        }
      }}
    >
      {active ? null : value}
    </Tag>
  )
}

type EditableImageUrlProps = {
  path: string
  className?: string
  alt?: string
  /** Rendered when the path value is empty (e.g. CSS feature mockups). */
  placeholder?: ReactNode
  allowClear?: boolean
}

export function EditableImageUrl({
  path,
  className,
  alt = '',
  placeholder,
  allowClear = false,
}: EditableImageUrlProps) {
  const content = useContent()
  const editing = useEditMode()
  const editor = useEditor()
  const value = String(getAt(content, path) ?? '')
  const src = value ? resolveMediaUrl(value) : ''
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  async function handleFile(file: File) {
    if (!editor) return
    const token = getToken()
    if (!token) {
      setUploadError('Not authenticated')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadImage(token, file)
      editor.setPath(path, url)
      setOpen(false)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!editing || !editor) {
    if (!value) {
      return <>{placeholder}</>
    }
    return <img src={src} alt={alt} className={className} />
  }

  return (
    <span className={`${styles.imageWrap} ${!value ? styles.imageWrapEmpty : ''}`.trim()}>
      {value ? (
        <img src={src} alt={alt} className={`${className ?? ''} ${styles.editableImg}`.trim()} />
      ) : (
        <span className={styles.placeholderHost}>{placeholder}</span>
      )}
      <span className={styles.imageActions}>
        <button
          type="button"
          className={styles.imageBtn}
          disabled={uploading}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            fileRef.current?.click()
          }}
        >
          {uploading ? 'Uploading…' : value ? 'Upload' : 'Upload image'}
        </button>
        <button
          type="button"
          className={styles.imageBtn}
          disabled={uploading}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setOpen((v) => !v)
          }}
        >
          URL
        </button>
        {allowClear && value ? (
          <button
            type="button"
            className={styles.imageBtn}
            disabled={uploading}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              editor.setPath(path, '')
              setOpen(false)
            }}
          >
            Clear
          </button>
        ) : null}
      </span>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className={styles.fileInput}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void handleFile(file)
        }}
      />
      {open ? (
        <span className={styles.popover}>
          <input
            value={draft}
            placeholder="/images/… or https://…"
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              editor.setPath(path, draft)
              setOpen(false)
            }}
          >
            Apply
          </button>
        </span>
      ) : null}
      {uploadError ? <span className={styles.uploadError}>{uploadError}</span> : null}
    </span>
  )
}

type ListControlsProps = {
  arrayPath: string
  index: number
  children: ReactNode
  className?: string
  /** overlay = absolute on card; inline = beside chip/text (won't cover label) */
  layout?: 'overlay' | 'inline'
}

export function ListItemControls({
  arrayPath,
  index,
  children,
  className,
  layout = 'overlay',
}: ListControlsProps) {
  const editing = useEditMode()
  const editor = useEditor()

  if (!editing || !editor) {
    return <>{children}</>
  }

  return (
    <div
      className={`${styles.listItem} ${layout === 'inline' ? styles.listItemInline : ''} ${className ?? ''}`.trim()}
    >
      {children}
      <div className={styles.listActions}>
        <button type="button" onClick={() => editor.moveItem(arrayPath, index, -1)} aria-label="Move up">
          ↑
        </button>
        <button type="button" onClick={() => editor.moveItem(arrayPath, index, 1)} aria-label="Move down">
          ↓
        </button>
        <button type="button" onClick={() => editor.removeAt(arrayPath, index)} aria-label="Delete">
          Delete
        </button>
      </div>
    </div>
  )
}

type AddSlotProps = {
  label: string
  onAdd: () => void
  className?: string
  variant?: 'card' | 'inline'
}

export function AddSlot({ label, onAdd, className, variant = 'card' }: AddSlotProps) {
  const editing = useEditMode()
  if (!editing) return null

  return (
    <button
      type="button"
      className={`${styles.addSlot} ${variant === 'inline' ? styles.addSlotInline : ''} ${className ?? ''}`.trim()}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onAdd()
      }}
    >
      <span className={styles.addPlus} aria-hidden="true">
        +
      </span>
      <span>{label}</span>
    </button>
  )
}
