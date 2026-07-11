import { Link, useParams } from 'react-router-dom'
import { AddSlot, EditableImageUrl, EditableText, ListItemControls } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditor, useEditorLink } from '../context/EditorContext'
import styles from './WorkDetail.module.css'

export function WorkDetail() {
  const { slug } = useParams()
  const { projects } = useContent()
  const editor = useEditor()
  const workIndex = projects.findIndex((item) => item.slug === slug)
  const project = workIndex >= 0 ? projects[workIndex] : undefined
  const workListTo = useEditorLink('/work')
  const contactTo = useEditorLink('/contact')

  if (!project || workIndex < 0) {
    return (
      <div className="section">
        <div className="container-narrow">
          <EditableText path="workPage.notFoundTitle" as="h1" />
          <p className={styles.missing}>
            <EditableText path="workPage.notFoundBody" as="span" />{' '}
            <Link to={workListTo}>
              <EditableText path="workPage.backToWork" as="span" />
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const base = `projects.${workIndex}`

  return (
    <div className="section">
      <div className="container-narrow">
        <Link to={workListTo} className={styles.back}>
          <EditableText path="workPage.backLabel" as="span" />
        </Link>
        <EditableText path={`${base}.category`} as="p" className={styles.cat} />
        <EditableText path={`${base}.title`} as="h1" className={`${styles.title} fade-up`} />
        <EditableText path={`${base}.tagline`} as="p" className={`${styles.tagline} fade-up-delay`} />
        {editor ? (
          <p className={styles.slugRow}>
            <span className={styles.slugLabel}>Slug</span>
            <EditableText path={`${base}.slug`} as="span" />
          </p>
        ) : null}

        <div className={styles.heroImage}>
          <EditableImageUrl path={`${base}.image`} />
        </div>

        <div className={styles.body}>
          <section>
            <EditableText path="workPage.overview" as="h2" />
            <EditableText path={`${base}.summary`} as="p" multiline />
          </section>

          <section>
            <EditableText path="workPage.problem" as="h2" />
            <EditableText path={`${base}.problem`} as="p" multiline />
          </section>

          <section>
            <EditableText path="workPage.approach" as="h2" />
            <EditableText path={`${base}.approach`} as="p" multiline />
          </section>

          <section>
            <EditableText path="workPage.impact" as="h2" />
            <EditableText path={`${base}.impact`} as="p" multiline />
          </section>

          <section>
            <EditableText path="workPage.highlights" as="h2" />
            <ul>
              {project.highlights.map((_, index) => (
                <ListItemControls key={index} arrayPath={`${base}.highlights`} index={index}>
                  <li>
                    <EditableText path={`${base}.highlights.${index}`} as="span" />
                  </li>
                </ListItemControls>
              ))}
            </ul>
            {editor ? (
              <AddSlot
                label="Add highlight"
                variant="inline"
                onAdd={() => editor.appendItem(`${base}.highlights`, 'New highlight')}
              />
            ) : null}
          </section>

          <section>
            <EditableText path="workPage.tools" as="h2" />
            <div className={styles.tools}>
              {project.tools.map((_, index) => (
                <ListItemControls key={index} arrayPath={`${base}.tools`} index={index} layout="inline">
                  <EditableText path={`${base}.tools.${index}`} as="span" />
                </ListItemControls>
              ))}
              {editor ? (
                <AddSlot
                  label="Add tool"
                  variant="inline"
                  onAdd={() => editor.appendItem(`${base}.tools`, 'New tool')}
                />
              ) : null}
            </div>
          </section>
        </div>

        <div className={styles.footerNav}>
          {project.externalUrl ? (
            <a className="btn btn-ghost" href={project.externalUrl} target="_blank" rel="noreferrer">
              <EditableText path={`${base}.externalLabel`} as="span" />
            </a>
          ) : null}
          <Link className="btn btn-ghost" to={workListTo}>
            <EditableText path="workPage.moreProjects" as="span" />
          </Link>
          <Link className="btn" to={contactTo}>
            <EditableText path="workPage.discuss" as="span" />
          </Link>
        </div>
      </div>
    </div>
  )
}
