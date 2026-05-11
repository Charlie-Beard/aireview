import { useEffect, useRef } from 'react'
import { useDeviceMotion } from '../../hooks/useDeviceMotion'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; color: string; z: number
}

const COLORS = ['#268BD2', '#2AA198', '#B58900', '#6C71C4', '#CB4B16']

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const frameRef    = useRef<number>()
  const motionRef   = useRef({ x: 0, y: 0 })
  const motion      = useDeviceMotion(8)

  useEffect(() => { motionRef.current = motion }, [motion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }

    function createParticles(w: number, h: number): Particle[] {
      return Array.from({ length: 110 }, () => {
        const z = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35 * (z + 0.2),
          vy: (Math.random() - 0.5) * 0.35 * (z + 0.2),
          size: 1.2 + Math.random() * 2.2 * z,
          opacity: 0.12 + Math.random() * 0.36 * z,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          z,
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)

    let tick = 0
    const draw = () => {
      tick += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Soft radial gradient background
      const cx = canvas.width  / 2 + motionRef.current.x * 3
      const cy = canvas.height / 2 + motionRef.current.y * 3
      const bg = ctx.createRadialGradient(cx, cy * 0.6, 0, cx, cy, canvas.width * 0.85)
      bg.addColorStop(0,   'rgba(38,139,210,0.07)')
      bg.addColorStop(0.4, 'rgba(181,137,0,0.04)')
      bg.addColorStop(1,   'rgba(253,246,227,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const pts = particlesRef.current
      const mx  = motionRef.current.x
      const my  = motionRef.current.y

      // Draw connection lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            const a = (1 - d / 120) * 0.12 * pts[i].opacity
            ctx.strokeStyle = `rgba(38,139,210,${a})`
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        const pulse = 0.85 + 0.15 * Math.sin(tick * 1.5 + p.x * 0.05)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Update position with parallax
        p.x += p.vx + mx * 0.012 * p.z
        p.y += p.vy + my * 0.012 * p.z

        if (p.x < -10) p.x = canvas.width  + 10
        if (p.x > canvas.width  + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
      }

      frameRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
