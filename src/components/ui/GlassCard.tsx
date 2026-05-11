import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'surface'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
  hoverable?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      variant = 'default',
      padding = 'md',
      rounded = 'xl',
      hoverable = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          variant === 'default' && 'glass-panel',
          variant === 'strong'  && 'glass-panel-strong',
          variant === 'surface' && 'glass-surface',
          padding === 'none' && 'p-0',
          padding === 'sm'   && 'p-3',
          padding === 'md'   && 'p-5',
          padding === 'lg'   && 'p-7',
          rounded === 'md'   && 'rounded-lg',
          rounded === 'lg'   && 'rounded-xl',
          rounded === 'xl'   && 'rounded-2xl',
          rounded === '2xl'  && 'rounded-3xl',
          hoverable && 'transition-all duration-200 hover:shadow-glass-lg hover:-translate-y-0.5 cursor-pointer',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
GlassCard.displayName = 'GlassCard'

export default GlassCard
