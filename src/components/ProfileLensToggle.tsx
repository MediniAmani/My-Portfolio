import { EditableText } from './editor/Editable'
import { useProfileLens, type ProfileLens } from '../context/ProfileLensContext'
import styles from './ProfileLensToggle.module.css'

type Props = {
  className?: string
}

export function ProfileLensToggle({ className }: Props) {
  const { lens, setLens, fading } = useProfileLens()

  function choose(next: ProfileLens) {
    setLens(next)
  }

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <EditableText path="profileLens.hint" as="p" className={styles.hint} />
      <div
        className={styles.track}
        role="tablist"
        aria-label="Profile lens"
        data-lens={lens}
        data-busy={fading ? 'true' : 'false'}
      >
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.thumb} aria-hidden="true" />
        <button
          type="button"
          role="tab"
          aria-selected={lens === 'data'}
          className={styles.option}
          disabled={fading}
          onClick={() => choose('data')}
        >
          <EditableText path="profileLens.dataLabel" as="span" />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lens === 'design'}
          className={styles.option}
          disabled={fading}
          onClick={() => choose('design')}
        >
          <EditableText path="profileLens.designLabel" as="span" />
        </button>
      </div>
    </div>
  )
}
