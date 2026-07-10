import { Link } from 'react-router-dom'
import { highlights, home, projects, site } from '../data/content'
import { ScrollHighlightHero } from '../components/ScrollHighlightHero'
import { SkyMagicWand } from '../components/SkyMagicWand'
import styles from './Home.module.css'

export function Home() {
  const [featureWork, featureAbout] = home.features

  return (
    <>
      <ScrollHighlightHero />

      <section className={styles.banner} aria-label="Featured atmosphere">
        <div className={`${styles.bannerVisual} fade-up-delay-2`}>
          <img
            src={home.banner.image}
            alt={home.banner.alt}
            className={styles.bannerImg}
          />
          <div className={styles.bannerScrim} />
          <div className={styles.bannerCaption}>
            <p>{home.banner.title}</p>
            <span>{home.banner.subtitle}</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.resources}`}>
        <div className="container">
          <h2 className={styles.resourcesTitle}>
            {home.resourcesTitlePrefix}{' '}
            <span className={styles.rotateWrap}>
              <span className={styles.rotate}>
                {[...home.rotatingAudiences, home.rotatingAudiences[0]].map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </span>
            </span>
          </h2>

          <div className={styles.resourceGrid}>
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className={styles.resourceCard}
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <div className={styles.resourceThumb}>
                  <img src={project.image} alt="" />
                  <div className={styles.resourceOverlay}>
                    <span>{project.category}</span>
                  </div>
                </div>
                <div className={styles.resourceBody}>
                  <h3>{project.title}</h3>
                  <p>{project.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SkyMagicWand className={styles.darkBand}>
        <div className={styles.stars} aria-hidden="true" />
        <div className={`container ${styles.darkInner}`}>
          <h2 className={styles.darkHeadline}>{home.darkHeadline}</h2>

          <div className={styles.featureGrid}>
            <Link to={featureWork.to} className={styles.featureCard}>
              <div className={styles.featureCopy}>
                <p className={styles.featureLabel}>{featureWork.label}</p>
                <h3>{featureWork.title}</h3>
                <span className={styles.featureCta}>{featureWork.cta}</span>
              </div>
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
            </Link>

            <Link to={featureAbout.to} className={styles.featureCard}>
              <div className={styles.featureCopy}>
                <p className={styles.featureLabel}>{featureAbout.label}</p>
                <h3>{featureAbout.title}</h3>
                <span className={styles.featureCta}>{featureAbout.cta}</span>
              </div>
              <div className={styles.communityStage} aria-hidden="true">
                <div className={styles.poster}>
                  <p className={styles.posterEyebrow}>{home.communityCard.eyebrow}</p>
                  <h4>{home.communityCard.title}</h4>
                  <p className={styles.posterMeta}>{home.communityCard.meta}</p>
                  <div className={styles.posterBadge}>{home.communityCard.badge}</div>
                </div>
                {home.communityCard.chips.map((chip, index) => (
                  <div
                    key={chip}
                    className={`${styles.floatingChip} ${index === 1 ? styles.chipTwo : ''}`}
                  >
                    {chip}
                  </div>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </SkyMagicWand>

      <section className={`section ${styles.guides}`}>
        <div className="container">
          <div className={styles.guidesHeader}>
            <div>
              <h2 className={styles.guidesTitle}>{home.highlightsTitle}</h2>
              <p className={styles.guidesLead}>{home.highlightsLead}</p>
            </div>
            <div className={styles.guideActions}>
              <a className="btn" href={site.cvEn} download>
                {home.cvCta}
              </a>
              <Link className="btn btn-ghost" to="/contact">
                {home.contactCta}
              </Link>
            </div>
          </div>

          <div className={styles.guideGrid}>
            {highlights.map((item) => (
              <Link key={item.slug} to={`/work/${item.slug}`} className={styles.guideCard}>
                <div className={styles.guideThumb}>
                  <img src={item.image} alt="" />
                </div>
                <h3>{item.title}</h3>
                <p className={styles.meta}>{item.meta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
