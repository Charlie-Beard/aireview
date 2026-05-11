import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Annotation, CritiqueCategory, SeverityLevel } from '../../types'
import { SeverityBadge } from '../ui/Badge'

interface Props {
  annotations: Annotation[]
  visible: boolean
  activeId: string | null
  onSelect: (id: string | null) => void
  containerWidth: number
  containerHeight: number
}

const CAT_COLORS: Record<CritiqueCategory, string> = {
  ux:            '#6C71C4',
  accessibility: '#DC322F',
  visual:        '#B58900',
  cta:           '#268BD2',
  onboarding:    '#2AA198',
  density:       '#CB4B16',
}

const SEV_RING: Record<SeverityLevel, string> = {
  critical:   '#DC322F',
  major:      '#CB4B16',
  minor:      '#B58900',
  suggestion: '#268BD2',
}

interface DotProps {
  ann: Annotation
  isActive: boolean
  onToggle: () => void
}

function AnnotationDot({ ann, isActive, onToggle }: DotProps) {
  const color = CAT_COLORS[ann.category]
  const ring  = SEV_RING[ann.severity]

  return (
    <motion.button
      className="absolute flex items-center justify-center rounded-full font-bold text-white cursor-pointer select-none"
      style={{
        left: `${ann.x}%`,
        top:  `${ann.y}%`,
        width:  28,
        height: 28,
        transform: 'translate(-50%, -50%)',
        background: color,
        border: `2px solid white`,
        boxShadow: `0 0 0 2px ${ring}55, 0 2px 10px rgba(0,0,0,0.20)`,
        fontSize: 10,
        zIndex: isActive ? 30 : 20,
      }}
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 22, delay: ann.index * 0.06 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {ann.index}
      {/* Pulse ring for critical/major */}
      {(ann.severity === 'critical' || ann.severity === 'major') && !isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{ scale: [1, 2.0], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}

interface CardProps {
  ann: Annotation
  containerWidth: number
  onClose: () => void
}

function AnnotationCard({ ann, containerWidth, onClose }: CardProps) {
  const color = CAT_COLORS[ann.category]
  const flipX = ann.x > 60
  const flipY = ann.y > 60

  const offsetX = flipX ? -240 : 20
  const offsetY = flipY ? -120 : 16

  return (
    <motion.div
      className="absolute"
      style={{
        left:   `${ann.x}%`,
        top:    `${ann.y}%`,
        zIndex: 40,
        width:  Math.min(260, containerWidth * 0.8),
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      initial={{ opacity: 0, scale: 0.88, y: flipY ? 8 : -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{   opacity: 0, scale: 0.88, y: flipY ? 8 : -8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,0,0,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="px-3.5 py-2.5 flex items-start justify-between gap-2"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: `${color}10` }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <SeverityBadge severity={ann.severity} />
              <span
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{ color }}
              >
                {ann.category}
              </span>
            </div>
            <p className="text-xs font-semibold text-sol-base02 leading-snug">
              {ann.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 mt-0.5 p-1 rounded-md hover:bg-black/08 transition-colors"
          >
            <X size={12} className="text-sol-base1" />
          </button>
        </div>
        {/* Body */}
        <div className="px-3.5 py-2.5">
          <p className="text-[11px] text-sol-base01 leading-relaxed">
            {ann.description.slice(0, 180)}
            {ann.description.length > 180 && '…'}
          </p>
        </div>
      </div>

      {/* Connector line */}
      <svg
        className="absolute pointer-events-none"
        style={{
          top: flipY ? 'auto' : -10,
          bottom: flipY ? -10 : 'auto',
          left: flipX ? 'auto' : 0,
          right: flipX ? 0 : 'auto',
          width: 2, height: 12,
        }}
      >
        <line x1="1" y1="0" x2="1" y2="12" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    </motion.div>
  )
}

export default function AnnotationLayer({
  annotations,
  visible,
  activeId,
  onSelect,
  containerWidth,
  containerHeight: _containerHeight,
}: Props) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {/* Dots — pointer-events on */}
      <div className="absolute inset-0 pointer-events-auto" onClick={() => onSelect(null)}>
        {annotations.map((ann) => (
          <AnnotationDot
            key={ann.id}
            ann={ann}
            isActive={activeId === ann.id}
            onToggle={() => onSelect(activeId === ann.id ? null : ann.id)}
          />
        ))}
      </div>

      {/* Card overlay */}
      <AnimatePresence>
        {annotations.map((ann) =>
          activeId === ann.id ? (
            <AnnotationCard
              key={`card-${ann.id}`}
              ann={ann}
              containerWidth={containerWidth}
              onClose={() => onSelect(null)}
            />
          ) : null,
        )}
      </AnimatePresence>
    </div>
  )
}
