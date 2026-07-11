import { Link, useNavigate } from 'react-router-dom'
import { AddSlot, EditableImageUrl, EditableText, ListItemControls } from '../components/editor/Editable'
import { ScrollHighlightHero } from '../components/ScrollHighlightHero'
import { SkyMagicWand } from '../components/SkyMagicWand'
import { useContent } from '../context/ContentContext'
import { useEditMode, useEditor, useEditorLink } from '../context/EditorContext'
import styles from './Home.module.css'

function ProjectCard({ index, slug }: { index: number; slug: string }) {
  const to = useEditorLink(`/work/${slug}`)
  const editing = useEditMode()
  return (
    <ListItemControls arrayPath="projects" index={index}>
      <article className={styles.resourceCard} style={{ animationDelay: `${0.08 * index}s` }}>
        <div className={styles.resourceThumb}>
          <EditableImageUrl path={`projects.${index}.image`} />
          <div className={styles.resourceOverlay}>
            <EditableText path={`projects.${index}.category`} as="span" />
          </div>
        </div>
        {editing ? (
          <div className={styles.resourceBody}>
            <EditableText path={`projects.${index}.title`} as="h3" />
            <EditableText path={`projects.${index}.tagline`} as="p" />
            <EditableText path={`projects.${index}.slug`} as="p" className={styles.slugField} />
          </div>
        ) : (
          <Link to={to} className={styles.resourceBody}>
            <EditableText path={`projects.${index}.title`} as="h3" />
            <EditableText path={`projects.${index}.tagline`} as="p" />
          </Link>
        )}
      </article>
    </ListItemControls>
  )
}

function HighlightCard({ index, slug }: { index: number; slug: string }) {
  const to = useEditorLink(`/work/${slug}`)
  const editing = useEditMode()
  return (
    <ListItemControls arrayPath="highlights" index={index}>
      <article className={styles.guideCard}>
        <div className={styles.guideThumb}>
          <EditableImageUrl path={`highlights.${index}.image`} />
        </div>
        {editing ? (
          <div>
            <EditableText path={`highlights.${index}.title`} as="h3" />
            <EditableText path={`highlights.${index}.meta`} as="p" className={styles.meta} />
            <EditableText path={`highlights.${index}.slug`} as="p" className={styles.slugField} />
          </div>
        ) : (
          <Link to={to} className={styles.guideBody}>
            <EditableText path={`highlights.${index}.title`} as="h3" />
            <EditableText path={`highlights.${index}.meta`} as="p" className={styles.meta} />
          </Link>
        )}
      </article>
    </ListItemControls>
  )
}

function AudienceRotator({ items }: { items: string[] }) {
  const n = items.length
  if (n === 0) return <span className={styles.rotateWrap}>…</span>
  if (n === 1) {
    return (
      <span className={styles.rotateWrap}>
        <span className={styles.rotateStatic}>{items[0]}</span>
      </span>
    )
  }

  const styleId = 'audience-rotate-keyframes'
  const frames = Array.from({ length: n }, (_, i) => {
    const start = (i / n) * 100
    const hold = ((i + 0.72) / n) * 100
    return `${start.toFixed(2)}%, ${hold.toFixed(2)}% { transform: translateY(-${i * 1.15}em); }`
  }).join('\n')

  return (
    <span className={styles.rotateWrap}>
      <style>{`@keyframes ${styleId} {\n${frames}\n100% { transform: translateY(-${n * 1.15}em); }\n}`}</style>
      <span
        className={styles.rotate}
        style={{ animationName: styleId, animationDuration: `${n * 2.5}s` }}
      >
        {[...items, items[0]].map((item, index) => (
          <span key={`audience-${index}`}>{item}</span>
        ))}
      </span>
    </span>
  )
}

function FeatureLink({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className: string
}) {
  const editing = useEditMode()
  const resolved = useEditorLink(to)
  if (editing) {
    return <div className={className}>{children}</div>
  }
  return (
    <Link to={resolved} className={className}>
      {children}
    </Link>
  )
}

