import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { resolveMediaUrl } from '../api/client'
import { EditableImageUrl, EditableText } from './editor/Editable'
import { useContent } from '../context/ContentContext'
import { useEditMode } from '../context/EditorContext'
import { useProfileLens } from '../context/ProfileLensContext'
import { fireEmojiBurst, getEmojiEffect } from '../lib/emojiBurst'
import styles from './ScrollHighlightHero.module.css'

type Token =
  | { type: 'word'; text: string }
  | { type: 'space' }
  | { type: 'emoji'; text: string }
  | { type: 'avatar' }
  | { type: 'break' }

function tokenize(text: string): Token[] {
  const parts = text.split(/(\s+)/)
  const tokens: Token[] = []

  for (const part of parts) {
    if (!part) continue
    if (/^\s+$/.test(part)) {
      tokens.push({ type: 'space' })
      continue
    }
    if (/^\p{Extended_Pictographic}/u.test(part) || /^[\uFE0F\u200D]+/.test(part)) {
      tokens.push({ type: 'emoji', text: part })
      continue
    }
    const emojiSplit = part.split(/(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/u)
    for (const chunk of emojiSplit) {
      if (!chunk) continue
      if (/^\p{Extended_Pictographic}/u.test(chunk)) {
        tokens.push({ type: 'emoji', text: chunk })
      } else {
        tokens.push({ type: 'word', text: chunk })
      }
    }
  }

  return tokens
}

export function ScrollHighlightHero() {
  const { hero } = useContent()
  const editMode = useEditMode()
  const { displayLens, fading } = useProfileLens()
  const trackRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0.08)
  const [spinning, setSpinning] = useState<Record<number, number>>({})

  const restPath = displayLens === 'design' ? 'hero.restDesign' : 'hero.rest'
  const restText = displayLens === 'design' ? hero.restDesign : hero.rest
  if (typeof restText !== 'string') {
    throw new Error(
      displayLens === 'design'
        ? 'hero.restDesign is missing from content'
        : 'hero.rest is missing from content',
    )
  }

  const tokens = useMemo(() => {
    const leadTokens = tokenize(hero.lead)
    const restTokens = tokenize(restText)
    return [
      ...leadTokens,
      { type: 'avatar' as const },
      { type: 'break' as const },
      ...restTokens,
    ]
  }, [hero.lead, restText])

  const highlightableCount = useMemo(
    () => tokens.filter((t) => t.type === 'word' || t.type === 'emoji').length,
    [tokens],
  )

  useEffect(() => {
    if (editMode) return

    const track = trackRef.current
    if (!track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setProgress(1)
      return
    }

    let frame = 0

    // Prefer layout viewport height over innerHeight so iOS/Android URL-bar
    // show/hide does not constantly rewrite the scroll distance mid-gesture.
    const viewportHeight = () => {
      const visual = window.visualViewport?.height
      const layout = document.documentElement.clientHeight
      if (typeof visual === 'number' && visual > 0) {
        return Math.min(visual, layout || visual)
      }
      return layout || window.innerHeight
    }

    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const trackHeight = track.offsetHeight
      const viewH = viewportHeight()
      const total = trackHeight - viewH
      if (total <= 1) {
        setProgress(1)
        return
      }
      // Clamp with a tiny epsilon so the last words fully settle on mobile.
      const raw = -rect.top / total
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [editMode])

  const panelClass = fading ? `${styles.lensPanel} ${styles.lensPanelFading}` : styles.lensPanel

  if (editMode) {
    return (
      <section className={styles.track} aria-label="Introduction editor" style={{ height: 'auto' }}>
        <div className={styles.sticky} style={{ position: 'relative', minHeight: 'auto' }}>
          <div className={`container ${panelClass}`}>
            <div className={styles.heroType}>
              <EditableText path="hero.lead" as="p" multiline />
              <span className={styles.avatarPill}>
                <EditableImageUrl path="hero.avatarImage" className={styles.avatarImg} />
              </span>
              <br />
              <EditableText path={restPath} as="p" multiline />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const activeCount = Math.floor(progress * (highlightableCount + 0.999))
  const avatarSrc = resolveMediaUrl(hero.avatarImage)

  function handleEmojiClick(
    emoji: string,
    index: number,
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault()
    const effect = getEmojiEffect(emoji)

    if (effect === 'burst') {
      fireEmojiBurst(emoji, event)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setSpinning((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }))
  }

  let highlightIndex = -1

  return (
    <section ref={trackRef} className={styles.track} aria-label="Introduction">
      <div className={styles.sticky}>
        <div className={`container ${panelClass}`}>
          <h1 className={styles.heroType}>
            {tokens.map((token, index) => {
              if (token.type === 'space') {
                return <span key={`s-${index}`}> </span>
              }

              if (token.type === 'avatar') {
                return (
                  <span key={`a-${index}`} className={styles.avatarPill} aria-hidden="true">
                    <img src={avatarSrc} alt="" className={styles.avatarImg} />
                  </span>
                )
              }

              if (token.type === 'break') {
                return <br key={`b-${index}`} />
              }

              highlightIndex += 1
              const active = highlightIndex <= activeCount
              const className = active ? styles.active : styles.muted

              if (token.type === 'emoji') {
                const effect = getEmojiEffect(token.text)
                const spinKey = spinning[index]
                return (
                  <button
                    key={`e-${index}-${spinKey ?? 0}`}
                    type="button"
                    className={`${styles.emoji} ${styles.emojiButton} ${className} ${
                      spinKey ? styles.emojiSpin : ''
                    }`}
                    onClick={(event) => handleEmojiClick(token.text, index, event)}
                    aria-label={
                      effect === 'burst'
                        ? `Celebrate with ${token.text}`
                        : `Play with ${token.text}`
                    }
                  >
                    {token.text}
                  </button>
                )
              }

              return (
                <span key={`w-${index}`} className={`${styles.word} ${className}`}>
                  {token.text}
                </span>
              )
            })}
          </h1>
        </div>
      </div>
    </section>
  )
}
