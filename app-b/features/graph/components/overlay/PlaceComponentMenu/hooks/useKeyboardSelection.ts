import { useEffect, useState, useCallback } from 'react'

/**
 * Collection of event listeners and handlers that manage up/down keyboard selection of options.
 * @remarks For parity with grasshopper, we pass the possible shortcut because any match resets the keyboard offset.
 */
export const useKeyboardSelection = (
  onEnter: () => void,
  positiveDirection: 'up' | 'down',
  shortcutMatch: boolean
): number => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (shortcutMatch && offset !== 0) {
      setOffset(0)
    }
  }, [shortcutMatch, offset])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowdown': {
          setOffset((current) => {
            const delta = positiveDirection === 'down' ? 1 : -1
            const next = current + delta
            return next >= 0 ? next : current
          })
          break
        }
        case 'arrowup': {
          setOffset((current) => {
            const delta = positiveDirection === 'up' ? 1 : -1
            const next = current + delta
            return next >= 0 ? next : current
          })
          break
        }
        case 'enter': {
          onEnter()
          break
        }
      }
      console.log(e.key)
    },
    [onEnter, positiveDirection]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  return offset
}