function WorkFeatureMockup() {
  return (
    <div className={styles.deviceStack} aria-hidden="true">
      <div className={styles.laptop}>
        <div className={styles.laptopScreen}>
          <div className={styles.dashTop}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.dashGrid}>
            <div className={styles.kpi}>
              <small>Revenue YTD</small>
              <strong>+24%</strong>
            </div>
            <div className={styles.kpi}>
              <small>Retention</small>
              <strong>81%</strong>
            </div>
            <div className={styles.chartPane}>
              <div className={styles.line} />
              <div className={styles.bars}>
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.phone}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneBody}>
          <small>RFM segments</small>
          <div className={styles.segment}>
            <b>Champions</b>
            <em>18%</em>
          </div>
          <div className={styles.segment}>
            <b>Loyal</b>
            <em>27%</em>
          </div>
          <div className={styles.segment}>
            <b>At risk</b>
            <em>12%</em>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommunityFeatureMockup({ chipCount }: { chipCount: number }) {
  const editor = useEditor()
  const { site } = useContent()
  return (
    <div className={styles.communityStage} aria-hidden={!editor}>
      <div className={styles.poster}>
        <EditableText path="home.communityCard.eyebrow" as="p" className={styles.posterEyebrow} />
        <EditableText path="home.communityCard.title" as="h4" />
        <EditableText path="home.communityCard.meta" as="p" className={styles.posterMeta} />
        <EditableText path="home.communityCard.badge" as="div" className={styles.posterBadge} />
        <a
          className={styles.fofLink}
          href={site.fofUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          <EditableText path="site.fofLabel" as="span" />
        </a>
      </div>
      <div className={styles.chipRow}>
        {Array.from({ length: chipCount }, (_, index) => (
          <ListItemControls
            key={index}
            arrayPath="home.communityCard.chips"
            index={index}
            layout="inline"
          >
            <EditableText
              path={`home.communityCard.chips.${index}`}
              as="div"
              className={styles.floatingChip}
            />
          </ListItemControls>
        ))}
        {editor ? (
          <AddSlot
            label="Add tag"
            variant="inline"
            className={styles.addChip}
            onAdd={() => editor.addChip()}
          />
        ) : null}
      </div>
    </div>
  )
}

export function Home() {
  const { home, projects, highlights, site } = useContent()
  const editor = useEditor()
  const navigate = useNavigate()
  const featureWork = home.features[0]
  const featureAbout = home.features[1]
  const contactTo = useEditorLink('/contact')

  if (!featureWork || !featureAbout) {
    throw new Error('home.features must contain at least two feature cards')
  }

  return (
    <>
      <ScrollHighlightHero />

      <section className={styles.banner} aria-label="Featured atmosphere">
        <div className={`${styles.bannerVisual} fade-up-delay-2`}>
          <EditableImageUrl path="home.banner.image" alt={home.banner.alt} className={styles.bannerImg} />
          <div className={styles.bannerScrim} />
          <div className={styles.bannerCaption}>
            <EditableText path="home.banner.title" as="p" />
            <EditableText path="home.banner.subtitle" as="span" />
          </div>
        </div>
      </section>

      <section className={`section ${styles.resources}`}>
        <div className="container">
          <h2 className={styles.resourcesTitle}>
            <EditableText path="home.resourcesTitlePrefix" as="span" />{' '}
            {editor ? (
              <span className={styles.audienceLivePreview}>
                {home.rotatingAudiences[0] ?? '…'}
              </span>
            ) : (
              <AudienceRotator items={home.rotatingAudiences} />
            )}
          </h2>
          {editor ? (
            <div className={styles.audienceEditor}>
              {home.rotatingAudiences.map((_, index) => (
                <ListItemControls
                  key={index}
                  arrayPath="home.rotatingAudiences"
                  index={index}
                  layout="inline"
                >
                  <EditableText
                    path={`home.rotatingAudiences.${index}`}
                    as="span"
                    className={styles.audienceChip}
                  />
                </ListItemControls>
              ))}
              <AddSlot label="Add audience" variant="inline" onAdd={() => editor.addAudience()} />
            </div>
          ) : null}

          <div className={styles.resourceGrid}>
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} index={index} slug={project.slug} />
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
      </section>

      <SkyMagicWand className={styles.darkBand}>
        <div className={styles.stars} aria-hidden="true" />
        <div className={`container ${styles.darkInner}`}>
          <EditableText path="home.darkHeadline" as="h2" className={styles.darkHeadline} multiline />

          <div className={styles.featureGrid}>
            <FeatureLink to={featureWork.to} className={styles.featureCard}>
              <div className={styles.featureCopy}>
                <EditableText path="home.features.0.label" as="p" className={styles.featureLabel} />
                <EditableText path="home.features.0.title" as="h3" multiline />
                <EditableText path="home.features.0.cta" as="span" className={styles.featureCta} />
              </div>
              <EditableImageUrl
                path="home.features.0.image"
                className={styles.featureImage}
                allowClear
                placeholder={<WorkFeatureMockup />}
              />
            </FeatureLink>

            <FeatureLink to={featureAbout.to} className={styles.featureCard}>
              <div className={styles.featureCopy}>
                <EditableText path="home.features.1.label" as="p" className={styles.featureLabel} />
                <EditableText path="home.features.1.title" as="h3" multiline />
                <EditableText path="home.features.1.cta" as="span" className={styles.featureCta} />
              </div>
              <EditableImageUrl
                path="home.features.1.image"
                className={styles.featureImage}
                allowClear
                placeholder={<CommunityFeatureMockup chipCount={home.communityCard.chips.length} />}
              />
            </FeatureLink>
          </div>
        </div>
      </SkyMagicWand>

      <section className={`section ${styles.guides}`}>
        <div className="container">
          <div className={styles.guidesHeader}>
            <div>
              <EditableText path="home.highlightsTitle" as="h2" className={styles.guidesTitle} />
              <EditableText path="home.highlightsLead" as="p" className={styles.guidesLead} multiline />
            </div>
            <div className={styles.guideActions}>
              <a className="btn" href={site.cvEn} download>
                <EditableText path="home.cvCtaEn" as="span" />
              </a>
              <a className="btn btn-ghost" href={site.cvFr} download>
                <EditableText path="home.cvCtaFr" as="span" />
              </a>
              <Link className="btn btn-ghost" to={contactTo}>
                <EditableText path="home.contactCta" as="span" />
              </Link>
            </div>
          </div>

          <div className={styles.guideGrid}>
            {highlights.map((item, index) => (
              <HighlightCard key={`${item.slug}-${index}`} index={index} slug={item.slug} />
            ))}
            {editor ? <AddSlot label="Add highlight" onAdd={() => editor.addHighlight()} /> : null}
          </div>
        </div>
      </section>
    </>
  )
}
