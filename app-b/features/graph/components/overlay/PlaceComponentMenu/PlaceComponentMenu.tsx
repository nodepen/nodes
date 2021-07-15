import React from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'
import { useOverlayOffset } from '../hooks'

type PlaceComponentMenuProps = {
  /** Position to place element in screen coordinate space. */
  position: [sx: number, sy: number]
  onClose: () => void
}

export const PlaceComponentMenu = ({ position: screenPosition }: PlaceComponentMenuProps): React.ReactElement => {
  const { addElement } = useGraphDispatch()
  const { library, registry } = useGraphManager()

  const position = useOverlayOffset(screenPosition)

  return (
    <OverlayPortal>
      <OverlayContainer static position={[0, 0]}>
        <div className="w-full h-full flex flex-col bg-green">
          <div className="w-full h-12 p-2">
            <div className="w-full h-full flex items-center p-1 pl-2 pr-2 rounded-md bg-pale">
              <div className="w-6 h-6 mr-2 rounded-sm bg-swampgreen" />
              <input className="h-6 flex-grow rounded-sm bg-pale" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
            </div>
          </div>
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
