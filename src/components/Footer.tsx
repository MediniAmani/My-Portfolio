import { Link } from 'react-router-dom'
import { footer, site } from '../data/content'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.thanks}`}>
        {footer.thanks.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className={styles.sign}>{footer.sign}</p>
      </div>

      <div className={`container ${styles.grid}`}>
        <Link to="/" className={styles.logo} aria-label="Home">
          {footer.monogram}
        </Link>

        <div>
          <p className={styles.colTitle}>{footer.hello.title}</p>
          <div className={styles.col}>
            <Link to="/about">{footer.hello.about}</Link>
            <Link to="/contact">{footer.hello.contact}</Link>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              {footer.hello.linkedin}
            </a>
            <a href={`mailto:${site.email}`}>{footer.hello.email}</a>
          </div>
        </div>

        <div>
          <p className={styles.colTitle}>{footer.focus.title}</p>
          <div className={styles.col}>
            {footer.focus.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div>
          <p className={styles.colTitle}>{footer.resources.title}</p>
          <div className={styles.col}>
            <a href={site.cvEn} download>
              {footer.resources.cvPdf}
            </a>
            <a href={site.cvEnDocx} download>
              {footer.resources.cvWordEn}
            </a>
            <a href={site.cvFrDocx} download>
              {footer.resources.cvWordFr}
            </a>
            <Link to="/work">{footer.resources.allWork}</Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className={styles.socials}>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            {footer.socials.linkedin}
          </a>
          <a href={`mailto:${site.email}`}>{footer.socials.email}</a>
        </div>
      </div>
    </footer>
  )
}
