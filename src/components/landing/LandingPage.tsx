import { useCallback, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Zap, Eye, Shield, Sparkles, Command, ArrowRight } from 'lucide-react'
import ParticleBackground from './ParticleBackground'
import GlassCard from '../ui/GlassCard'
import { useStore } from '../../store/useStore'
import { useImageAnalysis } from '../../hooks/useImageAnalysis'
import { useHaptic } from '../../hooks/useHaptic'

const FEATURE_CARDS = [
  {
    icon: <Zap size={18} className="text-sol-yellow" />,
    color: '#B58900',
    title: 'UX Critique',
    desc: 'Identifies friction, hierarchy issues, and conversion blockers with PM-grade analysis.',
  },
  {
    icon: <Eye size={18} className="text-sol-blue" />,
    color: '#268BD2',
    title: 'Attention Heatmap',
    desc: 'Simulates AI eye-tracking to reveal where users look — and where they get lost.',
  },
  {
    icon: <Shield size={18} className="text-sol-red" />,
    color: '#DC322F',
    title: 'Accessibility Audit',
    desc: 'Flags WCAG failures, contrast violations, and touch target issues instantly.',
  },
]

const DEMO_SCREENS = [
  { label: 'UX Score', value: '74', color: '#268BD2', unit: '/100' },
  { label: 'Issues Found', value: '12', color: '#DC322F', unit: '' },
  { label: 'A11y Rating', value: 'C+', color: '#B58900', unit: '' },
  { label: 'Confidence', value: '89', color: '#2AA198', unit: '%' },
]

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getImageDims(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = src
  })
}

