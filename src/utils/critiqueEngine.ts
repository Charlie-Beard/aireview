import type {
  CritiqueResult,
  CritiqueDimension,
  Issue,
  Annotation,
  HeatmapPoint,
  PMRecommendation,
  SeverityLevel,
} from '../types'

const seededRandom = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const pick = <T>(arr: T[], rng: () => number): T =>
  arr[Math.floor(rng() * arr.length)]

const pickN = <T>(arr: T[], n: number, rng: () => number): T[] => {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, n)
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

// --- Issue libraries ---

const UX_ISSUES: Issue[] = [
  {
    id: 'ux-1',
    severity: 'critical',
    title: 'Multiple competing CTAs dilute conversion focus',
    description: 'Users are presented with 3+ primary actions without clear visual prioritization, creating decision paralysis at the most critical conversion moment.',
    impact: 'Estimated 23–31% reduction in primary CTA conversion rate.',
    recommendation: 'Apply Hick\'s Law — reduce visible options to one primary action per screen state. Demote secondary actions to ghost buttons or text links.',
  },
  {
    id: 'ux-2',
    severity: 'major',
    title: 'Navigation depth exceeds 3-tap rule on mobile',
    description: 'Primary user goals require 4+ interactions to reach. This friction compounds on small-screen devices where context switching is costly.',
    impact: 'Mobile bounce rate likely inflated by 15–22% vs. desktop.',
    recommendation: 'Audit task flows with a jobs-to-be-done lens. Surface the top 2–3 user goals in the primary navigation tier.',
  },
  {
    id: 'ux-3',
    severity: 'major',
    title: 'No visible success state after key actions',
    description: 'The interface provides no feedback when users complete critical flows (form submission, checkout, account creation). This breaks the action-feedback loop fundamental to UX trust.',
    impact: 'Support ticket volume likely 12–18% higher than baseline for completed actions.',
    recommendation: 'Implement inline confirmation states with micro-animations. Consider a celebration moment for high-value conversions.',
  },
  {
    id: 'ux-4',
    severity: 'minor',
    title: 'Interactive affordances lack hover states',
    description: 'Several clickable elements don\'t signal interactivity through cursor changes, color shifts, or motion. Users must guess which elements are actionable.',
    impact: 'Reduced discoverability, especially for first-time users.',
    recommendation: 'Add consistent hover transitions (150–200ms) across all interactive elements. Ensure cursors change to pointer on clickable items.',
  },
  {
    id: 'ux-5',
    severity: 'suggestion',
    title: 'Empty states could guide users more proactively',
    description: 'Empty content areas show placeholder text but miss the opportunity to onboard users into their first meaningful action.',
    impact: 'Low activation rate for new accounts — users don\'t know what to do first.',
    recommendation: 'Design "zero state" experiences that guide users toward their first value moment. Include a single, specific call to action.',
  },
  {
    id: 'ux-6',
    severity: 'major',
    title: 'Form validation feedback is post-submission only',
    description: 'Inline validation errors appear only after the form is submitted, not as users fill fields. This forces users to re-read and re-complete the entire form.',
    impact: 'Form completion rates typically drop 20–35% with delayed validation.',
    recommendation: 'Implement real-time inline validation with blur events. Show success states (green checkmarks) as fields are correctly completed.',
  },
  {
    id: 'ux-7',
    severity: 'minor',
    title: 'Loading states lack progress indication',
    description: 'Operations that take 1–3 seconds show only a spinner without communicating progress or estimated completion. This increases perceived wait time.',
    impact: 'Users are 40% less likely to abandon when progress is visible.',
    recommendation: 'Replace spinners with progress indicators for operations over 1 second. Consider skeleton screens for content-loading states.',
  },
]

