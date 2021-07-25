import { useEffect, useState, useCallback, useRef } from 'react'
import { WireMode } from 'features/graph/store/graph/types'
import { useWireMode } from '@/features/graph/store/hotkey/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { useScreenSpaceToCameraSpace } from '@/features/graph/hooks'

type LiveWireMode = WireMode | 'transpose'

export const useLiveWireMotion = (initialMode: WireMode, initialPointer: number): LiveWireMode => {
  const { updateLiveWires, endLiveWires } = useGraphDispatch()
  const screenSpaceToCameraSpace = useScreenSpaceToCameraSpace()

  const [internalMode, setInternalMode] = useState<LiveWireMode>(initialMode)
  const hotkeyMode = useWireMode()

  const mode = hotkeyMode === 'default' ? internalMode : hotkeyMode

  const primaryPointerId = useRef<number>(initialPointer)

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerId !== primaryPointerId.current) {
        return
      }

      const { pageX: ex, pageY: ey } = e

      const [x, y] = screenSpaceToCameraSpace([ex, ey])

      updateLiveWires(x, y)
    },
    [screenSpaceToCameraSpace, updateLiveWires]
  )

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.pointerId === primaryPointerId.current) {
        return
      }

      const nextMode: { [key in LiveWireMode]: LiveWireMode } = {
        default: 'add',
        add: 'remove',
        remove: 'transpose',
        transpose: 'default',
      }

      const next = nextMode[mode]

      setInternalMode(next)

      // TODO: Handle transpose case. Requires deleting and re-creating live wires?
    },
    [mode]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (e.pointerId !== primaryPointerId.current) {
        return
      }

      endLiveWires(mode === 'transpose' ? 'default' : mode)
    },
    [mode, endLiveWires]
  )

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  return mode
}
