import { useCallback, useRef } from 'react'
import type { TooltipConfiguration } from '../../types'
import { useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'

export const useTooltip = (tooltipKey: string, tooltipConfig: TooltipConfiguration): void => {
  const { isSticky } = tooltipConfig

  const { apply } = useDispatch()

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (isSticky) {
        return
      }

      switch (e.pointerType) {
        case 'mouse': {
          apply((state) => {
            delete state.registry.tooltips[tooltipKey]
          })
          break
        }
        default: {
          return
        }
      }
    },
    [tooltipKey, isSticky]
  )

  // TODO: Do ts right here and let `useImperativeEvent` accept `document`
  const documentRef = useRef(document as unknown as HTMLElement)

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove)
}
