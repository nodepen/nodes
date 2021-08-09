import React, { useEffect, useCallback } from 'react'
import { useHotkeyDispatch } from 'features/graph/store/hotkey/hooks'

const KeyboardObserver = (): React.ReactElement => {
  const { setKey } = useHotkeyDispatch()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      setKey({ key: e.key, pressed: true })

      if (e.key.toLowerCase() === 'd') {
        e.preventDefault()
      }
    },
    [setKey]
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      setKey({ key: e.key, pressed: false })
    },
    [setKey]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })
  return <></>
}

export default React.memo(KeyboardObserver)
