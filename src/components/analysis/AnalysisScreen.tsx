import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

const STAGE_ICONS: Record<string, string> = {
  'Initialising visual scanner…':          '🔬',
  'Loading OCR engine…':                    '⚙️',
  'Running optical character recognition…': '📝',
  'Detecting UI component patterns…':       '🧩',
  'Mapping visual hierarchy…':              '📐',
  'Identifying accessibility gaps…':        '♿',
  'Computing attention heatmap…':           '🔥',
  'Synthesising AI critique…':              '🤖',
  'Finalising report…':                     '✨',
}

export default function AnalysisScreen() {
  const { uploadedImage, analysisProgress, analysisStage } = useStore()
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [chars, setChars] = useState(0)
  const prevStage = useRef<string>('')
  const stageLog  = useRef<string[]>([])

  useEffect(() => {
    if (analysisStage && analysisStage !== prevStage.current) {
      prevStage.current = analysisStage
      stageLog.current  = [...stageLog.current, analysisStage]
      setCompletedStages([...stageLog.current])
    }
  }, [analysisStage])

  // Typewriter on current stage
  useEffect(() => {
    setChars(0)
    if (!analysisStage) return
    const total = analysisStage.length
    let i = 0
    const id = setInterval(() => {
      i++
      setChars(i)
      if (i >= total) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [analysisStage])

  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #FAF3D4 100%)' }}
    >
      {/* Animated scan line */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <motion.div
          className="w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(38,139,210,0.4) 50%, transparent 100%)',
          }}
          animate={{ y: [0, typeof window !== 'undefined' ? window.innerHeight : 800] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-8">

        {/* Image preview with scanning overlay */}
        {uploadedImage && (
          <motion.div
            className="relative w-full max-w-xs overflow-hidden rounded-2xl"
            style={{
              boxShadow: '0 16px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <img
              src={uploadedImage}
              alt="Analysing"
              className="w-full h-48 object-cover object-top"
            />
            {/* Scan overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(38,139,210,0.0) 0%, rgba(38,139,210,0.18) 50%, rgba(38,139,210,0.0) 100%)',
              }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(38,139,210,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(38,139,210,0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Corner markers */}
            {[
              'top-2 left-2 border-t-2 border-l-2',
              'top-2 right-2 border-t-2 border-r-2',
              'bottom-2 left-2 border-b-2 border-l-2',
              'bottom-2 right-2 border-b-2 border-r-2',
            ].map((cls, i) => (
              <motion.div
                key={i}
                className={`absolute w-4 h-4 ${cls}`}
                style={{ borderColor: '#268BD2' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}

        {/* Progress section */}
        <div className="w-full">
          {/* Stage label */}
          <div className="flex items-center justify-between mb-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={analysisStage}
                className="text-sm font-medium text-sol-base01"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                {STAGE_ICONS[analysisStage] || '⚡'}{' '}
                {analysisStage.slice(0, chars)}
                <span className="animate-pulse">_</span>
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-xs font-semibold text-sol-blue tabular-nums">
              {analysisProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #268BD2, #2AA198)' }}
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stage log */}
        <div
          className="w-full rounded-xl p-4 space-y-2"
          style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {completedStages.slice(-5).map((s, i) => (
            <motion.div
              key={s + i}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: i === completedStages.slice(-5).length - 1 ? 1 : 0.45, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: i === completedStages.slice(-5).length - 1 ? 'rgba(38,139,210,0.15)' : 'rgba(0,0,0,0.06)' }}
                animate={i === completedStages.slice(-5).length - 1 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <span style={{ fontSize: 8 }}>
                  {i === completedStages.slice(-5).length - 1 ? '●' : '✓'}
                </span>
              </motion.div>
              <span
                className="text-xs font-mono truncate"
                style={{ color: i === completedStages.slice(-5).length - 1 ? '#268BD2' : '#93A1A1' }}
              >
                {s}
              </span>
            </motion.div>
          ))}
        </div>

        {/* AI pulse indicator */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: '#268BD2' }}
                animate={{ height: [8, 20, 8] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <span className="text-xs text-sol-base1 font-medium">
            Analysing with AI…
          </span>
        </div>
      </div>
    </div>
  )
}
