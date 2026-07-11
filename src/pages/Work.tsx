import { Link, useNavigate } from 'react-router-dom'
import { ProfileLensToggle } from '../components/ProfileLensToggle'
import { AddSlot, EditableImageUrl, EditableText, ListItemControls } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditMode, useEditor, useEditorLink } from '../context/EditorContext'
import {
  isDataCategory,
  isDesignCategory,
  useProfileLens,
} from '../context/ProfileLensContext'
import styles from './Work.module.css'

function WorkCard({ index, slug }: { index: number; slug: string }) {
  const to = useEditorLink(`/work/${slug}`)
  const editing = useEditMode()
  return (
    <ListItemControls arrayPath="projects" index={index}>
      <article className={styles.card}>
        <div className={styles.thumb}>
          <EditableImageUrl path={`projects.${index}.image`} />
          <EditableText path={`projects.${index}.category`} as="span" />
        </div>
        {editing ? (
          <div className={styles.body}>
            <EditableText path={`projects.${index}.title`} as="h2" />
            <EditableText path={`projects.${index}.tagline`} as="p" className={styles.tagline} />
            <EditableText path={`projects.${index}.slug`} as="p" className={styles.slugField} />
            <EditableText path="workPage.caseStudyCta" as="span" className={styles.cta} />
          </div>
        ) : (
          <Link to={to} className={styles.body}>
            <EditableText path={`projects.${index}.title`} as="h2" />
            <EditableText path={`projects.${index}.tagline`} as="p" className={styles.tagline} />
            <EditableText path="workPage.caseStudyCta" as="span" className={styles.cta} />
          </Link>
        )}
      </article>
    </ListItemControls>
  )
}

export function Work() {
  const { projects } = useContent()
  const editor = useEditor()
  const navigate = useNavigate()
  const { displayLens, fading } = useProfileLens()
  const panelClass = fading ? `${styles.lensPanel} ${styles.lensPanelFading}` : styles.lensPanel

  const visibleIndexes = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => {
      if (displayLens === 'design') return isDesignCategory(project.category)
      return isDataCategory(project.category)
    })

  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <EditableText path="workPage.title" as="h1" className={`${styles.title} fade-up`} />
          <ProfileLensToggle />
        </div>

        <div className={panelClass} aria-busy={fading}>
          <div className={styles.header}>
            {displayLens === 'design' ? (
              <EditableText
                path="workPage.leadDesign"
                as="p"
                className={`${styles.lead} fade-up-delay`}
                multiline
              />
            ) : (
              <EditableText
                path="workPage.lead"
                as="p"
                className={`${styles.lead} fade-up-delay`}
                multiline
              />
            )}
          </div>

          <div className={styles.grid}>
            {visibleIndexes.map(({ project, index }) => (
              <WorkCard key={project.slug} index={index} slug={project.slug} />
            ))}
            {editor ? (
              <AddSlot
                label="Add project"
                onAdd={() => {
                  const slug = editor.addProject()
                  navigate(`/admin/work/${slug}`)
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
