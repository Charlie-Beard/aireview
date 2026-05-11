import { create } from 'zustand'
import type {
  AppView,
  CritiqueCategory,
  CritiqueResult,
} from '../types'

interface AppState {
  view: AppView
  uploadedImage: string | null
  imageFile: File | null
  imageDimensions: { width: number; height: number } | null
  isAnalyzing: boolean
  analysisProgress: number
  analysisStage: string
  ocrText: string
  critique: CritiqueResult | null
  showHeatmap: boolean
  showAnnotations: boolean
  activeAnnotation: string | null
  activeDimension: CritiqueCategory | null
  commandPaletteOpen: boolean
  reportModalOpen: boolean
  speakingCritique: boolean

  setView: (view: AppView) => void
  setUploadedImage: (
    image: string,
    file: File,
    dims: { width: number; height: number },
  ) => void
  setAnalyzing: (analyzing: boolean, progress?: number, stage?: string) => void
  setCritique: (critique: CritiqueResult) => void
  setOcrText: (text: string) => void
  toggleHeatmap: () => void
  toggleAnnotations: () => void
  setActiveAnnotation: (id: string | null) => void
  setActiveDimension: (dim: CritiqueCategory | null) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleReportModal: () => void
  setSpeaking: (v: boolean) => void
  reset: () => void
}

const initialState = {
  view: 'landing' as AppView,
  uploadedImage: null,
  imageFile: null,
  imageDimensions: null,
  isAnalyzing: false,
  analysisProgress: 0,
  analysisStage: '',
  ocrText: '',
  critique: null,
  showHeatmap: false,
  showAnnotations: true,
  activeAnnotation: null,
  activeDimension: null,
  commandPaletteOpen: false,
  reportModalOpen: false,
  speakingCritique: false,
}

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setView: (view) => set({ view }),
  setUploadedImage: (image, file, dims) =>
    set({ uploadedImage: image, imageFile: file, imageDimensions: dims }),
  setAnalyzing: (analyzing, progress = 0, stage = '') =>
    set({ isAnalyzing: analyzing, analysisProgress: progress, analysisStage: stage }),
  setCritique: (critique) => set({ critique }),
  setOcrText: (text) => set({ ocrText: text }),
  toggleHeatmap: () => set((s) => ({ showHeatmap: !s.showHeatmap })),
  toggleAnnotations: () => set((s) => ({ showAnnotations: !s.showAnnotations })),
  setActiveAnnotation: (id) => set({ activeAnnotation: id }),
  setActiveDimension: (dim) => set({ activeDimension: dim }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleReportModal: () => set((s) => ({ reportModalOpen: !s.reportModalOpen })),
  setSpeaking: (v) => set({ speakingCritique: v }),
  reset: () => set(initialState),
}))
