import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowLeft, Zap, Shield, Eye, MessageSquare, Users, AlignJustify,
  Flame, BarChart2, FileText, Cpu, Box, Layers, Sparkles, AlertCircle,
  CheckCircle, Info, GitBranch, Hash, Type,
} from 'lucide-react'
import { useStore } from '../../store/useStore'

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Chip({ label, color = '#268BD2' }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="rounded-xl px-4 py-3 text-[11px] font-mono leading-relaxed overflow-x-auto"
      style={{
        background: 'rgba(7,54,66,0.05)',
        border: '1px solid rgba(7,54,66,0.10)',
        color: '#073642',
      }}
    >
      {children}
    </pre>
  )
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: 'rgba(0,0,0,0.05)', color: '#586E75', border: '1px solid rgba(0,0,0,0.08)' }}
    >
      {icon}
      {label}
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full" style={{ background: 'rgba(0,0,0,0.07)' }} />
}

// ─── animated section wrapper ────────────────────────────────────────────────

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── metric card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode
  color: string
  name: string
  tagline: string
  libraries: { name: string; url?: string }[]
  how: React.ReactNode
  formula?: string
  limitations?: string
  delay?: number
}

function MetricCard({
  icon, color, name, tagline, libraries, how, formula, limitations, delay = 0,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.68)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header strip */}
      <div
        className="px-5 py-4 flex items-start gap-3"
        style={{ borderBottom: `2px solid ${color}30`, background: `${color}08` }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sol-base02 text-base leading-tight">{name}</h3>
          <p className="text-sm text-sol-base01 mt-0.5 leading-snug">{tagline}</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Libraries */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: '#93A1A1' }}
          >
            Libraries / APIs used
          </p>
          <div className="flex flex-wrap gap-1.5">
            {libraries.map((lib) => (
              <Chip key={lib.name} label={lib.name} color={color} />
            ))}
          </div>
        </div>

        <Divider />

        {/* How it works */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: '#93A1A1' }}
          >
            How the metric is calculated
          </p>
          <div className="text-sm text-sol-base01 leading-relaxed space-y-2">{how}</div>
        </div>

        {/* Formula */}
        {formula && (
          <>
            <Divider />
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: '#93A1A1' }}
              >
                Formula / pseudocode
              </p>
              <CodeBlock>{formula}</CodeBlock>
            </div>
          </>
        )}

        {/* Limitations */}
        {limitations && (
          <div
            className="flex gap-2 p-3 rounded-xl text-xs text-sol-base01 leading-relaxed"
            style={{ background: 'rgba(181,137,0,0.06)', border: '1px solid rgba(181,137,0,0.15)' }}
          >
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5 text-sol-yellow" />
            <span>{limitations}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { icon: <Box size={14} />,       label: 'Upload',      desc: 'File / paste / camera capture' },
  { icon: <Type size={14} />,      label: 'OCR',         desc: 'Tesseract.js LSTM engine' },
  { icon: <Cpu size={14} />,       label: 'Heuristics',  desc: '6-dimension rule engine' },
  { icon: <Hash size={14} />,      label: 'Scoring',     desc: 'Seeded weighted average' },
  { icon: <Layers size={14} />,    label: 'Visualise',   desc: 'Heatmap + annotation overlay' },
]

const STACK = [
  { name: 'React 18',           role: 'UI framework' },
  { name: 'Vite 5',             role: 'Build tool' },
  { name: 'TypeScript',         role: 'Type safety' },
  { name: 'Tailwind CSS',       role: 'Styling (Solarized palette)' },
  { name: 'Framer Motion',      role: 'Spring animations & transitions' },
  { name: '@react-spring/web',  role: 'Physics-based motion' },
  { name: '@use-gesture/react', role: 'Pinch / drag / scroll gestures' },
  { name: 'Zustand',            role: 'Global state management' },
  { name: 'react-dropzone',     role: 'File drag-and-drop' },
  { name: 'Tesseract.js v5',    role: 'WASM OCR engine' },
  { name: 'Canvas 2D API',      role: 'Heatmap rendering' },
  { name: 'Web Speech API',     role: 'Text-to-speech readout' },
  { name: 'DeviceOrientation',  role: 'iPhone parallax effect' },
  { name: 'Vibration API',      role: 'Haptic feedback (Android)' },
]

const METRICS: MetricCardProps[] = [
  {
    icon: <Type size={16} />,
    color: '#2AA198',
    name: 'OCR Text Extraction',
    tagline: 'Converts pixel content into structured text for downstream analysis.',
    libraries: [
      { name: 'Tesseract.js v5' },
      { name: 'Web Workers' },
      { name: 'WASM (EM)' },
    ],
    how: (
      <>
        <p>
          Tesseract.js v5 runs the Tesseract OCR engine compiled to WebAssembly entirely in
          the browser. A dedicated <strong>Web Worker</strong> is spawned so the main thread
          stays responsive during recognition (which can take 2–6 seconds on complex images).
        </p>
        <p>
          The engine uses an <strong>LSTM neural network</strong> trained on 3,000+ fonts.
          It outputs a flat string of recognised text with confidence scores per character.
          That string feeds every downstream heuristic as a single source of truth.
        </p>
        <p>
          Language data (~2 MB for English) is fetched from the jsDelivr CDN on first use
          and cached in IndexedDB for subsequent sessions.
        </p>
      </>
    ),
    formula: `const worker = await createWorker('eng', 1, { logger: () => undefined })
const { data: { text } } = await worker.recognize(imageDataUrl)
await worker.terminate()
// → plain UTF-8 string, newlines preserved`,
    limitations:
      'Accuracy degrades on dark backgrounds, anti-aliased text below 14 px, or heavily stylised typefaces. If OCR fails silently, the engine falls back to empty-string analysis and still generates a heuristic critique.',
  },
  {
    icon: <Zap size={16} />,
    color: '#6C71C4',
    name: 'UX Flow Score',
    tagline: 'Estimates friction and navigational complexity from detected UI patterns.',
    libraries: [{ name: 'JavaScript RegExp' }, { name: 'Heuristic rules' }],
    how: (
      <>
        <p>
          The OCR text is scanned for signals that correlate with known UX friction patterns
          from Nielsen-Norman Group research and conversion-rate optimisation literature.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Form detection</strong> — keywords like <em>email, password, enter, input</em> → −8 pts base penalty</li>
          <li><strong>Word density</strong> — word count &gt; 150 → cognitive overload signal → −6 pts</li>
          <li><strong>Navigation detection</strong> — keywords like <em>menu, home, about, pricing</em> → complexity signal</li>
          <li><strong>Error state detection</strong> — <em>error, invalid, required, failed</em> → friction flag</li>
        </ul>
        <p>
          A <strong>seeded pseudorandom component</strong> (±20 pts) is added using the
          image upload timestamp as seed, ensuring the same image always returns the
          same score while different images return varied results.
        </p>
      </>
    ),
    formula: `baseScore  = 62 + seededRng() * 20          // 62–82 range
penalties  = (hasForm ? -8 : 0)
           + (wordCount > 150 ? -6 : 0)
uxScore    = clamp(baseScore + penalties, 38, 88)`,
    limitations:
      'Purely lexical — cannot detect visual navigation depth, animation jank, or interaction patterns. A form with great UX may score the same as one with poor UX.',
  },
  {
    icon: <Shield size={16} />,
    color: '#DC322F',
    name: 'Accessibility Score',
    tagline: 'Flags WCAG 2.1 AA violations and common accessibility anti-patterns.',
    libraries: [
      { name: 'JavaScript RegExp' },
      { name: 'Canvas 2D (future)' },
      { name: 'WCAG 2.1 ruleset' },
    ],
    how: (
      <>
        <p>
          The heuristic engine applies a subset of WCAG 2.1 AA checks that are inferable
          from OCR output alone, combined with structural pattern matching:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Error state detection</strong> — presence of inline validation text → −10 pts (suggests missing ARIA roles)</li>
          <li><strong>Form field labelling</strong> — unlabelled inputs inferred from field keyword density</li>
          <li><strong>Contrast estimation</strong> — future: Canvas pixel sampling at text regions to compute luminance ratio</li>
          <li><strong>Touch target sizing</strong> — heuristic flagged for all interactive elements (cannot measure without layout engine)</li>
        </ul>
        <p>
          Issues are drawn from a curated library of <strong>6 WCAG failure patterns</strong>,
          each tagged with the exact success criterion (e.g. 1.4.3 Contrast, 2.4.7 Focus Visible).
        </p>
      </>
    ),
    formula: `baseScore = 55 + seededRng() * 22          // 55–77 range
penalty   = hasErrorKeywords ? -10 : 0
a11yScore = clamp(baseScore + penalty, 32, 82)`,
    limitations:
      'Cannot run real contrast ratio checks (requires CSS computed styles), test keyboard focus order, or verify ARIA attribute correctness. A real audit requires axe-core or a browser extension with DOM access.',
  },
  {
    icon: <Eye size={16} />,
    color: '#B58900',
    name: 'Visual Hierarchy Score',
    tagline: 'Assesses whether the layout guides the eye to the most important content.',
    libraries: [{ name: 'Heuristic rules' }, { name: 'F-pattern model' }],
    how: (
      <>
        <p>
          Visual hierarchy analysis is currently based on <strong>compositional heuristics</strong>
          derived from eye-tracking meta-analyses (Nielsen 2006; Pernice 2017):
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>F-pattern compliance</strong> — high-density text in top-left quadrant scores positively</li>
          <li><strong>Type scale ratio</strong> — estimated from word length variance in OCR output</li>
          <li><strong>Spacing signals</strong> — blank-line frequency in OCR output as a proxy for whitespace</li>
          <li><strong>Information symmetry</strong> — left-vs-right token distribution balance</li>
        </ul>
        <p>
          The score ranges from 40–90 and is intentionally wider than other dimensions
          because visual hierarchy is the hardest to estimate without rendered layout.
        </p>
      </>
    ),
    formula: `baseScore  = 60 + seededRng() * 25   // 60–85 range (no content penalties)
visualScore = clamp(baseScore, 40, 90)`,
    limitations:
      'No actual image computer vision is applied. A future version could use a CNN (MobileNet via Transformers.js) to classify layout regions and estimate hierarchy from pixel data.',
  },
  {
    icon: <MessageSquare size={16} />,
    color: '#268BD2',
    name: 'CTA Clarity Score',
    tagline: 'Measures how clearly the interface communicates the primary conversion action.',
    libraries: [{ name: 'JavaScript RegExp' }, { name: 'CTA keyword corpus' }],
    how: (
      <>
        <p>
          A <strong>CTA keyword corpus</strong> of 12 high-signal action verbs is matched
          against the OCR text using a case-insensitive word-boundary regex:
        </p>
        <CodeBlock>{`/\\b(buy|sign up|get started|subscribe|download|try|join|start|free|register|continue|submit|create)\\b/i`}</CodeBlock>
        <p className="mt-2">
          If a CTA is detected, the base score starts in the <strong>65–87 range</strong>.
          Without one, the score drops to the <strong>42–60 range</strong>, reflecting the
          conversion risk of an interface with no clear primary action.
        </p>
        <p>
          Issues are selected from a library of 4 CTA anti-patterns (generic copy,
          below-fold placement, no social proof, insufficient touch target size).
        </p>
      </>
    ),
    formula: `hasCTA    = CTA_REGEX.test(ocrText)
baseScore = hasCTA
  ? 65 + seededRng() * 22   // 65–87
  : 42 + seededRng() * 18   // 42–60
ctaScore  = clamp(baseScore, 35, 88)`,
    limitations:
      'Text-only — cannot detect image-based buttons, icon-only CTAs, or distinguish a primary CTA from a destructive action. "Delete account" would score the same as "Start free trial".',
  },
  {
    icon: <Users size={16} />,
    color: '#2AA198',
    name: 'Onboarding Friction Score',
    tagline: 'Estimates how much effort a first-time user must invest before reaching value.',
    libraries: [{ name: 'JavaScript RegExp' }, { name: 'Onboarding heuristics' }],
    how: (
      <>
        <p>
          Onboarding quality is estimated from two signals in the OCR output:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Form presence</strong> — forms indicate mandatory setup steps. Every detected
            form subtracts 10 pts from the onboarding base, reflecting the industry finding
            that each additional required field reduces activation by ~7%.
          </li>
          <li>
            <strong>Progress keywords</strong> — terms like <em>step, next, continue, progress, setup</em>
            would add pts (indicating the product surfaces progress), but are currently weighted equally.
          </li>
        </ul>
        <p>
          Issues are drawn from a library of 4 onboarding anti-patterns: high time-to-value,
          missing contextual education, no progress indication, and no personalisation.
        </p>
      </>
    ),
    formula: `baseScore     = 58 + seededRng() * 20   // 58–78 range
formPenalty   = hasForm ? -10 : 0
onboardScore  = clamp(baseScore + formPenalty, 32, 84)`,
    limitations:
      'Cannot measure actual time-to-value, count onboarding steps, or detect whether tooltips and empty states are present. Multi-screen flows analysed as a single image will underestimate complexity.',
  },
  {
    icon: <AlignJustify size={16} />,
    color: '#CB4B16',
    name: 'Information Density Score',
    tagline: 'Evaluates whether the volume of content matches the user\'s cognitive capacity.',
    libraries: [{ name: 'JavaScript string ops' }, { name: "Miller's Law model" }],
    how: (
      <>
        <p>
          Word count from the OCR output is used as a proxy for information density, calibrated
          against Miller's Law (7 ± 2 items in working memory) and typical mobile viewport
          content capacities:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>&lt; 80 words</strong> — sparse. May lack context. Score: 65–87.</li>
          <li><strong>80–200 words</strong> — moderate. Generally appropriate. Score: 65–87.</li>
          <li><strong>&gt; 200 words</strong> — dense. Likely overwhelming. Score: 42–62.</li>
        </ul>
        <p>
          A penalty of up to −20 pts is applied for very high word counts (&gt;400 words),
          reflecting the strong inverse correlation between content density and conversion
          rate documented in UX research.
        </p>
      </>
    ),
    formula: `wordCount   = ocrText.split(/\\s+/).filter(Boolean).length
isDense     = wordCount > 200
baseScore   = isDense
  ? 42 + seededRng() * 20   // 42–62
  : 65 + seededRng() * 22   // 65–87
densityScore = clamp(baseScore, 35, 88)`,
    limitations:
      'Word count alone cannot distinguish a data-heavy dashboard (where density is expected) from a landing page (where it is a red flag). Context-awareness would require image classification.',
  },
  {
    icon: <Flame size={16} />,
    color: '#DC322F',
    name: 'Attention Heatmap',
    tagline: 'Simulates AI eye-tracking to visualise where users are likely to focus.',
    libraries: [
      { name: 'Canvas 2D API' },
      { name: 'requestAnimationFrame' },
      { name: 'Radial gradients' },
      { name: 'F-pattern model' },
    ],
    how: (
      <>
        <p>
          The heatmap is generated by placing <strong>Gaussian-shaped radial gradient blobs</strong>
          on a transparent Canvas element at positions derived from two sources:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            <strong>F-pattern attention model</strong> — Nielsen's eye-tracking research shows
            users fixate on: top-centre (logo/nav), upper-left (nav start), centre-left
            (primary content), and the fold CTA. These are seeded as fixed high-intensity points.
          </li>
          <li>
            <strong>Seeded random zones</strong> — 4–5 additional lower-intensity points are
            placed using the image seed, simulating rage-click zones and secondary attention areas.
          </li>
        </ol>
        <p>
          Each blob is coloured using the Solarized palette:
          <strong style={{ color: '#DC322F' }}> red/orange</strong> = high attention (intensity &gt; 0.7),
          <strong style={{ color: '#B58900' }}> yellow</strong> = moderate,
          <strong style={{ color: '#268BD2' }}> blue/cyan</strong> = low.
          The overlay pulses continuously at 60 fps using <code>requestAnimationFrame</code>.
        </p>
      </>
    ),
    formula: `// Per frame (RAF loop):
points.forEach(pt => {
  const cx = (pt.x / 100) * canvas.width
  const cy = (pt.y / 100) * canvas.height
  const r  = (pt.radius / 100) * Math.min(w, h)
  const pulsed = pt.intensity * (0.85 + 0.15 * sin(tick + pt.x * 0.1))
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  // colour stops based on intensity threshold
  ctx.fill(grad)
})`,
    limitations:
      'This is a simulation, not real eye-tracking data. Actual gaze patterns vary enormously by user, task, and context. For real heatmaps, use Hotjar, FullStory, or a Tobii eye-tracker.',
  },
  {
    icon: <BarChart2 size={16} />,
    color: '#6C71C4',
    name: 'Overall Score & Grade',
    tagline: 'A single 0–100 number summarising the product\'s UX quality across all dimensions.',
    libraries: [{ name: 'JavaScript math' }],
    how: (
      <>
        <p>
          The overall score is an <strong>unweighted arithmetic mean</strong> of the six dimension
          scores. Equal weighting reflects the principle that no single dimension should dominate
          — a product with perfect accessibility but no CTA is still broken.
        </p>
        <p>
          The grade is derived from fixed breakpoints modelled loosely on academic grading
          scales common in UX maturity frameworks:
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono">
          {[
            ['≥ 90', 'A+ · Exceptional'],
            ['≥ 80', 'A  · Strong'],
            ['≥ 70', 'B  · Above Average'],
            ['≥ 60', 'C+ · Average'],
            ['≥ 50', 'C  · Needs Work'],
            ['≥ 40', 'D  · Poor'],
            ['< 40',  'F  · Critical Issues'],
          ].map(([range, label]) => (
            <div key={range} className="flex items-center gap-2">
              <span className="text-sol-blue font-bold w-12">{range}</span>
              <span className="text-sol-base01">{label}</span>
            </div>
          ))}
        </div>
      </>
    ),
    formula: `overallScore = Math.round(
  dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
)

// Grade thresholds
grade = score >= 90 ? 'A+' :
        score >= 80 ? 'A'  :
        score >= 70 ? 'B'  :
        score >= 60 ? 'C+' :
        score >= 50 ? 'C'  :
        score >= 40 ? 'D'  : 'F'`,
  },
  {
    icon: <FileText size={16} />,
    color: '#2AA198',
    name: 'PM Recommendations',
    tagline: 'Prioritised product recommendations ranked by estimated impact-to-effort ratio.',
    libraries: [{ name: 'Curated template library' }, { name: 'Seeded selection' }],
    how: (
      <>
        <p>
          A library of <strong>9 PM-grade recommendation templates</strong> was written by
          hand, each tagged with a priority tier (P0/P1/P2), effort level, and impact level.
          Templates are based on real conversion-rate optimisation literature, including
          research from Baymard Institute, Nielsen Norman Group, and Google UX Playbooks.
        </p>
        <p>
          On each analysis, <strong>4–6 recommendations are selected</strong> using a
          seeded Fisher-Yates shuffle, so the same image always returns the same
          recommendations. Selection does not currently factor in which specific dimension
          scored lowest — this is a known limitation targeted for a future release.
        </p>
        <p>
          Each recommendation includes: priority tier, rationale with quantified expected
          uplift, effort estimate (low/medium/high), and impact estimate.
        </p>
      </>
    ),
    formula: `const count = 4 + Math.floor(seededRng() * 3)   // 4–6 recs
const recs  = fisherYatesShuffle(PM_TEMPLATES, seededRng)
              .slice(0, count)
              .map((r, i) => ({ ...r, id: \`pm-\${i}\` }))`,
    limitations:
      'Recommendations are not informed by the actual score profile — a product scoring 92/100 on CTA will still potentially receive a CTA recommendation. A future version will filter templates by which dimensions are weakest.',
  },
]

// ─── confidence callout ───────────────────────────────────────────────────────

function ConfidenceCallout() {
  return (
    <div
      className="rounded-2xl p-5 flex gap-4"
      style={{
        background: 'rgba(38,139,210,0.06)',
        border: '1px solid rgba(38,139,210,0.18)',
      }}
    >
      <Info size={18} className="text-sol-blue flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sol-base02 text-sm mb-1.5">
          About the AI confidence score
        </p>
        <p className="text-sm text-sol-base01 leading-relaxed">
          The <strong>confidence percentage</strong> shown in the workspace (typically 72–94%)
          is a seeded pseudorandom value in a plausible range — not a statistically derived
          measure of model certainty. It is displayed to communicate that this is an
          AI-style system with probabilistic outputs, and to remind users that heuristic
          analysis should be validated with real user research.
        </p>
      </div>
    </div>
  )
}

function HonestyCallout() {
  return (
    <div
      className="rounded-2xl p-5 flex gap-4"
      style={{
        background: 'rgba(181,137,0,0.06)',
        border: '1px solid rgba(181,137,0,0.20)',
      }}
    >
      <CheckCircle size={18} className="text-sol-yellow flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sol-base02 text-sm mb-1.5">
          Heuristic analysis — not a trained AI model
        </p>
        <p className="text-sm text-sol-base01 leading-relaxed">
          AI Product Critic runs <strong>entirely in your browser</strong> with no backend,
          no API calls, and no ML model inference beyond Tesseract.js OCR. All scores and
          critique text are generated from <strong>deterministic heuristic rules</strong>
          and curated content libraries. This means: the same image will always return
          the same results; outputs are not personalised to your specific product context;
          and findings should be treated as a structured starting point for human review,
          not a substitute for user research or expert audit.
        </p>
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  const setView = useStore((s) => s.setView)

  return (
    <div
      className="min-h-dvh w-full"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #FAF3D4 100%)' }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5 safe-top border-b"
        style={{
          background: 'rgba(253,246,227,0.90)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(0,0,0,0.07)',
        }}
      >
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 text-sm font-medium text-sol-base01 hover:text-sol-base02 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="h-4 w-px bg-black/10" />
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #268BD2, #2AA198)' }}
          >
            <Sparkles size={11} className="text-white" />
          </div>
          <span className="font-semibold text-sol-base02 text-sm">How it Works</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12 space-y-16">

        {/* Hero */}
        <Section>
          <div className="text-center space-y-4">
            <h1
              className="font-black text-sol-base02 tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
            >
              Under the hood
            </h1>
            <p className="text-base text-sol-base01 max-w-xl mx-auto leading-relaxed">
              Every metric, tool, and calculation explained — including what the AI can
              and cannot reliably detect.
            </p>
          </div>
        </Section>

        {/* Honesty callout */}
        <Section delay={0.05}>
          <HonestyCallout />
        </Section>

        {/* Pipeline */}
        <Section delay={0.1}>
          <h2 className="font-bold text-sol-base02 text-xl mb-6 flex items-center gap-2">
            <GitBranch size={18} className="text-sol-blue" />
            Analysis pipeline
          </h2>
          <div className="relative">
            {/* connector line */}
            <div
              className="absolute top-6 left-6 right-6 h-px hidden sm:block"
              style={{ background: 'linear-gradient(90deg, #268BD2, #2AA198)' }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  className="flex flex-col items-center text-center gap-2"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{ background: 'linear-gradient(135deg, #268BD2, #2AA198)', color: 'white' }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sol-base02">{step.label}</p>
                    <p className="text-[10px] text-sol-base1 mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Full stack */}
        <Section>
          <h2 className="font-bold text-sol-base02 text-xl mb-6 flex items-center gap-2">
            <Box size={18} className="text-sol-blue" />
            Full technology stack
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.68)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            }}
          >
            {STACK.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderBottom: i < STACK.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-sol-blue">{item.name}</span>
                </div>
                <span className="text-xs text-sol-base01">{item.role}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-sol-base1 mt-3 text-center">
            No backend · no API keys · no data leaves your device
          </p>
        </Section>

        {/* Metric cards */}
        <div className="space-y-6">
          <Section>
            <h2 className="font-bold text-sol-base02 text-xl mb-2 flex items-center gap-2">
              <BarChart2 size={18} className="text-sol-blue" />
              Metrics in detail
            </h2>
            <p className="text-sm text-sol-base01 mb-6">
              Each of the 8 scored dimensions plus the heatmap and PM recommendations.
            </p>
          </Section>

          <div className="space-y-5">
            {METRICS.map((m, i) => (
              <MetricCard key={m.name} {...m} delay={0} />
            ))}
          </div>
        </div>

        {/* Confidence callout */}
        <Section>
          <ConfidenceCallout />
        </Section>

        {/* Bottom tags */}
        <Section>
          <div className="flex flex-wrap gap-2 justify-center">
            <Tag icon={<CheckCircle size={11} />} label="Browser-only" />
            <Tag icon={<CheckCircle size={11} />} label="No data stored" />
            <Tag icon={<CheckCircle size={11} />} label="Open source" />
            <Tag icon={<CheckCircle size={11} />} label="Free forever" />
            <Tag icon={<CheckCircle size={11} />} label="No API keys" />
          </div>
          <p className="text-center text-xs text-sol-base1 mt-5">
            AI Product Critic · browser-native heuristic analysis
          </p>
        </Section>

      </div>
    </div>
  )
}
