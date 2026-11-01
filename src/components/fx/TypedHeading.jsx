import { useEffect, useRef, useState } from 'react'
import TextType from '../react-bits/TextType'

export default function TypedHeading({ text, className = '' }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [shouldAnimate, setShouldAnimate] = useState(() => !prefersReducedMotion)
  const hasStartedTyping = useRef(prefersReducedMotion || shouldAnimate)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches)

      if (query.matches) {
        hasStartedTyping.current = true
        setShouldAnimate(false)
      } else if (!hasStartedTyping.current) {
        hasStartedTyping.current = true
        setShouldAnimate(true)
      }
    }

    updatePreference()
    query.addEventListener('change', updatePreference)
    return () => query.removeEventListener('change', updatePreference)
  }, [])

  if (prefersReducedMotion || !shouldAnimate) {
    return <span className={className}>{text}</span>
  }

  return (
    <TextType
      as="span"
      className={className}
      text={text}
      typingSpeed={60}
      loop={false}
      showCursor
      cursorCharacter="|"
      cursorBlinkDuration={0}
      initialDelay={300}
    />
  )
}
