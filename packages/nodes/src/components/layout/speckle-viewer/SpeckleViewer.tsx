import React, { useRef, useEffect } from 'react'
import { Viewer } from '@speckle/viewer'
import { useStore } from '$'

const SpeckleViewer = (): React.ReactElement => {
  const container = useStore((store) => store.registry.modelRoot)

  const viewer = useRef<Viewer>()

  useEffect(() => {
    if (viewer.current) {
      return
    }

    if (!container.current) {
      return
    }

    const v = new Viewer(container.current)
    v.init().then(() => {
      viewer.current = v
    })
  })

  return <div className="np-w-full np-h-full" ref={container} />
}

export default React.memo(SpeckleViewer)
