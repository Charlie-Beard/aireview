import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { HeatmapPoint } from '../../types'
import { drawHeatmap } from '../../utils/heatmapUtils'

interface Props {
  points: HeatmapPoint[]
  visible: boolean
  width: number
  height: number
}

export default function HeatmapOverlay({ points, visible, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = width
    canvas.height = height
    if (visible) drawHeatmap(canvas, points)
  }, [visible, points, width, height])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ mixBlendMode: 'hard-light' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  )
}
