import { clsx } from 'clsx'
import type { SeverityLevel } from '../../types'

interface SeverityBadgeProps {
  severity: SeverityLevel
  className?: string
}

const SEVERITY_STYLES: Record<SeverityLevel, string> = {
  critical:   'bg-red-100    text-red-700    border border-red-200',
  major:      'bg-orange-100 text-orange-700 border border-orange-200',
  minor:      'bg-yellow-100 text-yellow-700 border border-yellow-200',
  suggestion: 'bg-blue-100   text-blue-700   border border-blue-200',
}

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  critical:   'Critical',
  major:      'Major',
  minor:      'Minor',
  suggestion: 'Suggestion',
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: 'p0' | 'p1' | 'p2'
  className?: string
}

const PRIORITY_STYLES = {
  p0: 'bg-red-100    text-red-700    border border-red-200',
  p1: 'bg-orange-100 text-orange-700 border border-orange-200',
  p2: 'bg-blue-100   text-blue-700   border border-blue-200',
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority.toUpperCase()}
    </span>
  )
}

interface EffortBadgeProps {
  effort: 'low' | 'medium' | 'high'
  label: 'effort' | 'impact'
}

export function EffortImpactBadge({ effort, label }: EffortBadgeProps) {
  const color = effort === 'high' ? '#DC322F' : effort === 'medium' ? '#B58900' : '#2AA198'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      <span className="capitalize">{label}:</span>
      <span className="capitalize font-semibold">{effort}</span>
    </span>
  )
}
