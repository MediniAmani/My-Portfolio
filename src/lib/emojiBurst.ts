import confetti from 'canvas-confetti'
import type { MouseEvent } from 'react'

const PASTELS = ['#a5b4fc', '#f9a8d4', '#86efac', '#fde68a', '#c4b5fd', '#67e8f9', '#fda4af']

const BURST_EMOJIS = new Set(['✨', '🎉', '🎊', '🥳'])
const ROTATE_EMOJIS = new Set(['🏕️', '⛺', '🌱', '🌿'])

export function getEmojiEffect(emoji: string): 'burst' | 'rotate' {
  if ([...BURST_EMOJIS].some((item) => emoji.includes(item))) return 'burst'
  if ([...ROTATE_EMOJIS].some((item) => emoji.includes(item))) return 'rotate'
  return 'rotate'
}

export function fireEmojiBurst(emoji: string, event: MouseEvent<HTMLElement>) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const rect = event.currentTarget.getBoundingClientRect()
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  }

  const scalar = 2.2
  const emojiShape = confetti.shapeFromText({ text: emoji, scalar })

  confetti({
    particleCount: 55,
    spread: 70,
    startVelocity: 28,
    gravity: 0.85,
    ticks: 160,
    origin,
    colors: PASTELS,
    shapes: ['square', 'circle'],
    scalar: 0.9,
    disableForReducedMotion: true,
  })

  confetti({
    particleCount: 18,
    spread: 56,
    startVelocity: 22,
    gravity: 0.7,
    ticks: 140,
    origin,
    shapes: [emojiShape],
    scalar,
    flat: true,
    disableForReducedMotion: true,
  })
}
