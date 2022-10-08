import React, { useRef, useEffect } from 'react'
import { Viewer, DefaultViewerParams } from '@speckle/viewer'
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

    const v = new Viewer(container.current, { showStats: true, environmentSrc: '' })
    viewer.current = v
    v.init()
      .then(() => {
        console.log('OK!')
        return v.loadObject(
          'http://localhost:3000/streams/b0d3a3c122/objects/1a3e431a1e89b2c864aef3729d461a0a',
          '8ac998dd805648be63a69a8e0480d07a1e06c6465e'
        )
      })
      // .then(() => {
      //   console.log('Loaded!')
      // })
      .catch((e) => {
        console.error(e)
      })
  })

  return <div className="np-w-full np-h-full np-pointer-events-auto" ref={container} />
}

export default React.memo(SpeckleViewer)
