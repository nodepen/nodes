import React, { useRef } from 'react'
import { useStore } from '$'

type CameraManagerProps = {
  children?: React.ReactNode
}

const CameraManager = ({ children }: CameraManagerProps): React.ReactElement => {
  const cameraScreenRef = useRef<HTMLDivElement>(null)

  return (
    <div className="np-w-full np-h-full" ref={cameraScreenRef}>
      {children}
    </div>
  )
}

export default React.memo(CameraManager)
