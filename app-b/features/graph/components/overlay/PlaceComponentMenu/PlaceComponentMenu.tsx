import React from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'

type PlaceComponentMenuProps = {
  /** Position to place element in screen coordinate space. */
  position: [left: number, top: number]
  onClose: () => void
}

export const PlaceComponentMenu = ({ position }: PlaceComponentMenuProps): React.ReactElement => {
  const { addElement } = useGraphDispatch()
  const { library } = useGraphManager()

  return (
    <OverlayPortal>
      <OverlayContainer static position={position}>
        <div className="w-full h-full bg-green"></div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
