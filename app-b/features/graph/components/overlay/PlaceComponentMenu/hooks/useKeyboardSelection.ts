import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Collection of event listeners and handlers that manage up/down keyboard selection of options.
 * @remarks For parity with grasshopper, we pass the possible shortcut because any match resets the keyboard offset.
 */
export const useKeyboardSelection = (
  onEnter: () => void,
  positiveDirection: 'up' | 'down',
  textMatchId?: string,
  shortcutMatchId?: string
): number => {
  const [offset, setOffset] = useState(0)

  const textMatch = useRef<string>()
  const shortcutMatch = useRef<string>()

  useEffect(() => {
    if (offset === 0) {
      if (textMatchId) {
        textMatch.current = textMatchId
      }

      if (shortcutMatchId) {
        shortcutMatch.current = shortcutMatchId
      }
      return
    }

    if (textMatchId && textMatchId !== textMatch.current) {
      textMatch.current = textMatchId
      setOffset(0)
    }

    if (shortcutMatchId && shortcutMatchId !== shortcutMatch.current) {
      shortcutMatch.current = shortcutMatchId
      setOffset(0)
    }
  }, [textMatchId, shortcutMatchId, offset])

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
