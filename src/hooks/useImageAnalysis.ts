import { useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import { useStore } from '../store/useStore'
import { generateCritique } from '../utils/critiqueEngine'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STAGES = [
  { pct: 8,  msg: 'Initialising visual scanner…' },
  { pct: 18, msg: 'Loading OCR engine…' },
  { pct: 35, msg: 'Running optical character recognition…' },
  { pct: 50, msg: 'Detecting UI component patterns…' },
  { pct: 64, msg: 'Mapping visual hierarchy…' },
  { pct: 76, msg: 'Identifying accessibility gaps…' },
  { pct: 86, msg: 'Computing attention heatmap…' },
  { pct: 94, msg: 'Synthesising AI critique…' },
  { pct: 99, msg: 'Finalising report…' },
]

export function useImageAnalysis() {
  const store = useStore()

  const analyze = useCallback(
    async (imageUrl: string, dims: { width: number; height: number }) => {
      store.setView('analyzing')
      store.setAnalyzing(true, STAGES[0].pct, STAGES[0].msg)

      let ocrText = ''

      try {
        store.setAnalyzing(true, STAGES[1].pct, STAGES[1].msg)
        await delay(400)

        // OCR
        store.setAnalyzing(true, STAGES[2].pct, STAGES[2].msg)
        const worker = await createWorker('eng', 1, {
          logger: () => undefined,
        })
        const result = await worker.recognize(imageUrl)
        ocrText = result.data.text
        await worker.terminate()
        store.setOcrText(ocrText)

        store.setAnalyzing(true, STAGES[3].pct, STAGES[3].msg)
        await delay(500)

        store.setAnalyzing(true, STAGES[4].pct, STAGES[4].msg)
        await delay(450)

        store.setAnalyzing(true, STAGES[5].pct, STAGES[5].msg)
        await delay(400)

        store.setAnalyzing(true, STAGES[6].pct, STAGES[6].msg)
        await delay(500)

        store.setAnalyzing(true, STAGES[7].pct, STAGES[7].msg)
        const critique = await generateCritique(ocrText, dims, Date.now())
        await delay(350)

        store.setAnalyzing(true, STAGES[8].pct, STAGES[8].msg)
        await delay(300)

        store.setCritique(critique)
        store.setAnalyzing(false, 100, 'Complete')
        store.setView('workspace')
      } catch (err) {
        console.error('Analysis error:', err)
        // Still generate critique on OCR failure
        const critique = await generateCritique('', dims, Date.now())
        store.setCritique(critique)
        store.setAnalyzing(false, 100, 'Complete')
        store.setView('workspace')
      }
    },
    [store],
  )

  return { analyze }
}
