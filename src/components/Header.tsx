import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { nav } from '../data/content'
import styles from './Header.module.css'

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.logo} onClick={() => setOpen(false)} aria-label="Home">
          <span className={styles.monogram}>{nav.monogram}</span>
        </NavLink>

        <nav className={styles.pill} aria-label="Primary">
          {nav.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.pillLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className={styles.pillCta}>
            {nav.moreLabel}
          </NavLink>
        </nav>

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

      <div
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
      >
        <div className={styles.mobilePanel}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            {nav.homeLabel}
          </NavLink>
          {nav.links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}
