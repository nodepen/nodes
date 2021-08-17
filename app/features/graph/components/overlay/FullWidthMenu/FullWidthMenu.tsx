import React from 'react'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type FullWidthMenuProps = {
  children: JSX.Element
}

const FullWidthMenu = ({ children }: FullWidthMenuProps): React.ReactElement => {
  return (
    <OverlayPortal>
      <OverlayContainer position={[0, 0]} static>
        <div className="w-full bg-green overflow-auto" style={{ height: 'calc(100vh - 40px)' }}>
          {children}
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}

export default React.memo(FullWidthMenu)
