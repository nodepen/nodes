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
  lockSelection: () => void
}

export const NumberSliderGripContainer = ({
  elementId,
  lockSelection,
}: NumberSliderGripContainerProps): React.ReactElement => {
  return (
    <GripContainer
      elementId={elementId}
      parameterId={'output'}
      mode="output"
      onClick={() => {
        lockSelection()
        console.log('param clicked!')
      }}
    >
      <NumberSliderGrip />
    </GripContainer>
  )
}
