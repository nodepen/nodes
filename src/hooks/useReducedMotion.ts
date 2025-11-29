// Based on hook implementation by vanaf1979
// https://gist.github.com/vanaf1979/f5e680f6b947d92703a52b592d244a8a#file-use-reduced-motion-hook-js

import { useState, useEffect, useCallback } from 'react'

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const handleQueryChange = useCallback((e: MediaQueryListEvent) => {
    setPrefersReducedMotion(e.matches)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!mediaQuery) {
      return
    }

    setPrefersReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleQueryChange)
    }
  }, [])

  return prefersReducedMotion
}
