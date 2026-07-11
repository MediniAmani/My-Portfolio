import { EditableText, ListItemControls, AddSlot } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditor } from '../context/EditorContext'
import styles from './About.module.css'

export function About() {
  const { nowItems, experience, awards, timeline, speaking, certifications, site } = useContent()
  const editor = useEditor()

  return (
    <div className="section">
      <div className="container-narrow">
        <EditableText path="aboutPage.title" as="h1" className={`${styles.title} fade-up`} />
        <EditableText path="aboutPage.bio" as="p" className={`${styles.bio} fade-up-delay`} multiline />

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.now" as="h2" />
          <div className={styles.nowGrid}>
            {nowItems.map((_, index) => (
              <ListItemControls key={index} arrayPath="nowItems" index={index}>
                <article className={styles.nowItem}>
                  <EditableText path={`nowItems.${index}.title`} as="h3" />
                  <EditableText path={`nowItems.${index}.body`} as="p" multiline />
                </article>
              </ListItemControls>
            ))}
            {editor ? <AddSlot label="Add now item" onAdd={() => editor.addNowItem()} /> : null}
          </div>
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.experience" as="h2" />
          <div className={styles.experienceList}>
            {experience.map((_, index) => (
              <ListItemControls key={index} arrayPath="experience" index={index}>
                <article className={styles.experienceItem}>
                  <div className={styles.experienceHead}>
                    <EditableText path={`experience.${index}.title`} as="h3" />
                    <EditableText path={`experience.${index}.dates`} as="span" className={styles.experienceDates} />
                  </div>
                  <EditableText path={`experience.${index}.company`} as="p" className={styles.experienceCompany} />
                  <ul className={styles.experienceBullets}>
                    {experience[index].bullets.map((_, bulletIndex) => (
                      <ListItemControls
                        key={bulletIndex}
                        arrayPath={`experience.${index}.bullets`}
                        index={bulletIndex}
                        layout="inline"
                      >
                        <li>
                          <EditableText path={`experience.${index}.bullets.${bulletIndex}`} as="span" />
                        </li>
                      </ListItemControls>
                    ))}
                  </ul>
                  {editor ? (
                    <AddSlot
                      label="Add bullet"
                      variant="inline"
                      onAdd={() => editor.appendItem(`experience.${index}.bullets`, 'New responsibility')}
                    />
                  ) : null}
                </article>
              </ListItemControls>
            ))}
            {editor ? (
              <AddSlot label="Add experience" onAdd={() => editor.addExperience()} />
            ) : null}
          </div>
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.awards" as="h2" />
          <ul className={styles.list}>
            {awards.map((_, index) => (
              <ListItemControls key={index} arrayPath="awards" index={index}>
                <li>
                  <EditableText path={`awards.${index}.title`} as="strong" />
                  <EditableText path={`awards.${index}.detail`} as="span" />
                </li>
              </ListItemControls>
            ))}
          </ul>
          {editor ? (
            <AddSlot label="Add award" variant="inline" onAdd={() => editor.addAward()} />
          ) : null}
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.timeline" as="h2" />
          <ol className={styles.timeline}>
            {timeline.map((_, index) => (
              <ListItemControls key={index} arrayPath="timeline" index={index}>
                <li>
                  <EditableText path={`timeline.${index}.year`} as="span" className={styles.year} />
                  <EditableText path={`timeline.${index}.text`} as="p" multiline />
                </li>
              </ListItemControls>
            ))}
          </ol>
          {editor ? (
            <AddSlot label="Add timeline entry" variant="inline" onAdd={() => editor.addTimelineItem()} />
          ) : null}
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.speaking" as="h2" />
          <ul className={styles.list}>
            {speaking.map((_, index) => (
              <ListItemControls key={index} arrayPath="speaking" index={index} layout="inline">
                <li>
                  <EditableText path={`speaking.${index}`} as="span" />
                </li>
              </ListItemControls>
            ))}
          </ul>
          {editor ? (
            <AddSlot label="Add speaking" variant="inline" onAdd={() => editor.addSpeaking()} />
          ) : null}
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.certifications" as="h2" />
          <ul className={styles.list}>
            {certifications.map((_, index) => (
              <ListItemControls key={index} arrayPath="certifications" index={index} layout="inline">
                <li>
                  <EditableText path={`certifications.${index}`} as="span" />
                </li>
              </ListItemControls>
            ))}
          </ul>
          {editor ? (
            <AddSlot
              label="Add certification"
              variant="inline"
              onAdd={() => editor.addCertification()}
            />
          ) : null}
        </section>

        <section className={styles.block}>
          <EditableText path="aboutPage.sections.findMe" as="h2" />
          <p className={styles.find}>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              <EditableText path="aboutPage.linkedinLabel" as="span" />
            </a>
            <span aria-hidden="true"> · </span>
            <a href={site.fofUrl} target="_blank" rel="noreferrer">
              <EditableText path="aboutPage.fofLabel" as="span" />
            </a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${site.email}`}>
              <EditableText path="site.email" as="span" />
            </a>
            <span aria-hidden="true"> · </span>
            <EditableText path="site.location" as="span" />
          </p>
        </section>
      </div>
    </div>
  )
}
