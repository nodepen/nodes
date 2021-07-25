import React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '$'
import { useWireMode } from 'features/graph/store/hotkey/hooks'
import { getConnectedWires } from '@/features/graph/store/graph/utils'

type WireModeTooltipProps = {
  source: {
    elementId: string
    parameterId: string
  }
}

const WireModeTooltip = ({ source }: WireModeTooltipProps): React.ReactElement => {
  const mode = useWireMode()
  const store = useAppStore()

  const sourceReference = useRef<[string, string]>([source.elementId, source.parameterId])

  const getTooltip = useCallback((type: typeof mode): JSX.Element => {
    switch (type) {
      case 'default': {
        return <>D</>
      }
      case 'add': {
        return <>+</>
      }
      case 'remove': {
        return <>-</>
      }
      case 'transpose': {
        return <>~~~</>
      }
    }
  }, [])

  const [tooltip, setTooltip] = useState<JSX.Element>(() => getTooltip('default'))

  useEffect(() => {
    switch (mode) {
      case 'transpose': {
        // Verify that we can show transpose

        // Check if there are live wires
        const liveWires = Object.values(store.getState().graph.present.elements).filter(
          (element) => element.template.type === 'wire' && element.template.mode === 'live'
        )

        if (liveWires.length > 0) {
          // Current live wires are transpose wires
          const allTranspose = !liveWires.some(
            (wire) => wire.template.type === 'wire' && wire.template.mode === 'live' && !wire.template.transpose
          )

          if (allTranspose) {
            // Set the transpose tooltip
            setTooltip(getTooltip('transpose'))
            break
          }
        } else {
          // Current parameter has connections
          const [elementId, parameterId] = sourceReference.current

          const connectionCount = getConnectedWires(store.getState().graph.present, elementId, parameterId).reduce(
            (count, group) => count + group.length,
            0
          )

          if (connectionCount > 0) {
            // Set the transpose tooltip
            setTooltip(getTooltip('transpose'))
            break
          }
        }

        setTooltip(getTooltip('default'))
        break
      }
      default: {
        setTooltip(getTooltip(mode))
      }
    }
  }, [mode, store, getTooltip])

  return tooltip
}

export default React.memo(WireModeTooltip)