const A11Y_ISSUES: Issue[] = [
  {
    id: 'a11y-1',
    severity: 'critical',
    title: 'Text contrast ratio below WCAG AA threshold',
    description: 'Secondary body text and supporting labels appear to fall below the 4.5:1 contrast ratio required for WCAG 2.1 AA compliance. This makes content unreadable for users with low vision.',
    impact: 'Fails WCAG 2.1 AA — potential legal exposure in US, EU, UK markets.',
    recommendation: 'Use a contrast checker to verify all text combinations. Darken secondary text from the current gray to at least #595959 on white backgrounds.',
  },
  {
    id: 'a11y-2',
    severity: 'critical',
    title: 'Interactive targets below 44×44pt minimum',
    description: 'Several tap targets (icon buttons, small links) appear smaller than Apple\'s recommended 44pt minimum touch target. This significantly impacts users with motor disabilities and general mobile usability.',
    impact: 'Misfire rate increases dramatically for targets under 32pt on mobile devices.',
    recommendation: 'Audit all interactive elements. Apply minimum 44×44px touch targets using padding — visual size can remain smaller if needed.',
  },
  {
    id: 'a11y-3',
    severity: 'major',
    title: 'Color used as sole information differentiator',
    description: 'Status indicators and data visualizations rely on color alone to convey meaning (red = error, green = success). Users with color blindness cannot distinguish these states.',
    impact: 'Affects ~8% of male users and ~0.5% of female users globally.',
    recommendation: 'Pair color with icons, patterns, or text labels. Ensure meaning is conveyed through multiple channels simultaneously.',
  },
  {
    id: 'a11y-4',
    severity: 'major',
    title: 'No visible keyboard focus indicators',
    description: 'Focus rings appear to be suppressed globally (outline: none or ring-transparent), rendering the interface non-navigable for keyboard-only users and assistive technology.',
    impact: 'Fails WCAG 2.4.7 — keyboard users cannot see where focus is.',
    recommendation: 'Restore focus-visible styles. Use a high-contrast ring (2px solid #268BD2 with 2px offset) that doesn\'t disrupt visual design.',
  },
  {
    id: 'a11y-5',
    severity: 'minor',
    title: 'Images likely lack descriptive alt text',
    description: 'Content images and product illustrations may use empty, filename-based, or generic alt attributes, denying screen reader users contextual information.',
    impact: 'Screen reader users receive no content from visual imagery.',
    recommendation: 'Write alt text that describes the image\'s meaning in context, not its appearance. Decorative images should have alt="".',
  },
  {
    id: 'a11y-6',
    severity: 'suggestion',
    title: 'Reduce motion alternatives not provided',
    description: 'Animated transitions and effects don\'t appear to respect the prefers-reduced-motion media query. Users with vestibular disorders may experience discomfort.',
    impact: 'Affects ~35% of users who have enabled reduced motion in system settings.',
    recommendation: 'Wrap all animations in @media (prefers-reduced-motion: no-preference) or use the useReducedMotion hook.',
  },
]

const VISUAL_ISSUES: Issue[] = [
  {
    id: 'vis-1',
    severity: 'major',
    title: 'F-pattern reading flow disrupted by layout',
    description: 'Eye-tracking research shows users scan in an F-pattern on most screens. The current layout places key information outside this zone, requiring deliberate search rather than natural scanning.',
    impact: 'Critical information in the right/bottom quadrant goes unread by ~70% of users.',
    recommendation: 'Restructure content to place the most important information in the top-left to center reading path. Avoid relying on right-column placements for critical content.',
  },
  {
    id: 'vis-2',
    severity: 'major',
    title: 'Typography scale insufficient for clear hierarchy',
    description: 'The variation between heading and body text sizes is too narrow (appears to be a 1.2x scale ratio). Effective hierarchy typically requires a 1.333x–1.5x modular scale.',
    impact: 'Users cannot quickly identify the most important content on the page.',
    recommendation: 'Adopt a Major Third (1.25x) or Perfect Fourth (1.333x) type scale. Ensure h1 is at least 2x the body text size.',
  },
  {
    id: 'vis-3',
    severity: 'minor',
    title: 'Inconsistent spacing creates visual noise',
    description: 'Margin and padding values appear ad-hoc rather than following a systematic spacing scale (4px, 8px, 16px, 24px, 32px). The resulting visual rhythm is uneven.',
    impact: 'Reduces perceived quality and professionalism of the product.',
    recommendation: 'Adopt an 8-point grid system. All spacing values should be multiples of 4px, preferably 8px.',
  },
  {
    id: 'vis-4',
    severity: 'suggestion',
    title: 'Visual weight balance skews heavy on the left',
    description: 'Large, dense content elements on the left create imbalance. The right side of the layout has insufficient visual weight to create equilibrium.',
    impact: 'Users may feel the interface is "unfinished" or unpolished.',
    recommendation: 'Balance visual weight through strategic use of whitespace, imagery, or counterweights on the right side of the layout.',
  },
  {
    id: 'vis-5',
    severity: 'major',
    title: 'Insufficient contrast between primary and secondary actions',
    description: 'Primary and secondary buttons are visually too similar — both have comparable weight, color, and size. Users cannot immediately identify the primary path.',
    impact: 'Users choosing the wrong action leads to support requests and user frustration.',
    recommendation: 'Establish a clear visual hierarchy: primary (filled), secondary (outlined), tertiary (text-only). Use color, weight, and size as layered differentiators.',
  },
]

