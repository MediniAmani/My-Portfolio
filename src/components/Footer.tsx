import { Link } from 'react-router-dom'
import { EditableText } from './editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditorLink } from '../context/EditorContext'
import styles from './Footer.module.css'

export function Footer() {
  const { footer, site } = useContent()
  const aboutTo = useEditorLink('/about')
  const contactTo = useEditorLink('/contact')
  const workTo = useEditorLink('/work')
  const homeTo = useEditorLink('/')

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.thanks}`}>
        {footer.thanks.map((_, index) => (
          <EditableText key={index} path={`footer.thanks.${index}`} as="p" />
        ))}
        <EditableText path="footer.sign" as="p" className={styles.sign} />
      </div>

      <div className={`container ${styles.grid}`}>
        <Link to={homeTo} className={styles.logo} aria-label="Home">
          <EditableText path="footer.monogram" as="span" />
        </Link>

        <div>
          <EditableText path="footer.hello.title" as="p" className={styles.colTitle} />
          <div className={styles.col}>
            <Link to={aboutTo}>
              <EditableText path="footer.hello.about" as="span" />
            </Link>
            <Link to={contactTo}>
              <EditableText path="footer.hello.contact" as="span" />
            </Link>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              <EditableText path="footer.hello.linkedin" as="span" />
            </a>
            <a href={site.fofUrl} target="_blank" rel="noreferrer">
              <EditableText path="footer.hello.fof" as="span" />
            </a>
            <a href={`mailto:${site.email}`}>
              <EditableText path="footer.hello.email" as="span" />
            </a>
          </div>
        </div>

        <div>
          <EditableText path="footer.focus.title" as="p" className={styles.colTitle} />
          <div className={styles.col}>
            {footer.focus.items.map((_, index) => (
              <EditableText key={index} path={`footer.focus.items.${index}`} as="span" />
            ))}
          </div>
        </div>

        <div>
          <EditableText path="footer.resources.title" as="p" className={styles.colTitle} />
          <div className={styles.col}>
            <a href={site.cvEn} download>
              <EditableText path="footer.resources.cvEn" as="span" />
            </a>
            <a href={site.cvFr} download>
              <EditableText path="footer.resources.cvFr" as="span" />
            </a>
            <Link to={workTo}>
              <EditableText path="footer.resources.allWork" as="span" />
            </Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {new Date().getFullYear()}{' '}
          <EditableText path="site.name" as="span" />
        </p>
        <div className={styles.socials}>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            <EditableText path="footer.socials.linkedin" as="span" />
          </a>
          <a href={site.fofUrl} target="_blank" rel="noreferrer">
            <EditableText path="footer.socials.fof" as="span" />
          </a>
          <a href={`mailto:${site.email}`}>
            <EditableText path="footer.socials.email" as="span" />
          </a>
        </div>
      </div>
    </footer>
  )
}
