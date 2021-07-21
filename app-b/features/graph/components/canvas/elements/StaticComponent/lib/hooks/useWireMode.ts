import { useState, useEffect, useCallback } from 'react'

type PointerMode = 'default' | 'add' | 'remove'

export const useWireMode = (primaryPointerId?: number): PointerMode => {
  const [mode, setMode] = useState<PointerMode>('default')

  const nextMode = useCallback((current: PointerMode): PointerMode => {
    const next: { [key in PointerMode]: PointerMode } = {
      default: 'add',
      add: 'remove',
      remove: 'default',
    }

    return next[current]
  }, [])

  // Consider hotkeys

  // Toggle on second tap
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (primaryPointerId && e.pointerId === primaryPointerId) {
        return
      }

      setMode(nextMode(mode))
    },
    [mode, primaryPointerId, nextMode]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (primaryPointerId && e.pointerId === primaryPointerId) {
        setMode('default')
      }
    },
    [primaryPointerId]
  )

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  if (!primaryPointerId) {
    // Wire creation is not in progress, do no work
    return 'default'
  }

  return mode
}