const CTA_ISSUES: Issue[] = [
  {
    id: 'cta-1',
    severity: 'critical',
    title: 'CTA copy is generic and value-free',
    description: '"Submit", "Click Here", or "Learn More" convey no value proposition. The button is the last touchpoint before conversion — it must close the deal.',
    impact: 'Specific, benefit-driven CTAs convert 15–30% better than generic verbs.',
    recommendation: 'Use action verbs that communicate the outcome: "Start Free Trial", "Get My Report", "Unlock Access". Test 2–3 variants with real users.',
  },
  {
    id: 'cta-2',
    severity: 'major',
    title: 'Primary CTA below the fold on mobile',
    description: 'The main conversion element requires scrolling to reach on a standard iPhone viewport (375×812px). Most users won\'t scroll before they\'ve decided whether to stay.',
    impact: 'Conversion rates for below-fold CTAs are typically 47% lower than above-fold.',
    recommendation: 'Move or duplicate the primary CTA above the fold. Use a sticky header or bottom bar on mobile to keep the CTA persistently accessible.',
  },
  {
    id: 'cta-3',
    severity: 'major',
    title: 'No urgency or social proof near conversion element',
    description: 'The CTA appears in isolation without trust signals, social proof, or urgency cues. Users lack the final nudge needed to take action.',
    impact: 'Adding social proof near CTAs increases conversion by 15% on average.',
    recommendation: 'Add proximity signals: user count, testimonial snippet, security badge, or "Join X,XXX users" message within visual proximity of the primary CTA.',
  },
  {
    id: 'cta-4',
    severity: 'minor',
    title: 'CTA button sizing suboptimal for mobile tap accuracy',
    description: 'The primary button height appears below 44px, reducing tap accuracy on touch screens. This is especially problematic for users with larger fingers or motor impairments.',
    impact: 'Misfire rate increases by ~3x on targets under 32px height on mobile.',
    recommendation: 'Set minimum button height to 44px (48px preferred). Full-width buttons on mobile often perform better for primary actions.',
  },
]

