import { useEffect, useState, useCallback, useRef } from 'react'
import { WireMode } from 'features/graph/store/graph/types'
import { useWireMode } from 'features/graph/store/hotkey/hooks'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useScreenSpaceToCameraSpace } from 'features/graph/hooks'

type LiveWireMode = WireMode | 'transpose'

export const useLiveWireMotion = (
  initialMode: WireMode,
  initialPointer: number,
  isTranspose: boolean,
  isPrimary: boolean
): LiveWireMode => {
  const { updateLiveWires, endLiveWires } = useGraphDispatch()
  const screenSpaceToCameraSpace = useScreenSpaceToCameraSpace()

  const [internalMode, setInternalMode] = useState<LiveWireMode>(initialMode)
  const hotkeyMode = useWireMode()

  const mode =
    hotkeyMode === 'default' ? internalMode : hotkeyMode === 'transpose' && !isTranspose ? 'default' : hotkeyMode

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
      if (isTranspose) {
        return
      }

      if (e.pointerId === primaryPointerId.current) {
        return
      }

      if (e.pointerType === 'mouse') {
        // If using a mouse, defer to hotkey toggles only
        return
      }

      const nextMode: { [key in LiveWireMode]: WireMode } = {
        default: 'add',
        add: 'remove',
        remove: 'default',
        transpose: 'default',
      }

      const next = nextMode[mode]

      // if (isPrimary && next === 'transpose') {
      //   // Cancel wires and reset with a transpose at origin
      //   const state = store.getState().graph.present

      //   const templates = stageWireTranspose(state, origin.elementId, origin.parameterId, initialPointer)

      //   if (templates.length === 0) {
      //     // Transpose is not possible from this parameter, skip to `default`
      //     setInternalMode('default')
      //     return
      //   }

      //   endLiveWires('cancel')
      //   startLiveWires({ templates, origin })
      // }

      // if (isPrimary && next === 'default') {
      //   // Cancel wires and reset with a new wire from origin
      //   const state = store.getState().graph.present
      //   const originElement = state.elements[origin.elementId]

      //   const parameterType = isInputOrOutput(originElement, origin.parameterId)

      //   if (!parameterType) {
      //     console.log('🐍🐍🐍 Tried to start live wire from a parameter that is not an input or an output!')
      //     return
      //   }

      //   const connection = {
      //     from: parameterType === 'output' ? origin : undefined,
      //     to: parameterType === 'input' ? origin : undefined,
      //   } as any

      //   endLiveWires('cancel')
      //   startLiveWires({
      //     templates: [
      //       {
      //         type: 'wire',
      //         mode: 'live',
      //         initial: {
      //           mode: 'default',
      //           pointer: initialPointer,
      //         },
      //         transpose: false,
      //         ...connection,
      //       },
      //     ],
      //     origin,
      //   })
      // }

      // Toggle to next mode
      setInternalMode(next)
    },
    [mode, isTranspose]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (e.pointerId !== primaryPointerId.current) {
        return
      }

      if (e.button === 1) {
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

  useEffect(() => {
    if (!isPrimary) {
      return
    }

    if (isTranspose && !(hotkeyMode === 'transpose' || hotkeyMode === 'default')) {
      endLiveWires('cancel')
    }
  }, [isPrimary, isTranspose, hotkeyMode, endLiveWires])

  // useEffect(() => {
  //   if (!isPrimary) {
  //     return
  //   }

  //   if (mode !== 'transpose' && isTranspose) {
  //     endLiveWires('cancel')
  //   }
  // }, [mode, isTranspose, isPrimary, endLiveWires])

  return mode
}
