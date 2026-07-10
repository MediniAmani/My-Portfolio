import { Link, useParams } from 'react-router-dom'
import { projects, workPage } from '../data/content'
import styles from './WorkDetail.module.css'

export function WorkDetail() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <div className="section">
        <div className="container-narrow">
          <h1>{workPage.notFoundTitle}</h1>
          <p className={styles.missing}>
            {workPage.notFoundBody} <Link to="/work">{workPage.backToWork}</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container-narrow">
        <Link to="/work" className={styles.back}>
          {workPage.backLabel}
        </Link>
        <p className={styles.cat}>{project.category}</p>
        <h1 className={`${styles.title} fade-up`}>{project.title}</h1>
        <p className={`${styles.tagline} fade-up-delay`}>{project.tagline}</p>

        <div className={styles.heroImage}>
          <img src={project.image} alt="" />
        </div>

        <div className={styles.body}>
          <section>
            <h2>{workPage.overview}</h2>
            <p>{project.summary}</p>
          </section>

          <section>
            <h2>{workPage.highlights}</h2>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{workPage.tools}</h2>
            <div className={styles.tools}>
              {project.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.footerNav}>
          <Link className="btn btn-ghost" to="/work">
            {workPage.moreProjects}
          </Link>
          <Link className="btn" to="/contact">
            {workPage.discuss}
          </Link>
        </div>
      </div>
    </div>
  )
}