const ONBOARDING_ISSUES: Issue[] = [
  {
    id: 'ob-1',
    severity: 'critical',
    title: 'Time-to-value (TTV) exceeds 3 minutes',
    description: 'New users must complete significant setup before experiencing core product value. Each additional minute of setup reduces 7-day retention by ~8%.',
    impact: 'Estimated 20–40% drop-off during onboarding flow before first value moment.',
    recommendation: 'Map the critical path to the "aha moment". Remove every step that isn\'t essential for that first success. Consider progressive onboarding after the initial value moment.',
  },
  {
    id: 'ob-2',
    severity: 'major',
    title: 'Onboarding lacks contextual education',
    description: 'Features are presented without explaining why they matter or how they solve the user\'s job-to-be-done. Users are learning what the product does, not what it does for them.',
    impact: 'Feature adoption rates typically 50% lower without contextual explanation.',
    recommendation: 'Add brief contextual tooltips or "why this matters" copy at key onboarding steps. Frame everything from the user\'s perspective, not the product\'s.',
  },
  {
    id: 'ob-3',
    severity: 'major',
    title: 'No progress indication in multi-step flows',
    description: 'Multi-step processes don\'t show users where they are in the journey or how much remains. This creates anxiety and increases abandonment.',
    impact: 'Progress bars reduce multi-step form abandonment by 28% on average.',
    recommendation: 'Add a progress indicator (step X of Y, or a visual stepper) to all multi-step flows. Show what\'s already completed.',
  },
  {
    id: 'ob-4',
    severity: 'suggestion',
    title: 'No personalization in initial user experience',
    description: 'Every user sees the same onboarding regardless of their role, use case, or source. Personalized onboarding increases activation by 2–3x.',
    impact: 'Generic onboarding leads to feature mismatch and low activation.',
    recommendation: 'Add a 1–2 question segment at onboarding entry. Use answers to personalize the experience, highlighted features, and first-run content.',
  },
]

const DENSITY_ISSUES: Issue[] = [
  {
    id: 'den-1',
    severity: 'major',
    title: 'Information density exceeds cognitive load threshold',
    description: 'The page presents too many competing pieces of information simultaneously. Miller\'s Law suggests working memory can hold 7±2 items — this layout appears to exceed that significantly.',
    impact: 'Users will skim rather than read, missing critical information.',
    recommendation: 'Apply progressive disclosure: show the essential 20% upfront, reveal depth on demand. Consider a "simplified" view for new users.',
  },
  {
    id: 'den-2',
    severity: 'major',
    title: 'Insufficient whitespace between content zones',
    description: 'Content sections lack visual breathing room. The perceived density makes the interface feel overwhelming rather than organized.',
    impact: 'Users report lower quality perception for dense layouts regardless of actual content quality.',
    recommendation: 'Increase section spacing by 40–60%. Use whitespace intentionally to create visual groupings and hierarchy.',
  },
  {
    id: 'den-3',
    severity: 'minor',
    title: 'Text paragraph lengths exceed reading comfort threshold',
    description: 'Body text paragraphs appear to exceed the recommended 50–75 character line length for comfortable reading. Long lines force users to track across the screen.',
    impact: 'Reading speed and comprehension decrease significantly above 75 characters per line.',
    recommendation: 'Constrain body text containers to max-width: 65ch. Use multi-column layouts for wider content areas.',
  },
  {
    id: 'den-4',
    severity: 'suggestion',
    title: 'Data tables lack hierarchy and prioritization',
    description: 'Tabular data presents all information with equal weight. Users cannot quickly identify the most important columns or rows.',
    impact: 'Decision-making time increases significantly when key data isn\'t prioritized.',
    recommendation: 'Bold or highlight the most decision-relevant column. Consider removing or collapsing low-frequency data by default.',
  },
]

