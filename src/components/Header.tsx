import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { EditableText } from './editor/Editable'
import { ProfileLensToggle } from './ProfileLensToggle'
import { useContent } from '../context/ContentContext'
import { useEditMode, useEditorLink } from '../context/EditorContext'
import styles from './Header.module.css'

function EditorNavLink({
  to,
  className,
  children,
  onClick,
}: {
  to: string
  className?: string | ((args: { isActive: boolean }) => string)
  children: React.ReactNode
  onClick?: () => void
}) {
  const resolved = useEditorLink(to)
  return (
    <NavLink to={resolved} className={className} onClick={onClick}>
      {children}
    </NavLink>
  )
}

export function Header() {
  const { nav, site } = useContent()
  const editing = useEditMode()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const contactAlreadyLinked = nav.links.some((link) => link.to === '/contact')

  return (
    <header
      className={styles.header}
      style={editing ? { top: 'var(--editor-bar-h, 3.4rem)' } : undefined}
    >
      <div className={`container ${styles.inner}`}>
        <EditorNavLink to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <EditableText path="nav.monogram" as="span" className={styles.monogram} />
        </EditorNavLink>

        <div className={styles.centerControls}>
          <ProfileLensToggle variant="header" className={styles.lensDesktop} />
          <nav className={styles.pill} aria-label="Primary">
            {nav.links.map((link, index) => (
              <EditorNavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${styles.pillLink} ${isActive ? styles.active : ''}`}
              >
                <EditableText path={`nav.links.${index}.label`} as="span" />
              </EditorNavLink>
            ))}
            <a href={site.cvEn} className={styles.pillLink} download>
              <EditableText path="nav.cvEnLabel" as="span" />
            </a>
            <a href={site.cvFr} className={styles.pillLink} download>
              <EditableText path="nav.cvFrLabel" as="span" />
            </a>
            <a href={site.linkedin} className={styles.pillLink} target="_blank" rel="noreferrer">
              <EditableText path="nav.linkedinLabel" as="span" />
            </a>
            {!contactAlreadyLinked ? (
              <EditorNavLink to="/contact" className={styles.pillCta}>
                <EditableText path="nav.moreLabel" as="span" />
              </EditorNavLink>
            ) : null}
          </nav>
        </div>

        <div className={styles.rightControls}>
          <ProfileLensToggle variant="header" className={styles.lensMobile} />
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className={`${styles.burger} ${open ? styles.burgerOpen : ''}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
        onClick={() => setOpen(false)}
      >
        <div className={styles.mobilePanel} onClick={(event) => event.stopPropagation()}>
          <EditorNavLink to="/" onClick={() => setOpen(false)}>
            <EditableText path="nav.homeLabel" as="span" />
          </EditorNavLink>
          {nav.links.map((link, index) => (
            <EditorNavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              <EditableText path={`nav.links.${index}.label`} as="span" />
            </EditorNavLink>
          ))}
          <a href={site.cvEn} download onClick={() => setOpen(false)}>
            <EditableText path="nav.cvEnLabel" as="span" />
          </a>
          <a href={site.cvFr} download onClick={() => setOpen(false)}>
            <EditableText path="nav.cvFrLabel" as="span" />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <EditableText path="nav.linkedinLabel" as="span" />
          </a>
          {!contactAlreadyLinked ? (
            <EditorNavLink to="/contact" onClick={() => setOpen(false)}>
              <EditableText path="nav.moreLabel" as="span" />
            </EditorNavLink>
          ) : null}
        </div>
      </div>
    </header>
  )
}
