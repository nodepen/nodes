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

    const id = 'a01e621ca9fb21c9b081e600d8197592'

    const v = new Viewer(container.current, { showStats: true, environmentSrc: '' })
    viewer.current = v
    v.init()
      .then(() => {
        console.log('OK!')
        return v.loadObject(
          `http://localhost:3000/streams/b0d3a3c122/objects/${id}`,
          '8ac998dd805648be63a69a8e0480d07a1e06c6465e'
        )
      })
      // .then(() => {
      //   console.log('Loaded!')
      // })
      .catch((e) => {
        console.log(`Failed to load object ${id}`)
        console.error(e)
      })
  })

  return <div className="np-w-full np-h-full np-pointer-events-auto" ref={container} />
}

export default React.memo(SpeckleViewer)
