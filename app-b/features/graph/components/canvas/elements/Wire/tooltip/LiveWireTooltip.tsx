import { useCallback } from 'react'
import { WireMode } from 'features/graph/store/graph/types'
import { PointerTooltip } from 'features/graph/components/overlay'
import { useSessionManager } from '@/context/session'

type LiveWireTooltipProps = {
  initialPosition: [number, number]
  initialPointer: number
  mode: WireMode | 'transpose'
}

export const LiveWireTooltip = ({
  initialPosition,
  initialPointer,
  mode,
}: LiveWireTooltipProps): React.ReactElement => {
  const { device } = useSessionManager()

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

  const offset: [number, number] = device.breakpoint === 'sm' ? [0, -50] : [25, 25]

  return (
    <PointerTooltip
      initialPosition={initialPosition}
      offset={offset}
      pointerFilter={[initialPointer]}
      pointerTypeFilter={[]}
    >
      {getTooltip(mode)}
    </PointerTooltip>
  )
}
