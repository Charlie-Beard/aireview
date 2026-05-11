import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Flame, Eye, EyeOff, Volume2, Download, RefreshCw, X, Zap, Shield, BarChart2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useSpeech } from '../../hooks/useSpeech'

interface Command {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
  keywords: string[]
}

export default function CommandPalette() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { closeCommandPalette, toggleHeatmap, toggleAnnotations, showHeatmap, showAnnotations, critique, toggleReportModal, reset } = useStore()
  const { speak, stop } = useSpeech()

  const commands: Command[] = [
    {
      id: 'heatmap',
      label: showHeatmap ? 'Hide attention heatmap' : 'Show attention heatmap',
      description: 'Toggle AI attention simulation overlay',
      icon: <Flame size={15} />,
      action: () => { toggleHeatmap(); closeCommandPalette() },
      keywords: ['heatmap', 'attention', 'heat', 'eye', 'tracking'],
    },
    {
      id: 'annotations',
      label: showAnnotations ? 'Hide annotations' : 'Show annotations',
      description: 'Toggle critique annotation pins',
      icon: showAnnotations ? <EyeOff size={15} /> : <Eye size={15} />,
      action: () => { toggleAnnotations(); closeCommandPalette() },
      keywords: ['annotations', 'pins', 'overlay', 'hide', 'show'],
    },
    {
      id: 'speak',
      label: 'Read critique aloud',
      description: 'Synthesise the executive summary with speech',
      icon: <Volume2 size={15} />,
      action: () => {
        if (critique) speak(`${critique.executiveSummary} Key recommendations: ${critique.pmRecommendations.slice(0,2).map(r => r.title).join('. ')}`)
        closeCommandPalette()
      },
      keywords: ['speak', 'voice', 'audio', 'read', 'speech', 'tts'],
    },
    {
      id: 'stop-speak',
      label: 'Stop speaking',
      description: 'Cancel current speech synthesis',
      icon: <X size={15} />,
      action: () => { stop(); closeCommandPalette() },
      keywords: ['stop', 'cancel', 'quiet', 'mute'],
    },
    {
      id: 'accessibility',
      label: 'Jump to Accessibility issues',
      description: 'Filter critique to accessibility findings',
      icon: <Shield size={15} />,
      action: () => {
        useStore.getState().setActiveDimension('accessibility')
        closeCommandPalette()
      },
      keywords: ['accessibility', 'a11y', 'wcag', 'contrast', 'screen reader'],
    },
    {
      id: 'ux',
      label: 'Jump to UX Flow issues',
      description: 'Filter critique to UX findings',
      icon: <Zap size={15} />,
      action: () => {
        useStore.getState().setActiveDimension('ux')
        closeCommandPalette()
      },
      keywords: ['ux', 'flow', 'friction', 'navigation', 'user experience'],
    },
    {
      id: 'scores',
      label: 'View all dimension scores',
      description: 'See the full scoring breakdown',
      icon: <BarChart2 size={15} />,
      action: () => {
        useStore.getState().setActiveDimension(null)
        closeCommandPalette()
      },
      keywords: ['scores', 'scorecard', 'overview', 'dashboard'],
    },
    {
      id: 'report',
      label: 'Export critique report',
      description: 'Generate a shareable report',
      icon: <Download size={15} />,
      action: () => { toggleReportModal(); closeCommandPalette() },
      keywords: ['export', 'report', 'download', 'share', 'pdf'],
    },
    {
      id: 'new',
      label: 'Analyse a new screenshot',
      description: 'Start over with a new image',
      icon: <RefreshCw size={15} />,
      action: () => { reset(); closeCommandPalette() },
      keywords: ['new', 'restart', 'reset', 'another', 'start over'],
    },
  ]

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords.some((k) => k.includes(query.toLowerCase())),
      )
    : commands

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCommandPalette()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCommandPalette])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCommandPalette}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ y: -20, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -20, scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-panel-strong rounded-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/8">
              <Search size={16} className="text-sol-base0 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                className="flex-1 bg-transparent text-sm text-sol-base02 placeholder-sol-base1 outline-none"
              />
              <kbd className="text-[10px] text-sol-base1 bg-warm-200 border border-black/10 rounded px-1.5 py-0.5 font-mono">
                ESC
              </kbd>
            </div>

            {/* Commands */}
            <div className="max-h-80 overflow-y-auto py-2 no-scrollbar">
              {filtered.length === 0 && (
                <p className="text-sm text-sol-base1 text-center py-8">No commands match</p>
              )}
              {filtered.map((cmd, i) => (
                <motion.button
                  key={cmd.id}
                  className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-warm-200/60 transition-colors"
                  onClick={cmd.action}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <span className="mt-0.5 text-sol-base0 flex-shrink-0">{cmd.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-sol-base02">{cmd.label}</p>
                    <p className="text-xs text-sol-base1 mt-0.5 truncate">{cmd.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-black/8 px-4 py-2 flex items-center gap-4">
              <span className="text-[11px] text-sol-base1">
                <kbd className="bg-warm-200 border border-black/10 rounded px-1 py-0.5 font-mono text-[10px] mr-1">↑↓</kbd>
                navigate
              </span>
              <span className="text-[11px] text-sol-base1">
                <kbd className="bg-warm-200 border border-black/10 rounded px-1 py-0.5 font-mono text-[10px] mr-1">↵</kbd>
                select
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