const PM_REC_TEMPLATES: Omit<PMRecommendation, 'id'>[] = [
  {
    priority: 'p0',
    title: 'Ship a single-CTA landing page variant',
    rationale: 'The current multi-CTA layout creates decision paralysis. A focused variant with one primary action above the fold could yield a 20–35% conversion lift.',
    effort: 'low',
    impact: 'high',
  },
  {
    priority: 'p0',
    title: 'Fix WCAG AA contrast failures before next release',
    rationale: 'Non-compliant contrast ratios create legal exposure in enterprise markets and exclude a meaningful percentage of users. High-risk for deals in regulated industries.',
    effort: 'low',
    impact: 'high',
  },
  {
    priority: 'p1',
    title: 'Run 5-session usability test on navigation flow',
    rationale: 'Recruit 5 target users for 30-minute moderated sessions. Focus on the primary conversion flow. This will surface the top 3–5 critical issues with statistically relevant confidence.',
    effort: 'medium',
    impact: 'high',
  },
  {
    priority: 'p1',
    title: 'Implement skeleton loading screens',
    rationale: 'Replace spinners with skeleton screens for all content-loading states. Research shows perceived load times decrease by 15–20% with skeleton screens, improving satisfaction scores.',
    effort: 'low',
    impact: 'medium',
  },
  {
    priority: 'p1',
    title: 'Add social proof within 100px of primary CTA',
    rationale: 'Testimonials, user counts, or trust badges placed adjacent to the conversion element increase conversion rates by 12–18% on average across SaaS products.',
    effort: 'low',
    impact: 'high',
  },
  {
    priority: 'p1',
    title: 'Redesign onboarding flow with a "minimum wow" target',
    rationale: 'Define the one moment where users first understand product value. Eliminate every step before it. Target: user reaches the aha moment within 90 seconds of signup.',
    effort: 'high',
    impact: 'high',
  },
  {
    priority: 'p2',
    title: 'Establish an 8-point spacing system across all components',
    rationale: 'Ad-hoc spacing values create visual inconsistency that erodes perceived quality. A systematic grid reduces design decisions and improves visual coherence.',
    effort: 'medium',
    impact: 'medium',
  },
  {
    priority: 'p2',
    title: 'A/B test benefit-driven CTA copy',
    rationale: 'Replace generic verbs (Submit, Continue) with outcome-focused alternatives (Start Free, Get My Analysis). Typical uplift: 15–30% on primary conversion events.',
    effort: 'low',
    impact: 'medium',
  },
  {
    priority: 'p2',
    title: 'Implement prefers-reduced-motion support globally',
    rationale: 'Ensures accessibility for users with vestibular disorders and improves performance on low-power devices. Required for WCAG 2.1 AA compliance in animations.',
    effort: 'low',
    impact: 'low',
  },
]

const DETECTED_ELEMENTS_POOL = [
  'Navigation bar', 'Primary CTA button', 'Hero heading', 'Body copy',
  'Form fields', 'Footer links', 'Image content', 'Cards / tiles',
  'Data table', 'Modal dialog', 'Input validation messages', 'Tab navigation',
  'Search field', 'Profile avatar', 'Price display', 'Feature list',
  'Social proof section', 'Progress indicator', 'Icon set', 'Dropdown menus',
]

function computeGrade(score: number): { grade: string; label: string } {
  if (score >= 90) return { grade: 'A+', label: 'Exceptional' }
  if (score >= 80) return { grade: 'A', label: 'Strong' }
  if (score >= 70) return { grade: 'B', label: 'Above Average' }
  if (score >= 60) return { grade: 'C+', label: 'Average' }
  if (score >= 50) return { grade: 'C', label: 'Needs Work' }
  if (score >= 40) return { grade: 'D', label: 'Poor' }
  return { grade: 'F', label: 'Critical Issues' }
}

function generateExecutiveSummary(
  overallScore: number,
  ocrText: string,
  dims: CritiqueDimension[],
): string {
  const wordCount = ocrText.split(/\s+/).filter(Boolean).length
  const lowestDim = dims.reduce((a, b) => (a.score < b.score ? a : b))
  const highestDim = dims.reduce((a, b) => (a.score > b.score ? a : b))

  const density = wordCount > 200 ? 'high' : wordCount > 80 ? 'moderate' : 'low'

  const intros = [
    `This interface demonstrates ${overallScore >= 70 ? 'solid fundamentals' : 'foundational gaps'} in product design execution.`,
    `At a glance, this product has ${overallScore >= 70 ? 'genuine strengths' : 'significant opportunities for improvement'} across core UX dimensions.`,
    `The analysis reveals a ${overallScore >= 65 ? 'generally well-structured' : 'fragmented'} user experience with clear areas to address.`,
  ]
  const intro = intros[Math.floor(overallScore * 3 / 100) % intros.length]

  const densityNote =
    density === 'high'
      ? ' Information density is elevated — users with shorter attention spans may not reach the conversion moment.'
      : density === 'low'
      ? ' The interface is relatively sparse, which aids clarity but may leave users without sufficient context to convert.'
      : ' Information density appears calibrated for a general audience, though refinement is possible.'

  const strengthNote = ` ${highestDim.name} is the strongest dimension (${highestDim.score}/100), suggesting the team has invested here.`
  const weakNote = ` ${lowestDim.name} needs the most urgent attention (${lowestDim.score}/100) and represents the highest-leverage improvement opportunity.`

  return `${intro}${densityNote}${strengthNote}${weakNote} Addressing the P0 recommendations below has a realistic path to a 15–25% improvement in primary conversion metrics within 2–3 sprint cycles.`
}

