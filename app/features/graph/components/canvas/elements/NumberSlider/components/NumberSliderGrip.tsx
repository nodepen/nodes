import React, { useEffect } from 'react'
import { GripContainer, GripIcon, useGripContext } from '../../../common'

const NumberSliderGrip = (): React.ReactElement => {
  const { gripRef, register } = useGripContext()

  useEffect(() => {
    register([-6, 2])
  }, [])

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full" style={{ left: -7 }}>
        <div ref={gripRef} className="w-full h-full flex items-center">
          <GripIcon mode="output" />
        </div>
      </div>
    </div>
  )
}

type NumberSliderGripContainerProps = {
  elementId: string
}

export const NumberSliderGripContainer = ({ elementId }: NumberSliderGripContainerProps): React.ReactElement => {
  return (
    <GripContainer elementId={elementId} parameterId={'output'} mode="output">
      <NumberSliderGrip />
    </GripContainer>
  )
}
