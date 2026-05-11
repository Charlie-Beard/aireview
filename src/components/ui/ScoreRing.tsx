import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
  animate?: boolean
}

export default function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  color = '#268BD2',
  label,
  sublabel,
  animate = true,
}: Props) {
  const r     = (size - strokeWidth) / 2
  const circ  = 2 * Math.PI * r
  const progress = useMotionValue(0)
  const spring   = useSpring(progress, { stiffness: 60, damping: 20 })
  const dashOffset = useTransform(spring, (v) => circ - (v / 100) * circ)
  const displayScore = useTransform(spring, (v) => Math.round(v))

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => progress.set(score), 120)
      return () => clearTimeout(t)
    } else {
      progress.set(score)
    }
  }, [score, animate, progress])

  const trackColor = '#EDE8D5'

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        {/* Score number */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            style={{ fontSize: size * 0.24, fontWeight: 700, color: '#073642', lineHeight: 1 }}
          >
            {displayScore}
          </motion.span>
        </div>
      </div>
      {label && (
        <p style={{ fontSize: 11, fontWeight: 600, color: '#586E75', textAlign: 'center', margin: 0 }}>
          {label}
        </p>
      )}
      {sublabel && (
        <p style={{ fontSize: 10, color: '#93A1A1', textAlign: 'center', margin: 0 }}>
          {sublabel}
        </p>
      )}
    </div>
  )
}
