export type AppView = 'landing' | 'analyzing' | 'workspace'

export type SeverityLevel = 'critical' | 'major' | 'minor' | 'suggestion'

export type CritiqueCategory =
  | 'ux'
  | 'accessibility'
  | 'visual'
  | 'cta'
  | 'onboarding'
  | 'density'

export interface Issue {
  id: string
  severity: SeverityLevel
  title: string
  description: string
  impact: string
  recommendation: string
}

export interface CritiqueDimension {
  id: CritiqueCategory
  name: string
  score: number
  color: string
  accentColor: string
  issues: Issue[]
}

export interface Annotation {
  id: string
  x: number
  y: number
  category: CritiqueCategory
  severity: SeverityLevel
  title: string
  description: string
  index: number
}

export interface HeatmapPoint {
  x: number
  y: number
  intensity: number
  radius: number
}

export interface CritiqueResult {
  overallScore: number
  grade: string
  gradeLabel: string
  executiveSummary: string
  pmRecommendations: PMRecommendation[]
  dimensions: CritiqueDimension[]
  annotations: Annotation[]
  heatmapPoints: HeatmapPoint[]
  confidence: number
  analysisTime: number
  detectedElements: string[]
}

export interface PMRecommendation {
  id: string
  priority: 'p0' | 'p1' | 'p2'
  title: string
  rationale: string
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
}
