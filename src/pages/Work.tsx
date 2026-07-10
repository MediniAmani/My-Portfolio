import { Link } from 'react-router-dom'
import { projects, workPage } from '../data/content'
import styles from './Work.module.css'

export function Work() {
  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <h1 className={`${styles.title} fade-up`}>{workPage.title}</h1>
          <p className={`${styles.lead} fade-up-delay`}>{workPage.lead}</p>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <Link key={project.slug} to={`/work/${project.slug}`} className={styles.card}>
              <div className={styles.thumb}>
                <img src={project.image} alt="" />
                <span>{project.category}</span>
              </div>
              <h2>{project.title}</h2>
              <p className={styles.tagline}>{project.tagline}</p>
              <span className={styles.cta}>{workPage.caseStudyCta}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
