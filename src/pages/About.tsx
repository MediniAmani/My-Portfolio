import {
  aboutPage,
  awards,
  certifications,
  nowItems,
  site,
  speaking,
  timeline,
} from '../data/content'
import styles from './About.module.css'

export function About() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className={`${styles.title} fade-up`}>{aboutPage.title}</h1>
        <p className={`${styles.bio} fade-up-delay`}>{aboutPage.bio}</p>

        <section className={styles.block}>
          <h2>{aboutPage.sections.now}</h2>
          <div className={styles.nowGrid}>
            {nowItems.map((item) => (
              <article key={item.title} className={styles.nowItem}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <h2>{aboutPage.sections.awards}</h2>
          <ul className={styles.list}>
            {awards.map((award) => (
              <li key={award.title}>
                <strong>{award.title}</strong>
                <span>{award.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <h2>{aboutPage.sections.timeline}</h2>
          <ol className={styles.timeline}>
            {timeline.map((item) => (
              <li key={item.year}>
                <span className={styles.year}>{item.year}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block}>
          <h2>{aboutPage.sections.speaking}</h2>
          <ul className={styles.list}>
            {speaking.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <h2>{aboutPage.sections.certifications}</h2>
          <ul className={styles.list}>
            {certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <h2>{aboutPage.sections.findMe}</h2>
          <p className={styles.find}>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              {aboutPage.linkedinLabel}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span aria-hidden="true"> · </span>
            <span>{site.location}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
