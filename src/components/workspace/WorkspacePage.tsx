import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import {
  ArrowLeft, Command, Flame, Eye, ChevronDown, ChevronUp,
  RefreshCw, Pin,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import CritiquePanel from './CritiquePanel'
import AnnotationLayer from './AnnotationLayer'
import HeatmapOverlay from './HeatmapOverlay'
import CommandPalette from '../ui/CommandPalette'
import { useHaptic } from '../../hooks/useHaptic'

const MIN_SCALE = 0.3
const MAX_SCALE = 5

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export default function WorkspacePage() {
  const {
    uploadedImage, imageDimensions, critique,
    showHeatmap, showAnnotations, toggleHeatmap, toggleAnnotations,
    activeAnnotation, setActiveAnnotation,
    commandPaletteOpen, openCommandPalette, reset,
  } = useStore()

  const { trigger: haptic } = useHaptic()
  const containerRef  = useRef<HTMLDivElement>(null)
  const imageRef      = useRef<HTMLDivElement>(null)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [panelOpen, setPanelOpen] = useState(true)
  const isMobile = window.innerWidth < 768

  // Transform state
  const x     = useMotionValue(0)
  const y     = useMotionValue(0)
  const scale = useMotionValue(1)
  const smoothX = useSpring(x, { stiffness: 200, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 200, damping: 30 })

  // Fit image on mount
  useEffect(() => {
    if (!imageDimensions || !containerRef.current) return
    const container = containerRef.current
    const cw = container.clientWidth  - (isMobile ? 0 : 340) // panel width on desktop
    const ch = container.clientHeight - (isMobile ? 0 : 20)
    const ar = imageDimensions.width / imageDimensions.height
    let w = cw * 0.9
    let h = w / ar
    if (h > ch * 0.85) { h = ch * 0.85; w = h * ar }
    setImgSize({ w, h })
    x.set(0); y.set(0); scale.set(1)
  }, [imageDimensions, isMobile, x, y, scale])

  // Gesture: drag + pinch — attach directly to imageRef via target
  useGesture(
    {
      onDrag: ({ offset: [ox, oy], first }) => {
        if (first) haptic('light')
        x.set(ox)
        y.set(oy)
      },
      onPinch: ({ offset: [s], first }) => {
        if (first) haptic('light')
        scale.set(clamp(s, MIN_SCALE, MAX_SCALE))
      },
      onWheel: ({ delta: [, dy] }) => {
        const next = clamp(scale.get() * (1 - dy * 0.002), MIN_SCALE, MAX_SCALE)
        scale.set(next)
      },
      onDoubleClick: () => {
        haptic('medium')
        x.set(0); y.set(0); scale.set(1)
      },
    },
    {
      target: imageRef as React.RefObject<HTMLElement>,
      drag:  { from: () => [x.get(), y.get()], filterTaps: true },
      pinch: { from: () => [scale.get(), 0], scaleBounds: { min: MIN_SCALE, max: MAX_SCALE } },
      wheel: { preventDefault: true },
    },
  )

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
      if (e.key === 'h') toggleHeatmap()
      if (e.key === 'a') toggleAnnotations()
      if (e.key === 'Escape') setActiveAnnotation(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openCommandPalette, toggleHeatmap, toggleAnnotations, setActiveAnnotation])

  const resetTransform = useCallback(() => {
    x.set(0); y.set(0); scale.set(1)
  }, [x, y, scale])

  if (!uploadedImage || !critique) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #FAF3D4 100%)' }}
    >
      {/* Canvas area */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{ touchAction: 'none' }}
      >
        {/* Top bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 safe-top"
          style={{
            background: 'rgba(253,246,227,0.88)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={reset}
            className="p-1.5 rounded-lg hover:bg-black/06 transition-colors"
          >
            <ArrowLeft size={16} className="text-sol-base01" />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0 ring-1 ring-black/10">
              <img src={uploadedImage} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-sol-base02 truncate">
              AI Product Critique
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold tabular-nums"
              style={{ background: 'rgba(38,139,210,0.10)', color: '#268BD2' }}
            >
              {critique.overallScore}/100
            </span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleAnnotations}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: showAnnotations ? 'rgba(108,113,196,0.12)' : 'rgba(0,0,0,0.05)',
                color: showAnnotations ? '#6C71C4' : '#586E75',
                border: `1px solid ${showAnnotations ? 'rgba(108,113,196,0.25)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Pin size={12} />
              <span className="hidden sm:inline">Pins</span>
            </button>
            <button
              onClick={toggleHeatmap}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: showHeatmap ? 'rgba(220,50,47,0.10)' : 'rgba(0,0,0,0.05)',
                color: showHeatmap ? '#DC322F' : '#586E75',
                border: `1px solid ${showHeatmap ? 'rgba(220,50,47,0.22)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Flame size={12} />
              <span className="hidden sm:inline">Heatmap</span>
            </button>
            <button
              onClick={resetTransform}
              className="p-1.5 rounded-lg hover:bg-black/06 transition-colors"
              title="Reset zoom"
            >
              <RefreshCw size={13} className="text-sol-base01" />
            </button>
            <button
              onClick={openCommandPalette}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#586E75', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <Command size={11} />
              <span className="font-mono">K</span>
            </button>
          </div>
        </motion.div>

        {/* Image canvas */}
        <motion.div
          ref={imageRef as React.RefObject<HTMLDivElement>}
          className="relative select-none"
          style={{
            width: imgSize.w,
            height: imgSize.h,
            x: smoothX,
            y: smoothY,
            scale,
            cursor: 'grab',
            touchAction: 'none',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.15 }}
        >
          <img
            src={uploadedImage}
            alt="Product screenshot"
            className="w-full h-full object-contain"
            draggable={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 8px 48px rgba(0,0,0,0.14), 0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />

          {/* Heatmap overlay */}
          {critique.heatmapPoints && (
            <HeatmapOverlay
              points={critique.heatmapPoints}
              visible={showHeatmap}
              width={imgSize.w}
              height={imgSize.h}
            />
          )}

          {/* Annotations */}
          <AnnotationLayer
            annotations={critique.annotations}
            visible={showAnnotations}
            activeId={activeAnnotation}
            onSelect={setActiveAnnotation}
            containerWidth={imgSize.w}
            containerHeight={imgSize.h}
          />
        </motion.div>

        {/* Zoom hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-sol-base1 flex items-center gap-1.5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Eye size={11} />
          pinch or scroll to zoom · double-tap to reset
        </motion.div>
      </div>

      {/* DESKTOP: Right panel */}
      <motion.div
        className="hidden md:flex flex-col w-80 xl:w-96 border-l bg-warm-50/80"
        style={{
          borderColor: 'rgba(0,0,0,0.07)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(253,246,227,0.80)',
        }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 26 }}
      >
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(0,0,0,0.07)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-sol-base01">Critique</span>
          <span className="text-[10px] text-sol-base1 font-mono">{critique.confidence}% confidence</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <CritiquePanel />
        </div>
      </motion.div>

      {/* MOBILE: Bottom sheet */}
      <motion.div
        className="md:hidden fixed left-0 right-0 z-20"
        style={{ bottom: 0 }}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 240, damping: 28 }}
      >
        {/* Handle */}
        <button
          className="w-full flex items-center justify-between px-5 py-3"
          style={{
            background: 'rgba(253,246,227,0.95)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            borderBottom: panelOpen ? '1px solid rgba(0,0,0,0.05)' : 'none',
          }}
          onClick={() => setPanelOpen((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sol-base01">Critique</span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(38,139,210,0.10)', color: '#268BD2' }}
            >
              {critique.overallScore}/100 · {critique.grade}
            </span>
          </div>
          {panelOpen ? (
            <ChevronDown size={15} className="text-sol-base1" />
          ) : (
            <ChevronUp size={15} className="text-sol-base1" />
          )}
        </button>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '52vh' }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
              style={{ background: 'rgba(253,246,227,0.95)', backdropFilter: 'blur(24px)' }}
            >
              <div className="h-full overflow-y-auto no-scrollbar">
                <CritiquePanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Command palette */}
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
    </div>
  )
}
