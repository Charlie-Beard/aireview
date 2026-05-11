import type { HeatmapPoint } from '../types'

export function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  alpha = 0.82,
): void {
  const { width, height } = canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  // Draw each point as a radial gradient
  for (const pt of points) {
    const cx = (pt.x / 100) * width
    const cy = (pt.y / 100) * height
    const r  = (pt.radius / 100) * Math.min(width, height)

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)

    const intensity = pt.intensity * alpha

    if (intensity > 0.7) {
      // Hot — solarized red/orange
      grad.addColorStop(0,   `rgba(220, 50, 47, ${intensity})`)
      grad.addColorStop(0.3, `rgba(203, 75, 22, ${intensity * 0.8})`)
      grad.addColorStop(0.6, `rgba(181,137,  0, ${intensity * 0.5})`)
      grad.addColorStop(1,   `rgba(38, 139,210, 0)`)
    } else if (intensity > 0.45) {
      // Warm — solarized orange/yellow
      grad.addColorStop(0,   `rgba(181,137,  0, ${intensity})`)
      grad.addColorStop(0.4, `rgba(38, 139,210, ${intensity * 0.6})`)
      grad.addColorStop(1,   `rgba(38, 139,210, 0)`)
    } else {
      // Cool — solarized blue/cyan
      grad.addColorStop(0,   `rgba(38, 139,210, ${intensity})`)
      grad.addColorStop(0.5, `rgba(42, 161,152, ${intensity * 0.5})`)
      grad.addColorStop(1,   `rgba(42, 161,152, 0)`)
    }

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  }
}

