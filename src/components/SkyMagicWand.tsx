import { useEffect, useRef, useState } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import styles from './SkyMagicWand.module.css'

type Kind = 'dust' | 'glint' | 'star'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  glow: string
  twinkle: number
  spin: number
  spinSpeed: number
  kind: Kind
}

type TrailPoint = { x: number; y: number }

const PALETTE = [
  { core: '#fff2c9', glow: 'rgba(255, 224, 138, 0.85)' },
  { core: '#e7d3ff', glow: 'rgba(196, 181, 253, 0.85)' },
  { core: '#ffd9ec', glow: 'rgba(253, 164, 175, 0.8)' },
  { core: '#d3fff0', glow: 'rgba(125, 207, 182, 0.8)' },
  { core: '#ffffff', glow: 'rgba(255, 255, 255, 0.9)' },
]

const FOLLOW_EASE = 0.16
const ROTATION_EASE = 0.14
const SPAWN_GAP_MS = 26
const TRAIL_LENGTH = 12

function pickPalette() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)]
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  rotation: number,
) {
  const spikes = 5
  const step = Math.PI / spikes
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = i * step + rotation
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
}

function drawGlint(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rotation: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rotation)
  ctx.beginPath()
  ctx.moveTo(0, -size * 2.1)
  ctx.lineTo(size * 0.55, 0)
  ctx.lineTo(0, size * 2.1)
  ctx.lineTo(-size * 0.55, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

type Props = {
  className?: string
  children: ReactNode
}

export function SkyMagicWand({ className, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wandRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const trailRef = useRef<TrailPoint[]>([])
  const rafRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const spawnTickRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0, active: false })
  const wandPosRef = useRef({ x: 0, y: 0, ready: false })
  const rotationRef = useRef(0)
  const scaleRef = useRef(1)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => setEnabled(fine.matches && !motion.matches)
    sync()

    fine.addEventListener('change', sync)
    motion.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      motion.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    const section = sectionRef.current
    const wand = wandRef.current
    if (!canvas || !section || !wand) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = section.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = (time: number) => {
      const rect = section.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const target = targetRef.current
      const wandPos = wandPosRef.current

      if (target.active) {
        if (!wandPos.ready) {
          wandPos.x = target.x
          wandPos.y = target.y
          wandPos.ready = true
        }

        const prevX = wandPos.x
        const prevY = wandPos.y
        wandPos.x += (target.x - wandPos.x) * FOLLOW_EASE
        wandPos.y += (target.y - wandPos.y) * FOLLOW_EASE

        const dx = wandPos.x - prevX
        const dy = wandPos.y - prevY
        const speed = Math.hypot(dx, dy)

        const targetRotation = Math.max(-16, Math.min(16, dx * 2.2))
        rotationRef.current += (targetRotation - rotationRef.current) * ROTATION_EASE

        const targetScale = 1 + Math.min(0.16, speed * 0.018)
        scaleRef.current += (targetScale - scaleRef.current) * 0.18

        wand.style.transform = `translate3d(${wandPos.x}px, ${wandPos.y}px, 0) rotate(${rotationRef.current}deg) scale(${scaleRef.current})`
        wand.classList.add(styles.wandVisible)

        const trail = trailRef.current
        trail.push({ x: wandPos.x + 2, y: wandPos.y - 6 })
        if (trail.length > TRAIL_LENGTH) trail.shift()

        if (time - lastSpawnRef.current > SPAWN_GAP_MS) {
          lastSpawnRef.current = time
          spawnTickRef.current += 1
          const tipX = wandPos.x + 2
          const tipY = wandPos.y - 6
          const burst = 1 + Math.min(3, Math.floor(speed / 3))

          for (let i = 0; i < burst; i += 1) {
            const palette = pickPalette()
            const roll = Math.random()
            const kind: Kind = roll > 0.92 ? 'star' : roll > 0.55 ? 'glint' : 'dust'

            particlesRef.current.push({
              x: tipX + (Math.random() - 0.5) * 10,
              y: tipY + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 0.7 - dx * 0.06,
              vy: Math.random() * 0.4 + 0.05 - dy * 0.05,
              life: 1,
              maxLife: kind === 'star' ? 1.1 + Math.random() * 0.5 : 0.7 + Math.random() * 0.6,
              size:
                kind === 'star'
                  ? 4.5 + Math.random() * 3.5
                  : kind === 'glint'
                    ? 2 + Math.random() * 2.4
                    : 1 + Math.random() * 1.8,
              color: palette.core,
              glow: palette.glow,
              twinkle: Math.random() * Math.PI * 2,
              spin: Math.random() * Math.PI * 2,
              spinSpeed: (Math.random() - 0.5) * 0.12,
              kind,
            })
          }

          if (particlesRef.current.length > 140) {
            particlesRef.current.splice(0, particlesRef.current.length - 140)
          }
        }
      } else {
        wand.classList.remove(styles.wandVisible)
        wandPos.ready = false
        trailRef.current = []
      }

      const trail = trailRef.current
      if (trail.length > 1) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i += 1) {
          const a = trail[i - 1]
          const b = trail[i]
          const t = i / trail.length
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.lineWidth = t * 3.2
          ctx.strokeStyle = `rgba(255, 226, 160, ${t * 0.35})`
          ctx.stroke()
        }
        ctx.restore()

        const tip = trail[trail.length - 1]
        const pulse = 0.5 + 0.5 * Math.sin(time / 260)
        const auraR = 16 + pulse * 6
        const aura = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, auraR)
        aura.addColorStop(0, `rgba(255, 236, 179, ${0.35 + pulse * 0.15})`)
        aura.addColorStop(1, 'rgba(255, 236, 179, 0)')
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = aura
        ctx.beginPath()
        ctx.arc(tip.x, tip.y, auraR, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.01
        p.vx *= 0.985
        p.life -= 0.016 / p.maxLife
        p.twinkle += 0.18
        p.spin += p.spinSpeed
        if (p.life <= 0) return false

        const fade = Math.max(0, p.life)
        const alpha = fade * (0.55 + 0.45 * Math.sin(p.twinkle))

        ctx.shadowBlur = p.kind === 'star' ? 10 : 6
        ctx.shadowColor = p.glow
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color

        if (p.kind === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.size * 0.42, p.spin)
        } else if (p.kind === 'glint') {
          drawGlint(ctx, p.x, p.y, p.size, p.spin)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        return true
      })
      ctx.restore()

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafRef.current)
      particlesRef.current = []
      trailRef.current = []
    }
  }, [enabled])

  function toLocal(event: ReactMouseEvent<HTMLElement>) {
    const section = sectionRef.current
    if (!section) return { x: 0, y: 0 }
    const rect = section.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function handleEnter(event: ReactMouseEvent<HTMLElement>) {
    if (!enabled) return
    const point = toLocal(event)
    targetRef.current = { ...point, active: true }
    wandPosRef.current = { x: point.x, y: point.y, ready: true }
    setHovering(true)
  }

  function handleMove(event: ReactMouseEvent<HTMLElement>) {
    if (!enabled) return
    const point = toLocal(event)
    targetRef.current = { ...point, active: true }
    setHovering(true)
  }

  function handleLeave() {
    targetRef.current.active = false
    setHovering(false)
  }

  return (
    <section
      ref={sectionRef}
      className={`${className ?? ''} ${enabled && hovering ? styles.sky : ''}`.trim()}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {enabled ? (
        <>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <div ref={wandRef} className={styles.wand} aria-hidden="true">
            <img src="/images/magic-wand.png" alt="" className={styles.wandImg} draggable={false} />
          </div>
        </>
      ) : null}
      {children}
    </section>
  )
}
