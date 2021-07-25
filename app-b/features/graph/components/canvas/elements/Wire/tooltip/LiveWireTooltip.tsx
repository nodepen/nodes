import { useState, useEffect, useCallback } from 'react'
import { WireMode } from '@/features/graph/store/graph/types'
import { MouseTooltip } from '@/features/graph/components/overlay'

export const LiveWireTooltip = (
  initialPosition: [number, number],
  initialPointer: number,
  mode: WireMode | 'transpose'
): React.ReactElement => {
  const [position, setPosition] = useState(initialPosition)

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

  return <></>
}
