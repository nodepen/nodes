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
        <div className="w-full h-full pt-10 flex flex-col bg-green">
          <div className="w-full h-12 p-2">
            <div className="w-full h-full flex items-center p-1 pl-2 pr-2 rounded-md bg-pale">
              <div className="w-6 h-6 mr-2 rounded-sm bg-swampgreen" />
              <input className="h-6 flex-grow rounded-sm bg-swampgreen" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
            </div>
          </div>
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
