import React, { useEffect, useCallback } from 'react'
import { useHotkeyDispatch } from 'features/graph/store/hotkey/hooks'

const KeyboardObserver = (): React.ReactElement => {
  const { setKey, clearKeys } = useHotkeyDispatch()

  const handlePointerEnter = useCallback((): void => {
    clearKeys()
  }, [clearKeys])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      setKey({ key: e.keyCode === 32 ? 'space' : e.key, pressed: true })

      const prevent: string[] = []

      if (prevent.includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    },
    [setKey]
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      setKey({ key: e.keyCode === 32 ? 'space' : e.key, pressed: false })
    },
    [setKey]
  )

  useEffect(() => {
    window.document.documentElement.addEventListener('mouseenter', handlePointerEnter)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.document.documentElement.removeEventListener('mouseenter', handlePointerEnter)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })
  return <></>
}

export default React.memo(KeyboardObserver)
