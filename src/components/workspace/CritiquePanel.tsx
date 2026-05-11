import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronUp, Volume2, Square, Download, X, Zap, Shield,
  Eye, MessageSquare, Users, AlignJustify, BarChart2, ArrowRight,
} from 'lucide-react'
import ScoreRing from '../ui/ScoreRing'
import { SeverityBadge, PriorityBadge, EffortImpactBadge } from '../ui/Badge'
import { useStore } from '../../store/useStore'
import { useSpeech } from '../../hooks/useSpeech'
import type { CritiqueDimension, CritiqueCategory } from '../../types'

const CAT_ICONS: Record<CritiqueCategory, React.ReactNode> = {
  ux:            <Zap size={13} />,
  accessibility: <Shield size={13} />,
  visual:        <Eye size={13} />,
  cta:           <MessageSquare size={13} />,
  onboarding:    <Users size={13} />,
  density:       <AlignJustify size={13} />,
}

function DimensionCard({ dim, isActive, onClick }: {
  dim: CritiqueDimension
  isActive: boolean
  onClick: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: isActive ? `${dim.color}10` : 'rgba(255,255,255,0.55)',
        border: `1px solid ${isActive ? dim.color + '40' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isActive ? `0 0 0 1px ${dim.color}20` : 'none',
      }}
      layout
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => { onClick(); setExpanded(!expanded || !isActive) }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${dim.color}18`, color: dim.color }}
        >
          {CAT_ICONS[dim.id]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-sol-base02 truncate">{dim.name}</span>
            <span className="font-bold text-sm tabular-nums" style={{ color: dim.color }}>
              {dim.score}
            </span>
          </div>
          {/* Score bar */}
          <div className="mt-1.5 h-1 rounded-full w-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: dim.color }}
              initial={{ width: 0 }}
              animate={{ width: `${dim.score}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="text-sol-base1 flex-shrink-0">
          {expanded && isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Issues expand */}
      <AnimatePresence>
        {expanded && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-black/06 pt-3">
              {dim.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.07)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-semibold text-sol-base02 leading-snug">{issue.title}</p>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="text-[11px] text-sol-base01 leading-relaxed mb-2">{issue.description}</p>
                  <div
                    className="rounded-md px-2.5 py-1.5 flex gap-1.5"
                    style={{ background: `${dim.color}0c`, border: `1px solid ${dim.color}20` }}
                  >
                    <span className="text-[10px] font-semibold" style={{ color: dim.color }}>FIX</span>
                    <p className="text-[10px] text-sol-base01 leading-relaxed">{issue.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ReportModalProps {
  onClose: () => void
}

function ReportModal({ onClose }: ReportModalProps) {
  const critique = useStore((s) => s.critique)
  if (!critique) return null

  const handleExport = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>AI Product Critique Report</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 24px; color: #073642; background: #FDF6E3; }
    h1 { font-size: 28px; font-weight: 900; margin-bottom: 4px; }
    .score { font-size: 64px; font-weight: 900; color: #268BD2; }
    .grade { font-size: 24px; font-weight: 700; color: #2AA198; }
    .dim { margin: 16px 0; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.1); }
    .issue { margin: 8px 0; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); }
    .rec { margin: 10px 0; padding: 12px; border-radius: 10px; background: rgba(38,139,210,0.06); border: 1px solid rgba(38,139,210,0.20); }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.06); }
    hr { border: none; border-top: 1px solid rgba(0,0,0,0.10); margin: 24px 0; }
  </style>
</head>
<body>
  <h1>AI Product Critique</h1>
  <p style="color:#586E75;margin-bottom:24px">Generated by AI Product Critic · ${new Date().toLocaleDateString()}</p>
  <div style="display:flex;align-items:center;gap:24px;margin:24px 0">
    <div><div class="score">${critique.overallScore}</div><div style="color:#586E75;font-size:12px">Overall Score</div></div>
    <div><div class="grade">${critique.grade}</div><div style="color:#586E75;font-size:12px">${critique.gradeLabel}</div></div>
    <div><div style="font-size:24px;font-weight:700;color:#2AA198">${critique.confidence}%</div><div style="color:#586E75;font-size:12px">Confidence</div></div>
  </div>
  <h2>Executive Summary</h2>
  <p>${critique.executiveSummary}</p>
  <hr/>
  <h2>Dimension Scores</h2>
  ${critique.dimensions.map(d => `
    <div class="dim">
      <strong>${d.name}</strong> — <span style="color:${d.color}">${d.score}/100</span>
      ${d.issues.map(i => `
        <div class="issue">
          <strong>${i.title}</strong>
          <span class="badge" style="margin-left:8px">${i.severity}</span>
          <p style="font-size:12px;margin:6px 0 4px">${i.description}</p>
          <p style="font-size:11px;color:#268BD2"><strong>Fix:</strong> ${i.recommendation}</p>
        </div>
      `).join('')}
    </div>
  `).join('')}
  <hr/>
  <h2>PM Recommendations</h2>
  ${critique.pmRecommendations.map(r => `
    <div class="rec">
      <span class="badge">${r.priority.toUpperCase()}</span>
      <strong style="margin-left:8px">${r.title}</strong>
      <p style="font-size:12px;margin:6px 0 4px">${r.rationale}</p>
      <p style="font-size:11px;color:#586E75">Effort: ${r.effort} · Impact: ${r.impact}</p>
    </div>
  `).join('')}
  <hr/>
  <p style="font-size:11px;color:#93A1A1">AI Product Critic · Browser-native analysis · ${new Date().toISOString()}</p>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'product-critique.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm glass-panel-strong rounded-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-sol-base02 text-base">Export Report</h3>
            <p className="text-xs text-sol-base1 mt-0.5">Generates a standalone HTML report</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/06 transition-colors">
            <X size={14} className="text-sol-base1" />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(38,139,210,0.06)', border: '1px solid rgba(38,139,210,0.15)' }}>
            <BarChart2 size={15} className="text-sol-blue flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-sol-base02">Overall score: {critique.overallScore}/100 ({critique.grade})</p>
              <p className="text-[11px] text-sol-base1">{critique.dimensions.length} dimensions · {critique.pmRecommendations.length} PM recommendations</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary text-center justify-center">
            Cancel
          </button>
          <button onClick={handleExport} className="flex-1 btn-primary justify-center">
            <Download size={13} />
            Export HTML
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CritiquePanel() {
  const {
    critique, activeDimension, setActiveDimension,
    showHeatmap, toggleHeatmap, showAnnotations, toggleAnnotations,
    reportModalOpen, toggleReportModal, speakingCritique,
  } = useStore()
  const { speak, stop } = useSpeech()

  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'pm'>('overview')

  if (!critique) return null

  const handleSpeak = () => {
    if (speakingCritique) {
      stop()
    } else {
      speak(
        `Overall score: ${critique.overallScore} out of 100. Grade: ${critique.grade}, ${critique.gradeLabel}. ` +
        critique.executiveSummary +
        ` Key recommendations: ${critique.pmRecommendations.slice(0, 2).map((r) => r.title).join('. ')}.`,
      )
    }
  }

  const TABS = [
    { id: 'overview',   label: 'Overview' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'pm',         label: 'PM Recs' },
  ] as const

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Score header */}
        <div
          className="flex items-center gap-5 px-5 py-4 border-b"
          style={{ borderColor: 'rgba(0,0,0,0.07)' }}
        >
          <ScoreRing
            score={critique.overallScore}
            size={72}
            strokeWidth={5}
            color="#268BD2"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-2xl text-sol-base02">{critique.grade}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(38,139,210,0.10)', color: '#268BD2' }}
              >
                {critique.gradeLabel}
              </span>
            </div>
            <p className="text-[11px] text-sol-base1 mt-0.5 truncate">
              {critique.detectedElements.slice(0, 3).join(' · ')}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-sol-base1 font-medium">
                {critique.confidence}% confidence
              </span>
              <span className="text-[10px] text-sol-base1">
                {critique.analysisTime}ms
              </span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: speakingCritique ? 'rgba(38,139,210,0.12)' : 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: speakingCritique ? '#268BD2' : '#586E75',
              }}
              title={speakingCritique ? 'Stop reading' : 'Read aloud'}
            >
              {speakingCritique ? <Square size={13} /> : <Volume2 size={13} />}
            </button>
            <button
              onClick={toggleReportModal}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#586E75' }}
              title="Export report"
            >
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 px-4 pt-3 pb-0 border-b"
          style={{ borderColor: 'rgba(0,0,0,0.07)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors"
              style={{
                color: activeTab === tab.id ? '#268BD2' : '#586E75',
                background: activeTab === tab.id ? 'rgba(38,139,210,0.08)' : 'transparent',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#268BD2' }}
                  layoutId="tab-indicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-4"
              >
                {/* Executive summary */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(38,139,210,0.05)', border: '1px solid rgba(38,139,210,0.14)' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: '#268BD2' }}
                    >
                      Executive Summary
                    </span>
                  </div>
                  <p className="text-xs text-sol-base01 leading-relaxed">{critique.executiveSummary}</p>
                </div>

                {/* Dimension scores grid */}
                <div className="grid grid-cols-2 gap-2">
                  {critique.dimensions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveDimension(activeDimension === d.id ? null : d.id)}
                      className="rounded-xl p-3 text-left transition-all"
                      style={{
                        background: activeDimension === d.id ? `${d.color}12` : 'rgba(255,255,255,0.55)',
                        border: `1px solid ${activeDimension === d.id ? d.color + '40' : 'rgba(0,0,0,0.07)'}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: d.color }}
                        >
                          {d.name}
                        </span>
                        <span className="font-bold text-xs tabular-nums" style={{ color: d.color }}>
                          {d.score}
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Toggle controls */}
                <div className="space-y-2">
                  {[
                    { label: 'Annotation pins', state: showAnnotations, toggle: toggleAnnotations },
                    { label: 'Attention heatmap', state: showHeatmap, toggle: toggleHeatmap },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(0,0,0,0.07)' }}
                    >
                      <span className="text-xs font-medium text-sol-base01">{item.label}</span>
                      <button
                        onClick={item.toggle}
                        className="relative rounded-full transition-colors flex-shrink-0"
                        style={{
                          background: item.state ? '#268BD2' : 'rgba(0,0,0,0.12)',
                          width: 40, height: 22,
                        }}
                      >
                        <motion.div
                          className="absolute rounded-full bg-white"
                          style={{ width: 18, height: 18, top: 2 }}
                          animate={{ left: item.state ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'dimensions' && (
              <motion.div
                key="dimensions"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-2"
              >
                {critique.dimensions.map((dim) => (
                  <DimensionCard
                    key={dim.id}
                    dim={dim}
                    isActive={activeDimension === dim.id}
                    onClick={() => setActiveDimension(activeDimension === dim.id ? null : dim.id)}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'pm' && (
              <motion.div
                key="pm"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-3"
              >
                <p className="text-xs text-sol-base1 leading-relaxed px-1">
                  Prioritised product recommendations ranked by impact and effort ratio.
                </p>
                {critique.pmRecommendations.map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    className="rounded-xl p-3.5"
                    style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(0,0,0,0.07)' }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <PriorityBadge priority={rec.priority} />
                      <p className="text-xs font-semibold text-sol-base02 leading-snug flex-1">{rec.title}</p>
                    </div>
                    <p className="text-[11px] text-sol-base01 leading-relaxed mb-2">{rec.rationale}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <EffortImpactBadge effort={rec.effort} label="effort" />
                      <EffortImpactBadge effort={rec.impact} label="impact" />
                      <div className="flex items-center gap-0.5 ml-auto">
                        <ArrowRight size={10} className="text-sol-blue" />
                        <span className="text-[10px] font-medium text-sol-blue">Investigate</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Report modal */}
      <AnimatePresence>
        {reportModalOpen && <ReportModal onClose={toggleReportModal} />}
      </AnimatePresence>
    </>
  )
}
