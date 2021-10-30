import React, { useEffect } from 'react'
import { GripContainer, GripIcon, useGripContext } from '../../../common'
import { useCameraZoomLevel } from 'features/graph/store/camera/hooks'

type PanelGripProps = {
  mode: 'input' | 'output'
}

const PanelGrip = ({ mode }: PanelGripProps): React.ReactElement => {
  const { gripRef, register } = useGripContext()
  const zoomLevel = useCameraZoomLevel()

  useEffect(() => {
    register([0, 2])
  }, [])

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full" style={{ left: mode === 'input' ? -8 : 8 }}>
        <div ref={gripRef} className="w-full h-full flex items-center">
          <GripIcon mode={mode} shadow={zoomLevel !== 'far'} />
        </div>
      </div>
    </div>
  )
}

type PanelGripContainerProps = {
  elementId: string
  mode: 'input' | 'output'
}

export const PanelGripContainer = ({ elementId, mode }: PanelGripContainerProps): React.ReactElement => {
  return (
    <GripContainer elementId={elementId} parameterId={mode} mode={mode}>
      <PanelGrip mode={mode} />
    </GripContainer>
  )
}
