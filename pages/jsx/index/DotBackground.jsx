import { Component, lazy, Suspense, useEffect, useState } from 'react'

const DotGrid = lazy(() => import('../../../src/components/react-bits/DotGrid.jsx'))

class DotGridErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('DotGrid failed to load; using the solid hero background.', error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setReducedMotion(event.matches)

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}

export default function DotBackground() {
  const reducedMotion = usePrefersReducedMotion()
  const styles = getComputedStyle(document.documentElement)
  const baseColor = styles.getPropertyValue('--color-navy').trim()

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-hero-bg" aria-hidden="true">
      {!reducedMotion && (
        <DotGridErrorBoundary>
          <Suspense fallback={null}>
            <DotGrid
              className="opacity-70"
              dotSize={2.5}
              gap={20}
              baseColor={baseColor}
              activeColor={styles.getPropertyValue('--color-hero-foreground').trim()}
              proximity={150}
              strength={0.9}
              swell={0.65}
              stretch={0.3}
              glow={0.9}
              intro={false}
              clickShock={false}
            />
          </Suspense>
        </DotGridErrorBoundary>
      )}
    </div>
  )
}