export default function LandingPage() {
  const { setUploadedImage } = useStore()
  const { analyze }          = useImageAnalysis()
  const { trigger: haptic }  = useHaptic()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 18 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 18 })
  const floatX   = useTransform(smoothX, [0, 1], [-6, 6])
  const floatY   = useTransform(smoothY, [0, 1], [-4, 4])
  const floatXNeg = useTransform(floatX, (v) => -v)
  const floatYNeg = useTransform(floatY, (v) => -v)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, WebP, etc.)')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('Image must be under 20 MB.')
        return
      }
      setError(null)
      haptic('medium')
      const dataUrl = await readFileAsDataURL(file)
      const dims    = await getImageDims(dataUrl)
      setUploadedImage(dataUrl, file, dims)
      analyze(dataUrl, dims)
    },
    [analyze, setUploadedImage, haptic],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (accepted) => { if (accepted[0]) processFile(accepted[0]) },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
  })

  // Paste support
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? [])
      const img   = items.find((i) => i.type.startsWith('image/'))
      if (img) {
        const file = img.getAsFile()
        if (file) processFile(file)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [processFile])

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24 } },
  }

  return (
    <div
      className="min-h-dvh w-full relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #FAF3D4 40%, #F7EFD0 100%)' }}
    >
      <ParticleBackground />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(38,139,210,0.10) 0%, transparent 70%)',
          x: floatX, y: floatY,
        }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(181,137,0,0.09) 0%, transparent 70%)',
          x: floatXNeg,
          y: floatYNeg,
        }}
      />

      {/* Header */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-6 pt-6 pb-0 safe-top"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #268BD2, #2AA198)' }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sol-base02 text-sm tracking-tight">AI Product Critic</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => useStore.getState().setView('howItWorks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:-translate-y-px"
            style={{
              background: 'rgba(38,139,210,0.08)',
              border: '1px solid rgba(38,139,210,0.20)',
              color: '#268BD2',
            }}
          >
            How it works
          </button>
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-sol-base01 cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <Command size={11} />
            <span className="font-mono">K</span>
            <span className="ml-1">to search</span>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <motion.main
        className="relative z-10 flex flex-col items-center text-center px-5 pt-14 pb-8 md:pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
            style={{
              background: 'rgba(38,139,210,0.10)',
              border: '1px solid rgba(38,139,210,0.20)',
              color: '#268BD2',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
              style={{ background: '#268BD2' }}
            />
            AI-Powered UX Intelligence · Browser-Native
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-black tracking-tighter leading-none mb-5 text-sol-base02"
          style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)' }}
        >
          Drop a screen&shy;shot.
          <br />
          <span className="text-gradient-blue">Get expert critique.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-sol-base01 max-w-xl mb-10 leading-relaxed"
        >
          Instant UX analysis, attention heatmaps, accessibility audits, and PM-grade recommendations — entirely in your browser.
        </motion.p>

        {/* Drop zone */}
        <motion.div variants={itemVariants} className="w-full max-w-lg mb-4">
          <div
            {...getRootProps()}
            className="relative cursor-pointer group"
          >
            <input {...getInputProps()} />
            <motion.div
              className="rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-4 py-12 px-6"
              style={{
                borderColor: isDragActive || dragActive ? '#268BD2' : 'rgba(0,0,0,0.15)',
                background: isDragActive || dragActive
                  ? 'rgba(38,139,210,0.06)'
                  : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(20px)',
              }}
              animate={{
                scale: isDragActive ? 1.02 : 1,
                borderColor: isDragActive ? '#268BD2' : 'rgba(0,0,0,0.15)',
              }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: isDragActive ? 'rgba(38,139,210,0.15)' : 'rgba(38,139,210,0.08)',
                  border: '1px solid rgba(38,139,210,0.20)',
                }}
                animate={{ scale: isDragActive ? 1.1 : 1 }}
              >
                <Upload size={22} style={{ color: '#268BD2' }} />
              </motion.div>

              <div className="text-center">
                <p className="font-semibold text-sol-base02 text-base mb-1">
                  {isDragActive ? 'Release to analyse' : 'Drop a screenshot here'}
                </p>
                <p className="text-sm text-sol-base01">
                  or{' '}
                  <span className="text-sol-blue font-medium underline underline-offset-2 cursor-pointer">
                    browse files
                  </span>
                  {' · '}paste an image
                  {' · '}use your camera
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {['PNG', 'JPG', 'WebP', 'HEIC'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                    style={{
                      background: 'rgba(0,0,0,0.06)',
                      color: '#586E75',
                    }}
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-[11px] text-sol-base1">· max 20 MB</span>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.p
              className="mt-2 text-sm text-sol-red text-center"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Camera button (mobile) */}
        <motion.div variants={itemVariants} className="sm:hidden mb-8">
          <label className="btn-secondary cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) processFile(f)
              }}
            />
            <span className="text-sm">📷 Take a photo</span>
          </label>
        </motion.div>

        {/* Demo stats row */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 flex-wrap justify-center mb-14"
        >
          {DEMO_SCREENS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <span className="font-black text-xl leading-none" style={{ color: s.color }}>
                {s.value}
                <span className="text-xs font-medium">{s.unit}</span>
              </span>
              <span className="text-[10px] text-sol-base1 mt-0.5 font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.main>

      {/* Feature cards */}
      <motion.section
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 max-w-4xl mx-auto pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {FEATURE_CARDS.map((card, i) => (
          <motion.div key={i} variants={itemVariants}>
            <GlassCard className="h-full" hoverable>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
              >
                {card.icon}
              </div>
              <h3 className="font-semibold text-sol-base02 text-sm mb-1.5">{card.title}</h3>
              <p className="text-xs text-sol-base01 leading-relaxed">{card.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>

      {/* How it works */}
      <motion.section
        className="relative z-10 max-w-3xl mx-auto px-5 pb-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h2 className="font-bold text-sol-base02 text-lg mb-6">How it works</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
          {[
            { step: '01', label: 'Upload', desc: 'Drop any app or website screenshot' },
            { step: '02', label: 'Analyse', desc: 'AI scans for UX patterns and issues' },
            { step: '03', label: 'Critique', desc: 'Explore annotated findings and scores' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-0">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #268BD2, #2AA198)',
                    color: 'white',
                  }}
                >
                  {s.step}
                </div>
                <p className="font-semibold text-sol-base02 text-sm">{s.label}</p>
                <p className="text-xs text-sol-base1 mt-0.5 max-w-[120px] text-center">{s.desc}</p>
              </div>
              {i < 2 && (
                <ArrowRight
                  size={16}
                  className="text-sol-base1 hidden sm:block mx-3 mt-[-18px] flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8 text-[11px] text-sol-base1">
        100% browser-based · no data leaves your device · free forever
      </div>
    </div>
  )
}
