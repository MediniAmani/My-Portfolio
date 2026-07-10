import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { hero } from '../data/content'
import { fireEmojiBurst, getEmojiEffect } from '../lib/emojiBurst'
import styles from './ScrollHighlightHero.module.css'

type Token =
  | { type: 'word'; text: string }
  | { type: 'space' }
  | { type: 'emoji'; text: string }
  | { type: 'avatar' }

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
    // emoji may be attached to punctuation-free words; split emoji clusters
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
  const trackRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0.08)

  const [spinning, setSpinning] = useState<Record<number, number>>({})

  const tokens = useMemo(() => {
    const leadTokens = tokenize(hero.lead)
    const restTokens = tokenize(hero.rest)
    return [...leadTokens, { type: 'avatar' as const }, { type: 'space' as const }, ...restTokens]
  }, [])

  const highlightableCount = useMemo(
    () => tokens.filter((t) => t.type === 'word' || t.type === 'emoji' || t.type === 'avatar').length,
    [tokens],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setProgress(1)
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) {
        setProgress(1)
        return
      }
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
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const activeCount = Math.floor(progress * (highlightableCount + 0.999))

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
        <div className={`container ${styles.inner}`}>
          <h1 className={styles.heroType}>
            {tokens.map((token, index) => {
              if (token.type === 'space') {
                return <span key={`s-${index}`}> </span>
              }

              highlightIndex += 1
              const active = highlightIndex <= activeCount
              const className = active ? styles.active : styles.muted

              if (token.type === 'avatar') {
                return (
                  <span
                    key={`a-${index}`}
                    className={`${styles.avatarPill} ${active ? styles.avatarActive : styles.avatarMuted}`}
                    aria-hidden="true"
                  >
                    <img
                      src={hero.avatarImage}
                      alt=""
                      className={styles.avatarImg}
                    />
                  </span>
                )
              }

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
