import { Link, useNavigate } from 'react-router-dom'
import { AddSlot, EditableImageUrl, EditableText, ListItemControls } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditMode, useEditor, useEditorLink } from '../context/EditorContext'
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

  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <EditableText path="workPage.title" as="h1" className={`${styles.title} fade-up`} />
          <EditableText path="workPage.lead" as="p" className={`${styles.lead} fade-up-delay`} multiline />
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
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
  )
}
