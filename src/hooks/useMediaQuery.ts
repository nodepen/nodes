import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    return typeof window !== 'undefined' && window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    setMatches(mediaQuery.matches)

    const handleQueryChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleQueryChange)
    }
  }, [query])

  return matches
}