function generateAnnotations(rng: () => number, dims: CritiqueDimension[]): Annotation[] {
  const positions = [
    { x: 18, y: 12 },
    { x: 72, y: 8  },
    { x: 45, y: 30 },
    { x: 15, y: 55 },
    { x: 80, y: 45 },
    { x: 60, y: 72 },
    { x: 28, y: 80 },
    { x: 88, y: 78 },
    { x: 50, y: 90 },
  ]

  const annotations: Annotation[] = []
  const numAnnotations = 5 + Math.floor(rng() * 4)

  let posIdx = 0
  for (const dim of dims) {
    if (posIdx >= numAnnotations || posIdx >= positions.length) break
    const criticalIssues = dim.issues.filter((i) => i.severity === 'critical' || i.severity === 'major')
    if (criticalIssues.length === 0) continue

    const issue = criticalIssues[0]
    annotations.push({
      id: `ann-${posIdx}`,
      x: positions[posIdx].x + (rng() - 0.5) * 6,
      y: positions[posIdx].y + (rng() - 0.5) * 6,
      category: dim.id,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      index: posIdx + 1,
    })
    posIdx++
  }

  // Fill remaining with minor issues
  for (const dim of dims) {
    if (posIdx >= numAnnotations || posIdx >= positions.length) break
    const minorIssues = dim.issues.filter((i) => i.severity === 'minor' || i.severity === 'suggestion')
    if (minorIssues.length === 0) continue
    const issue = minorIssues[0]
    annotations.push({
      id: `ann-${posIdx}`,
      x: positions[posIdx].x + (rng() - 0.5) * 6,
      y: positions[posIdx].y + (rng() - 0.5) * 6,
      category: dim.id,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      index: posIdx + 1,
    })
    posIdx++
  }

  return annotations
}

function generateHeatmap(rng: () => number): HeatmapPoint[] {
  const points: HeatmapPoint[] = []

  // Primary attention: top-center (logo / hero)
  points.push({ x: 50, y: 8, intensity: 0.95, radius: 120 })
  // Secondary: top-left (nav)
  points.push({ x: 12, y: 6, intensity: 0.75, radius: 80 })
  // Mid-center: hero CTA area
  points.push({ x: 48, y: 35, intensity: 0.88, radius: 140 })
  // Left-mid: primary content
  points.push({ x: 28, y: 52, intensity: 0.60, radius: 100 })
  // Right-mid: secondary content
  points.push({ x: 72, y: 48, intensity: 0.45, radius: 90 })
  // Bottom-center: footer CTA / social
  points.push({ x: 50, y: 82, intensity: 0.35, radius: 110 })
  // Rage-click zone: near frustrated areas
  const rx = 30 + rng() * 40
  const ry = 55 + rng() * 30
  points.push({ x: rx, y: ry, intensity: 0.55, radius: 55 })
  // Additional scatter
  for (let i = 0; i < 4; i++) {
    points.push({
      x: 10 + rng() * 80,
      y: 10 + rng() * 80,
      intensity: 0.15 + rng() * 0.30,
      radius: 40 + rng() * 60,
    })
  }
  return points
}

