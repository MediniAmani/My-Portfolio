import { ProfileLensToggle } from '../components/ProfileLensToggle'
import { EditableText, ListItemControls, AddSlot } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditor } from '../context/EditorContext'
import { useProfileLens } from '../context/ProfileLensContext'
import styles from './About.module.css'

export function About() {
  const {
    nowItems,
    experience,
    designExperience,
    workProcess,
    skills,
    traits,
    awards,
    timeline,
    speaking,
    certifications,
    site,
  } = useContent()
  const editor = useEditor()
  const { displayLens, fading } = useProfileLens()
  const showData = displayLens === 'data'
  const showDesign = displayLens === 'design'
  const panelClass = fading ? `${styles.lensPanel} ${styles.lensPanelFading}` : styles.lensPanel

  return (
    <div className="section">
      <div className="container-narrow">
        <EditableText path="aboutPage.title" as="h1" className={`${styles.title} fade-up`} />
        <ProfileLensToggle />

        <div className={panelClass} aria-busy={fading}>
          {showData ? (
            <>
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
                          <EditableText
                            path={`experience.${index}.dates`}
                            as="span"
                            className={styles.experienceDates}
                          />
                        </div>
                        <EditableText
                          path={`experience.${index}.company`}
                          as="p"
                          className={styles.experienceCompany}
                        />
                        <ul className={styles.experienceBullets}>
                          {experience[index].bullets.map((_, bulletIndex) => (
                            <ListItemControls
                              key={bulletIndex}
                              arrayPath={`experience.${index}.bullets`}
                              index={bulletIndex}
                              layout="inline"
                            >
                              <li>
                                <EditableText
                                  path={`experience.${index}.bullets.${bulletIndex}`}
                                  as="span"
                                />
                              </li>
                            </ListItemControls>
                          ))}
                        </ul>
                        {editor ? (
                          <AddSlot
                            label="Add bullet"
                            variant="inline"
                            onAdd={() =>
                              editor.appendItem(`experience.${index}.bullets`, 'New responsibility')
                            }
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
                  <AddSlot
                    label="Add timeline entry"
                    variant="inline"
                    onAdd={() => editor.addTimelineItem()}
                  />
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
                    <ListItemControls
                      key={index}
                      arrayPath="certifications"
                      index={index}
                      layout="inline"
                    >
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
            </>
          ) : null}

          {showDesign ? (
            <>
              <EditableText
                path="aboutPage.bioDesign"
                as="p"
                className={`${styles.bio} fade-up-delay`}
                multiline
              />

              <section className={styles.block}>
                <EditableText path="aboutPage.sections.vision" as="h2" />
                <EditableText path="aboutPage.vision.body" as="p" className={styles.visionBody} multiline />
              </section>

              <section className={styles.block}>
                <EditableText path="aboutPage.sections.designExperience" as="h2" />
                <div className={styles.experienceList}>
                  {designExperience.map((_, index) => (
                    <ListItemControls key={index} arrayPath="designExperience" index={index}>
                      <article className={styles.experienceItem}>
                        <div className={styles.experienceHead}>
                          <EditableText path={`designExperience.${index}.title`} as="h3" />
                          <EditableText
                            path={`designExperience.${index}.dates`}
                            as="span"
                            className={styles.experienceDates}
                          />
                        </div>
                        <EditableText
                          path={`designExperience.${index}.company`}
                          as="p"
                          className={styles.experienceCompany}
                        />
                        <ul className={styles.experienceBullets}>
                          {designExperience[index].bullets.map((_, bulletIndex) => (
                            <ListItemControls
                              key={bulletIndex}
                              arrayPath={`designExperience.${index}.bullets`}
                              index={bulletIndex}
                              layout="inline"
                            >
                              <li>
                                <EditableText
                                  path={`designExperience.${index}.bullets.${bulletIndex}`}
                                  as="span"
                                />
                              </li>
                            </ListItemControls>
                          ))}
                        </ul>
                        {editor ? (
                          <AddSlot
                            label="Add bullet"
                            variant="inline"
                            onAdd={() =>
                              editor.appendItem(
                                `designExperience.${index}.bullets`,
                                'New design outcome',
                              )
                            }
                          />
                        ) : null}
                      </article>
                    </ListItemControls>
                  ))}
                  {editor ? (
                    <AddSlot label="Add design freelance" onAdd={() => editor.addDesignExperience()} />
                  ) : null}
                </div>
              </section>

              <section className={styles.block}>
                <EditableText path="aboutPage.sections.skills" as="h2" />
                <div className={styles.skillsGrid}>
                  <div>
                    <EditableText
                      path="aboutPage.skillsLabels.technical"
                      as="h3"
                      className={styles.skillsHeading}
                    />
                    <ul className={styles.skillList}>
                      {skills.technical.map((_, index) => (
                        <ListItemControls
                          key={index}
                          arrayPath="skills.technical"
                          index={index}
                          layout="inline"
                        >
                          <li>
                            <EditableText path={`skills.technical.${index}`} as="span" />
                          </li>
                        </ListItemControls>
                      ))}
                    </ul>
                    {editor ? (
                      <AddSlot
                        label="Add technical skill"
                        variant="inline"
                        onAdd={() => editor.addTechnicalSkill()}
                      />
                    ) : null}
                  </div>
                  <div>
                    <EditableText
                      path="aboutPage.skillsLabels.soft"
                      as="h3"
                      className={styles.skillsHeading}
                    />
                    <ul className={styles.skillList}>
                      {skills.soft.map((_, index) => (
                        <ListItemControls
                          key={index}
                          arrayPath="skills.soft"
                          index={index}
                          layout="inline"
                        >
                          <li>
                            <EditableText path={`skills.soft.${index}`} as="span" />
                          </li>
                        </ListItemControls>
                      ))}
                    </ul>
                    {editor ? (
                      <AddSlot
                        label="Add soft skill"
                        variant="inline"
                        onAdd={() => editor.addSoftSkill()}
                      />
                    ) : null}
                  </div>
                </div>
              </section>

              <section className={styles.block}>
                <EditableText path="aboutPage.sections.traits" as="h2" />
                <ul className={styles.traitList}>
                  {traits.map((_, index) => (
                    <ListItemControls key={index} arrayPath="traits" index={index} layout="inline">
                      <li>
                        <EditableText path={`traits.${index}`} as="span" />
                      </li>
                    </ListItemControls>
                  ))}
                </ul>
                {editor ? (
                  <AddSlot label="Add trait" variant="inline" onAdd={() => editor.addTrait()} />
                ) : null}
              </section>

              <section className={styles.block}>
                <EditableText path="aboutPage.sections.workProcess" as="h2" />
                <ol className={styles.processList}>
                  {workProcess.map((_, index) => (
                    <ListItemControls key={index} arrayPath="workProcess" index={index}>
                      <li>
                        <EditableText path={`workProcess.${index}.title`} as="h3" />
                        <EditableText path={`workProcess.${index}.body`} as="p" multiline />
                      </li>
                    </ListItemControls>
                  ))}
                </ol>
                {editor ? (
                  <AddSlot label="Add process step" onAdd={() => editor.addWorkProcessStep()} />
                ) : null}
              </section>
            </>
          ) : null}
        </div>

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
