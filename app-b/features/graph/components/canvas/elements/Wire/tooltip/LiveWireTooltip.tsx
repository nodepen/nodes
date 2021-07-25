import { useCallback } from 'react'
import { WireMode } from 'features/graph/store/graph/types'
import { PointerTooltip } from 'features/graph/components/overlay'

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

  return (
    <PointerTooltip
      initialPosition={initialPosition}
      offset={[25, 25]}
      pointerFilter={[initialPointer]}
      pointerTypeFilter={[]}
    >
      {getTooltip(mode)}
    </PointerTooltip>
  )
}
