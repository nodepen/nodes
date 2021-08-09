import { WireMode } from 'features/graph/store/graph/types'
import { PointerTooltip } from 'features/graph/components/overlay'
import { useSessionManager } from 'context/session'
import { getWireModeTooltip } from 'features/graph/utils'

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

  const offset: [number, number] = device.breakpoint === 'sm' ? [0, -50] : [25, 25]

  return (
    <PointerTooltip
      initialPosition={initialPosition}
      offset={offset}
      pointerFilter={[initialPointer]}
      pointerTypeFilter={[]}
    >
      {getWireModeTooltip(mode)}
    </PointerTooltip>
  )
}
