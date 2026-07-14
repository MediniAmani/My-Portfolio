import { Link, useParams } from 'react-router-dom'
import { resolveMediaUrl } from '../api/client'
import { AddSlot, EditableImageUrl, EditableText, ListItemControls } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditor, useEditorLink } from '../context/EditorContext'
import styles from './WorkDetail.module.css'

type TocItem = { id: string; label: string }

function splitParagraphs(body: string): string[] {
  // CMS/seed sometimes stores escaped newlines as the two characters "\n".
  const normalized = body.replace(/\\n/g, '\n')
  return normalized
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function renderParagraph(text: string, key: string) {
  const match = text.match(/^(PROBLEM|EXAMPLE|IMPACT|JOB TO BE DONE)\s+[—-]\s+([\s\S]+)$/i)
  if (!match) {
    return <p key={key}>{text}</p>
  }
  return (
    <p key={key}>
      <span className={styles.beatLabel}>{match[1]}</span>
      {match[2]}
    </p>
  )
}

function shotClass(index: number, src = ''): string {
  if (src.includes('-strip') || src.includes('Strip')) {
    return styles.shotStrip
  }
  const variants = [styles.shotWide, styles.shotTiltLeft, styles.shotTiltRight, styles.shotBleed]
  return variants[index % variants.length]
}

export function WorkDetail() {
  const { slug } = useParams()
  const { projects, workPage } = useContent()
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
  const hasChapters = project.sections.length > 0
  const showMeta = Boolean(editor) || Boolean(project.timeline || project.platform || project.role)
  const showRole = Boolean(editor) || Boolean(project.role || project.roleBody)
  const showGoal = Boolean(editor) || Boolean(project.goal)
  const showMetrics = Boolean(editor) || project.metrics.length > 0
  const showSections = Boolean(editor) || hasChapters
  const showNextSteps = Boolean(editor) || Boolean(project.nextSteps)
  const showApproach = Boolean(editor) || (Boolean(project.approach) && !hasChapters)
  const showHighlights = Boolean(editor) || project.highlights.length > 0
  const showTools = Boolean(editor) || project.tools.length > 0

  const toc: TocItem[] = []
  toc.push({ id: 'overview', label: workPage.overview })
  if (showRole) toc.push({ id: 'role', label: workPage.role })
  toc.push({ id: 'problem', label: workPage.problem })
  if (showGoal) toc.push({ id: 'goal', label: workPage.goal })
  if (showApproach) toc.push({ id: 'approach', label: workPage.approach })
  toc.push({ id: 'impact', label: workPage.impact })
  for (const section of project.sections) {
    toc.push({ id: section.key, label: section.title })
  }
  if (showNextSteps) toc.push({ id: 'next-steps', label: workPage.nextSteps })

  return (
    <div className={`section ${styles.page}`}>
      <div className={styles.shell}>
        <Link to={workListTo} className={styles.back}>
          <EditableText path="workPage.backLabel" as="span" />
        </Link>

        <header className={styles.hero}>
          <EditableText path={`${base}.category`} as="p" className={styles.cat} />
          <EditableText path={`${base}.title`} as="h1" className={`${styles.title} fade-up`} />
          <EditableText path={`${base}.tagline`} as="p" className={`${styles.tagline} fade-up-delay`} />
          {editor ? (
            <p className={styles.slugRow}>
              <span className={styles.slugLabel}>Slug</span>
              <EditableText path={`${base}.slug`} as="span" />
            </p>
          ) : null}
        </header>

        <figure className={`${styles.heroShot} fade-up`}>
          <EditableImageUrl path={`${base}.image`} className={styles.heroImg} />
        </figure>

        {showMeta ? (
          <dl className={styles.metaRow}>
            <div className={styles.metaItem}>
              <dt>
                <EditableText path="workPage.timelineLabel" as="span" />
              </dt>
              <dd>
                <EditableText path={`${base}.timeline`} as="span" />
              </dd>
            </div>
            <div className={styles.metaItem}>
              <dt>
                <EditableText path="workPage.platformLabel" as="span" />
              </dt>
              <dd>
                <EditableText path={`${base}.platform`} as="span" />
              </dd>
            </div>
            <div className={styles.metaItem}>
              <dt>
                <EditableText path="workPage.roleLabel" as="span" />
              </dt>
              <dd>
                <EditableText path={`${base}.role`} as="span" />
              </dd>
            </div>
          </dl>
        ) : null}

        <div className={styles.layout}>
          <nav className={styles.toc} aria-label="Case study sections">
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
            {editor ? (
              <div className={styles.tocActions}>
                <AddSlot
                  label={workPage.addMetric}
                  variant="inline"
                  onAdd={() => editor.addCaseMetric(workIndex)}
                />
                <AddSlot
                  label={workPage.addSection}
                  variant="inline"
                  onAdd={() => editor.addCaseSection(workIndex)}
                />
              </div>
            ) : null}
          </nav>

          <div className={styles.body}>
            <section id="overview" className={styles.proseBlock}>
              <EditableText path="workPage.overview" as="h2" />
              <EditableText path={`${base}.summary`} as="p" multiline />
            </section>

            {showRole ? (
              <section id="role" className={styles.proseBlock}>
                <EditableText path="workPage.role" as="h2" />
                {editor || project.role ? (
                  <p className={styles.roleTitle}>
                    <EditableText path={`${base}.role`} as="span" />
                  </p>
                ) : null}
                <EditableText path={`${base}.roleBody`} as="p" multiline />
              </section>
            ) : null}

            <section id="problem" className={styles.proseBlock}>
              <EditableText path="workPage.problem" as="h2" />
              <EditableText path={`${base}.problem`} as="p" multiline />
            </section>

            {showGoal ? (
              <section id="goal" className={styles.proseBlock}>
                <EditableText path="workPage.goal" as="h2" />
                <EditableText path={`${base}.goal`} as="p" multiline />
              </section>
            ) : null}

            {showApproach ? (
              <section id="approach" className={styles.proseBlock}>
                <EditableText path="workPage.approach" as="h2" />
                <EditableText path={`${base}.approach`} as="p" multiline />
              </section>
            ) : null}

            <section id="impact" className={styles.proseBlock}>
              <EditableText path="workPage.impact" as="h2" />
              <EditableText path={`${base}.impact`} as="p" multiline />
              {showMetrics ? (
                <div className={styles.metrics}>
                  {project.metrics.map((_, index) => (
                    <ListItemControls key={index} arrayPath={`${base}.metrics`} index={index}>
                      <div className={styles.metric}>
                        <EditableText path={`${base}.metrics.${index}.value`} as="p" className={styles.metricValue} />
                        <EditableText path={`${base}.metrics.${index}.label`} as="p" className={styles.metricLabel} />
                        <EditableText path={`${base}.metrics.${index}.detail`} as="p" className={styles.metricDetail} />
                      </div>
                    </ListItemControls>
                  ))}
                  {editor ? (
                    <AddSlot
                      label={workPage.addMetric}
                      variant="inline"
                      onAdd={() => editor.addCaseMetric(workIndex)}
                    />
                  ) : null}
                </div>
              ) : null}
            </section>

            {showSections
              ? project.sections.map((section, sectionIndex) => {
                  const paragraphs = splitParagraphs(section.body)
                  const images = section.images
                  const steps = Math.max(paragraphs.length, images.length, 1)

                  return (
                    <section
                      key={section.key || sectionIndex}
                      id={section.key || `section-${sectionIndex}`}
                      className={styles.chapter}
                    >
                      {editor ? (
                        <div className={styles.sectionHead}>
                          <div className={styles.sectionTitleRow}>
                            <EditableText path={`${base}.sections.${sectionIndex}.title`} as="h2" />
                            <ListItemControls
                              arrayPath={`${base}.sections`}
                              index={sectionIndex}
                              layout="inline"
                            >
                              <span className={styles.sectionKey}>
                                <EditableText path={`${base}.sections.${sectionIndex}.key`} as="span" />
                              </span>
                            </ListItemControls>
                          </div>
                          <div
                            className={styles.layoutPicker}
                            role="group"
                            aria-label={workPage.sectionLayoutLabel}
                          >
                            <button
                              type="button"
                              className={
                                section.layout === 'stack'
                                  ? `${styles.layoutOption} ${styles.layoutOptionActive}`
                                  : styles.layoutOption
                              }
                              aria-pressed={section.layout === 'stack'}
                              onClick={() =>
                                editor.setPath(`${base}.sections.${sectionIndex}.layout`, 'stack')
                              }
                            >
                              {workPage.sectionLayoutStack}
                            </button>
                            <button
                              type="button"
                              className={
                                section.layout === 'split'
                                  ? `${styles.layoutOption} ${styles.layoutOptionActive}`
                                  : styles.layoutOption
                              }
                              aria-pressed={section.layout === 'split'}
                              onClick={() =>
                                editor.setPath(`${base}.sections.${sectionIndex}.layout`, 'split')
                              }
                            >
                              {workPage.sectionLayoutSplit}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <h2 className={styles.chapterTitle}>{section.title}</h2>
                      )}

                      {editor ? (
                        <>
                          <EditableText path={`${base}.sections.${sectionIndex}.body`} as="p" multiline />
                          <div className={styles.gallery}>
                            {images.map((image, imageIndex) => (
                              <ListItemControls
                                key={imageIndex}
                                arrayPath={`${base}.sections.${sectionIndex}.images`}
                                index={imageIndex}
                              >
                                <figure className={`${styles.shot} ${shotClass(imageIndex, image.src)}`}>
                                  {image.src ? (
                                    <EditableImageUrl
                                      path={`${base}.sections.${sectionIndex}.images.${imageIndex}.src`}
                                    />
                                  ) : null}
                                  <figcaption>
                                    <EditableText
                                      path={`${base}.sections.${sectionIndex}.images.${imageIndex}.caption`}
                                      as="span"
                                    />
                                    <span className={styles.altRow}>
                                      Alt:{' '}
                                      <EditableText
                                        path={`${base}.sections.${sectionIndex}.images.${imageIndex}.alt`}
                                        as="span"
                                      />
                                    </span>
                                  </figcaption>
                                </figure>
                              </ListItemControls>
                            ))}
                          </div>
                          <AddSlot
                            label={workPage.addSectionImage}
                            variant="inline"
                            onAdd={() => editor.addCaseSectionImage(workIndex, sectionIndex)}
                          />
                        </>
                      ) : (
                        Array.from({ length: steps }, (_, step) => {
                          const paragraph = paragraphs[step]
                          const image = images[step]
                          const useSplit =
                            section.layout === 'split' && Boolean(paragraph) && Boolean(image)

                          if (useSplit && image && paragraph) {
                            return (
                              <div key={step} className={styles.beatSplit}>
                                <figure className={`${styles.shot} ${styles.shotSplit}`}>
                                  <img src={resolveMediaUrl(image.src)} alt={image.alt} />
                                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                                </figure>
                                <div className={styles.beatCopy}>
                                  {renderParagraph(paragraph, `p-${step}`)}
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div key={step} className={styles.beat}>
                              {paragraph ? renderParagraph(paragraph, `p-${step}`) : null}
                              {image ? (
                                <figure className={`${styles.shot} ${shotClass(step, image.src)}`}>
                                  <img src={resolveMediaUrl(image.src)} alt={image.alt} />
                                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                                </figure>
                              ) : null}
                            </div>
                          )
                        })
                      )}
                    </section>
                  )
                })
              : null}

            {editor ? (
              <AddSlot
                label={workPage.addSection}
                variant="inline"
                onAdd={() => editor.addCaseSection(workIndex)}
              />
            ) : null}

            {showHighlights ? (
              <section id="highlights" className={styles.proseBlock}>
                <EditableText path="workPage.highlights" as="h2" />
                <ul className={styles.softList}>
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
            ) : null}

            {showTools ? (
              <section id="tools" className={styles.proseBlock}>
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
            ) : null}

            {showNextSteps ? (
              <section id="next-steps" className={styles.proseBlock}>
                <EditableText path="workPage.nextSteps" as="h2" />
                <EditableText path={`${base}.nextSteps`} as="p" multiline />
              </section>
            ) : null}
          </div>
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
