import { useState } from 'react'
import type { FormEvent } from 'react'
import { EditableText } from '../components/editor/Editable'
import { useContent } from '../context/ContentContext'
import styles from './Contact.module.css'

export function Contact() {
  const { contactPage, site } = useContent()
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()

    const subject = encodeURIComponent(`${contactPage.mailSubjectPrefix} ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setStatus('ready')
  }

  return (
    <div className="section">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <EditableText path="contactPage.title" as="h1" className={`${styles.title} fade-up`} />
          <EditableText path="contactPage.lead" as="p" className={`${styles.lead} fade-up-delay`} multiline />

          <div className={styles.details}>
            <div>
              <EditableText path="contactPage.labels.email" as="p" className={styles.label} />
              <a href={`mailto:${site.email}`}>
                <EditableText path="site.email" as="span" />
              </a>
            </div>
            <div>
              <EditableText path="contactPage.labels.linkedin" as="p" className={styles.label} />
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                <EditableText path="site.linkedinLabel" as="span" />
              </a>
            </div>
            <div>
              <EditableText path="contactPage.labels.fof" as="p" className={styles.label} />
              <a href={site.fofUrl} target="_blank" rel="noreferrer">
                <EditableText path="site.fofLabel" as="span" />
              </a>
            </div>
            <div>
              <EditableText path="contactPage.labels.basedIn" as="p" className={styles.label} />
              <EditableText path="site.location" as="p" />
            </div>
            <div>
              <EditableText path="contactPage.labels.cv" as="p" className={styles.label} />
              <div className={styles.cvLinks}>
                <a href={site.cvEn} download>
                  <EditableText path="contactPage.cvLinks.en" as="span" />
                </a>
                <a href={site.cvFr} download>
                  <EditableText path="contactPage.cvLinks.fr" as="span" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <EditableText path="contactPage.labels.name" as="span" />
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <EditableText path="contactPage.labels.email" as="span" />
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <EditableText path="contactPage.labels.message" as="span" />
            <textarea name="message" rows={6} required />
          </label>
          <button className="btn" type="submit">
            <EditableText path="contactPage.submit" as="span" />
          </button>
          {status === 'ready' ? (
            <EditableText path="contactPage.sentNote" as="p" className={styles.note} />
          ) : null}
        </form>
      </div>
    </div>
  )
}
