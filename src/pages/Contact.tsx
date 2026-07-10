import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactPage, site } from '../data/content'
import styles from './Contact.module.css'

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()

    const subject = encodeURIComponent(
      `${contactPage.mailSubjectPrefix} ${name || 'visitor'}`,
    )
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setStatus('ready')
  }

  return (
    <div className="section">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <h1 className={`${styles.title} fade-up`}>{contactPage.title}</h1>
          <p className={`${styles.lead} fade-up-delay`}>{contactPage.lead}</p>

          <div className={styles.details}>
            <div>
              <p className={styles.label}>{contactPage.labels.email}</p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div>
              <p className={styles.label}>{contactPage.labels.linkedin}</p>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                {site.linkedinLabel}
              </a>
            </div>
            <div>
              <p className={styles.label}>{contactPage.labels.basedIn}</p>
              <p>{site.location}</p>
            </div>
            <div>
              <p className={styles.label}>{contactPage.labels.cv}</p>
              <div className={styles.cvLinks}>
                <a href={site.cvEn} download>
                  {contactPage.cvLinks.pdf}
                </a>
                <a href={site.cvEnDocx} download>
                  {contactPage.cvLinks.wordEn}
                </a>
                <a href={site.cvFrDocx} download>
                  {contactPage.cvLinks.wordFr}
                </a>
              </div>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {contactPage.labels.name}
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            {contactPage.labels.email}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {contactPage.labels.message}
            <textarea name="message" rows={6} required />
          </label>
          <button className="btn" type="submit">
            {contactPage.submit}
          </button>
          {status === 'ready' ? (
            <p className={styles.note}>{contactPage.sentNote}</p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
