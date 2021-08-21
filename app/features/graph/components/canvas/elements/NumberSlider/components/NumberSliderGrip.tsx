import React, { useEffect, useRef } from 'react'
import { GripIcon, useGripContext } from '../../../common'

export const NumberSliderGrip = (): React.ReactElement => {
  const { gripRef, register } = useGripContext()

  useEffect(() => {
    register()
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