export async function generateCritique(
  ocrText: string,
  imageDims: { width: number; height: number },
  seed: number = Date.now(),
): Promise<CritiqueResult> {
  const rng = seededRandom(seed)

  const words = ocrText.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const hasCTA    = /\b(buy|sign up|get started|subscribe|download|try|join|start|free|register|continue|submit|create)\b/i.test(ocrText)
  const hasForm   = /\b(email|password|name|phone|address|enter|type|input)\b/i.test(ocrText)
  const hasNav    = /\b(menu|home|about|contact|products|services|pricing|features|blog)\b/i.test(ocrText)
  const hasPrice  = /\$|€|£|\bprice\b|\bplan\b|\bpremium\b|\bfree\b/i.test(ocrText)
  const hasErrors = /\b(error|invalid|required|failed|wrong)\b/i.test(ocrText)

  // Compute category scores
  const uxBase    = clamp(62 + rng() * 20 - (hasForm ? 8 : 0) - (wordCount > 150 ? 6 : 0), 38, 88)
  const a11yBase  = clamp(55 + rng() * 22 - (hasErrors ? 10 : 0), 32, 82)
  const visBase   = clamp(60 + rng() * 25, 40, 90)
  const ctaBase   = clamp(hasCTA ? 65 + rng() * 22 : 42 + rng() * 18, 35, 88)
  const obBase    = clamp(58 + rng() * 20 - (hasForm ? 10 : 0), 32, 84)
  const denBase   = clamp(wordCount > 200 ? 42 + rng() * 20 : 65 + rng() * 22, 35, 88)

  // Select issues
  const uxIssues    = pickN(UX_ISSUES,     2 + Math.floor(rng() * 2), rng) as Issue[]
  const a11yIssues  = pickN(A11Y_ISSUES,   2 + Math.floor(rng() * 2), rng) as Issue[]
  const visIssues   = pickN(VISUAL_ISSUES, 2 + Math.floor(rng() * 2), rng) as Issue[]
  const ctaIssues   = pickN(CTA_ISSUES,    1 + Math.floor(rng() * 2), rng) as Issue[]
  const obIssues    = pickN(ONBOARDING_ISSUES, 1 + Math.floor(rng() * 2), rng) as Issue[]
  const denIssues   = pickN(DENSITY_ISSUES, 1 + Math.floor(rng() * 2), rng) as Issue[]

  const dims: CritiqueDimension[] = [
    { id: 'ux',            name: 'UX Flow',          score: Math.round(uxBase),   color: '#6C71C4', accentColor: 'rgba(108,113,196,0.15)', issues: uxIssues },
    { id: 'accessibility', name: 'Accessibility',    score: Math.round(a11yBase), color: '#DC322F', accentColor: 'rgba(220,50,47,0.12)',   issues: a11yIssues },
    { id: 'visual',        name: 'Visual Hierarchy', score: Math.round(visBase),  color: '#B58900', accentColor: 'rgba(181,137,0,0.12)',   issues: visIssues },
    { id: 'cta',           name: 'CTA Clarity',      score: Math.round(ctaBase),  color: '#268BD2', accentColor: 'rgba(38,139,210,0.12)',  issues: ctaIssues },
    { id: 'onboarding',    name: 'Onboarding',       score: Math.round(obBase),   color: '#2AA198', accentColor: 'rgba(42,161,152,0.12)',  issues: obIssues },
    { id: 'density',       name: 'Info Density',     score: Math.round(denBase),  color: '#CB4B16', accentColor: 'rgba(203,75,22,0.12)',   issues: denIssues },
  ]

  const overallScore = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length)
  const { grade, label } = computeGrade(overallScore)

  const pmRecs = pickN(PM_REC_TEMPLATES, 4 + Math.floor(rng() * 3), rng).map(
    (r, i) => ({ ...r, id: `pm-${i}` } as PMRecommendation),
  )

  const detectedElements = pickN(DETECTED_ELEMENTS_POOL, 6 + Math.floor(rng() * 5), rng)

  return {
    overallScore,
    grade,
    gradeLabel: label,
    executiveSummary: generateExecutiveSummary(overallScore, ocrText, dims),
    pmRecommendations: pmRecs,
    dimensions: dims,
    annotations: generateAnnotations(rng, dims),
    heatmapPoints: generateHeatmap(rng),
    confidence: Math.round(72 + rng() * 22),
    analysisTime: Math.round(2200 + rng() * 1800),
    detectedElements,
  }
}
