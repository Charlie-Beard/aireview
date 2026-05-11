import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import LandingPage    from './components/landing/LandingPage'
import AnalysisScreen from './components/analysis/AnalysisScreen'
import WorkspacePage  from './components/workspace/WorkspacePage'
import HowItWorksPage from './components/howItWorks/HowItWorksPage'

export default function App() {
  const view = useStore((s) => s.view)

  // Global keyboard: Cmd+K to open command palette when in workspace
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        const { openCommandPalette, commandPaletteOpen, view: v } = useStore.getState()
        if (!commandPaletteOpen && v === 'workspace') {
          e.preventDefault()
          openCommandPalette()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage />
        </motion.div>
      )}

      {view === 'analyzing' && (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
        >
          <AnalysisScreen />
        </motion.div>
      )}

      {view === 'workspace' && (
        <motion.div
          key="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ height: '100dvh' }}
        >
          <WorkspacePage />
        </motion.div>
      )}

      {view === 'howItWorks' && (
        <motion.div
          key="howItWorks"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <HowItWorksPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
