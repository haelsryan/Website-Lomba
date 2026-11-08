import { useEffect, useRef, useState } from 'react'

/**
 * GooeyNav - Unified Fluid Navigation Component
 * Inspired by ReactBits Gooey Nav (https://reactbits.dev/c/components/gooey-nav)
 * Features fluid pill morphing, theme awareness, and responsive sizing.
 */
export function GooeyNav({
  items = [],
  activeId,
  onChange,
  role = 'tablist',
  ariaLabel = 'Navigasi',
  className = '',
  itemClassName = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  orientation = 'horizontal', // 'horizontal' | 'vertical'
}) {
  const containerRef = useRef(null)
  const [indicatorStyle, setIndicatorStyle] = useState({
    opacity: 0,
    transform: 'translate(0px, 0px)',
    width: 0,
    height: 0,
  })

  // Update pill position when active item changes or window resizes
  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return
      const activeElement = containerRef.current.querySelector(
        `[data-nav-id="${activeId}"]`
      )
      if (!activeElement) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
        return
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()

      const left = activeRect.left - containerRect.left
      const top = activeRect.top - containerRect.top

      setIndicatorStyle({
        opacity: 1,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        width: activeRect.width,
        height: activeRect.height,
      })
    }

    updateIndicator()

    // Observe size changes
    const resizeObserver = new ResizeObserver(updateIndicator)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    window.addEventListener('resize', updateIndicator)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeId, items])

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-xs sm:text-sm py-2 px-3.5',
    lg: 'text-sm sm:text-base py-2.5 px-4',
  }[size] || sizeClasses.md

  return (
    <div
      ref={containerRef}
      role={role}
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={`relative inline-flex items-center gap-1 rounded-2xl p-1 bg-surface/60 backdrop-blur-md border border-line/50 shadow-inner ${
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      } ${className}`}
    >
      {/* Morphing Gooey Pill Indicator */}
      <div
        aria-hidden="true"
        className="gooey-nav-indicator pointer-events-none absolute left-0 top-0 rounded-xl bg-primary text-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={indicatorStyle}
      >
        {/* Subtle luminous highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Nav Items */}
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            data-nav-id={item.id}
            role={role === 'tablist' ? 'tab' : 'button'}
            aria-selected={role === 'tablist' ? isActive : undefined}
            aria-pressed={role !== 'tablist' ? isActive : undefined}
            onClick={() => onChange?.(item.id)}
            className={`relative z-10 inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-xl whitespace-nowrap select-none ${sizeClasses} ${
              isActive
                ? 'text-white font-semibold'
                : 'text-muted hover:text-ink'
            } ${itemClassName}`}
          >
            {item.icon && <span className="mr-1.5 shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

